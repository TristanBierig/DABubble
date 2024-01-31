import { Injectable, OnDestroy, inject } from '@angular/core';
import {
  Firestore,
  query,
  collection,
  where,
  getDoc,
  doc,
  getDocs,
} from '@angular/fire/firestore';
import { User } from '../models/user.class';
import { FirestoreService } from './firestore.service';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { IMessagePanel } from '../interfaces/chats/types';
import {
  privatChatConverter,
  userConverter,
} from '../interfaces/firestore/converter';
import { Chat } from '../models/chat.class';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class SidebarService implements OnDestroy {
  firestore: Firestore = inject(Firestore);
  firestoreService: FirestoreService = inject(FirestoreService);
  auth: AuthService = inject(AuthService);

  public currentUserIsDestroyed$ = new Subject<boolean>();
  public currentUser!: User;
  public privateChats: Chat[] = [];
  public privateChatsPanelData: IMessagePanel[] = [];

  public privateChatsPanelDataSubject: BehaviorSubject<IMessagePanel[]> =
    new BehaviorSubject<IMessagePanel[]>([]);

  constructor() {
    this.firestoreService.currentUserSubject
      .pipe(takeUntil(this.currentUserIsDestroyed$))
      .subscribe((user: User) => {
        this.currentUser = user;
        this.loadPrivateChats();
      });
  }

  ngOnDestroy(): void {
    this.currentUserIsDestroyed$.next(true);
    this.currentUserIsDestroyed$.complete();
    this.privateChatsPanelDataSubject.complete();
  }

  async loadPrivateChats() {
    // Ignores before first emit from currentUser
    if (!this.currentUser) return;
    this.privateChats = [];

    // Query for all privateChat Documents from User
    const q = query(
      collection(this.firestore, 'privateChat'),
      where('id', 'in', this.currentUser.activePrivateChats)
    ).withConverter(privatChatConverter);

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      if (
        // Cancel if object is already in Array
        this.privateChats.some((chat: Chat) => chat.id === doc.data()['id'])
      ) {
        return;
      } else {
        // Push in stack Array
        this.privateChats.push(doc.data());
      }
    });
    this.loadUserFromPrivateChats();
  }

  loadUserFromPrivateChats() {
    this.privateChatsPanelData = [];

    this.privateChats.forEach(async (chat: Chat) => {
      if (
        // Determine if chat is chat of the user itself and if its already in the array
        chat.chatBetween.length === 1 &&
        !this.privateChatsPanelData.some(
          (chat: IMessagePanel) => chat.id === this.currentUser.id
        )
      ) {
        // Define data and push to Template Array that gets rendered
        const selfData = {
          id: this.currentUser.id,
          chatWith: this.currentUser,
        };
        this.privateChatsPanelData.push(selfData);
      } else {
        // Chat is with another user
        const index = chat.chatBetween.indexOf(this.currentUser.id);
        let userId;
        // Find index of the other user
        if (index === 0) {
          userId = chat.chatBetween[1];
        } else {
          userId = chat.chatBetween[0];
        }
        let userData: IMessagePanel;

        try {
          await getDoc(
            doc(this.firestore, 'user', userId).withConverter(userConverter)
          ).then((user) => {
            userData = {
              id: chat.id,
              chatWith: user.data()!,
            };
            if (
              // Cancel if object is already in Template array
              this.privateChatsPanelData.some(
                (chat: IMessagePanel) => chat.id === userData.id
              )
            ) {
              return;
            } else {
              this.privateChatsPanelData.push(userData);
            }
          });
        } catch (error) {}
      }
    });
    // Emit to subject
    this.privateChatsPanelDataSubject.next(this.privateChatsPanelData);
  }
}

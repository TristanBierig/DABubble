import { Injectable, inject } from '@angular/core';
import { Message } from '../models/message.class';
import {
  DocumentData,
  DocumentReference,
  Firestore,
  doc,
  runTransaction,
} from '@angular/fire/firestore';
import { User } from '../models/user.class';

import { ReactionEmoji } from '../interfaces/chats/types';

@Injectable({
  providedIn: 'root',
})
export class EmojiPickerService {
  firestore: Firestore = inject(Firestore);
  public openEmojiPicker: 'Main' | 'Edit' | 'Reaction' | '' = '';

  constructor() {}

  toggleEmojiPicker(target: 'Main' | 'Edit' | 'Reaction') {
    if (this.openEmojiPicker === target) {
      this.openEmojiPicker = '';
    } else {
      this.openEmojiPicker = target;
    }
  }

  async addReaction(
    currentUser: User,
    chatRecordId: string,
    msg: Message,
    event: any
  ) {
    const emoteID = event.emoji.id;
    const emoteURL = event.emoji.native;
    const docRef = doc(
      this.firestore,
      'chatRecords',
      chatRecordId,
      'messages',
      msg.id
    );

    // Checks for the emoji that may already exists as a reaction
    const emojiIndex: number = this.checkIfAlreadyReacted(msg, emoteID);

    if (emojiIndex !== -1) {
      // Checks if user already reacted with this emoji
      const userIndex: number = msg.reactions[emojiIndex].user.findIndex(
        (user) => user.id === currentUser.id
      );

      if (userIndex !== -1) {
        // CurrentUser already reacted with this existing emoji
        msg.reactions[emojiIndex].user.splice(userIndex, 1);

        // Delete upper Array of emoji if no one else reacted with this
        if (msg.reactions[emojiIndex].user.length === 0) {
          msg.reactions.splice(emojiIndex, 1);
        }

        this.startTransaction(docRef, msg.reactions);
      } else {
        // CurrentUser has not reacted with this existing emoji
        msg.reactions[emojiIndex].user.push({
          id: currentUser.id,
          name: currentUser.name,
        });
        this.startTransaction(docRef, msg.reactions);
      }
    } else {
      // Emoji does not exist yet
      const newEmoji = {
        id: emoteID,
        url: emoteURL,
        user: [
          {
            id: currentUser.id,
            name: currentUser.name,
          },
        ],
      };
      msg.reactions.push(newEmoji);

      this.startTransaction(docRef, msg.reactions);
    }
  }

  async startTransaction(
    docRef: DocumentReference<DocumentData>,
    data: ReactionEmoji[]
  ) {
    try {
      await runTransaction(this.firestore, async (transaction) => {
        const reactionDoc = await transaction.get(docRef);
        if (!reactionDoc.exists()) {
          throw 'Document does not exist!';
        }

        transaction.update(docRef, {
          reactions: data,
        });
      });
    } catch (e) {
      console.log('Transaction failed: ', e);
    }
  }

  checkIfAlreadyReacted(msg: Message, emoteID: string): number {
    return msg.reactions.findIndex((emoji) => emoji.id === emoteID);
  }
}

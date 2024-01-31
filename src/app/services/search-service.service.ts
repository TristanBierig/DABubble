import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { User } from '../models/user.class';
import { Channel } from '../models/channel.class';

@Injectable({
  providedIn: 'root',
})
export class SearchServiceService {
  firestore: Firestore = inject(Firestore);

  public matchedUsers: any = [];

  constructor() {}

  async searchForUser(searchTerm: string) {
    // Uppercases the first letter to match database
    const formattedSearch =
      searchTerm.charAt(0).toUpperCase() + searchTerm.slice(1);

    // Delete cache and return if search term is shorter than 2
    if (formattedSearch.length < 1) {
      this.matchedUsers = [];
      return;
    } else {
      // Search for User
      const q = query(
        collection(this.firestore, 'user'),
        where('name', '>=', formattedSearch),
        where('name', '<=', formattedSearch + '\uf8ff')
      );

      const querySnapshot = await getDocs(q);
      // Reset cache for every new entry so no filtering is needed,
      // when user backspaces in the input
      this.matchedUsers = [];
      querySnapshot.forEach((doc) => {
        // Return if User is already in cache
        if (
          this.matchedUsers.some((user: any) => user.id === doc.data()['id'])
        ) {
          return;
        } else {
          // Push found User to cache
          this.matchedUsers.push(doc.data());
        }
      });
    }
  }

  async addUserToChannel(user: User, channel: Channel) {
    const userRef = doc(this.firestore, 'user', user.id);
    const channelRef = doc(this.firestore, 'channels', channel.id);

    await updateDoc(userRef, {
      memberInChannel: arrayUnion(channel.id),
    });
    await updateDoc(channelRef, {
      member: arrayUnion(user.id),
    });
  }

  async deleteUserFromChannel(user: User, channel: Channel) {
    const userRef = doc(this.firestore, 'user', user.id);
    const channelRef = doc(this.firestore, 'channels', channel.id);

    await updateDoc(userRef, {
      memberInChannel: arrayRemove(channel.id),
    });
    await updateDoc(channelRef, {
      member: arrayRemove(user.id),
    });
  }
}

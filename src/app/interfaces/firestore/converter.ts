import { Chat } from 'src/app/models/chat.class';
import { User } from 'src/app/models/user.class';

export const userConverter = {
  toFirestore: (user: User) => {
    return {
      name: user.name,
      email: user.email,
      id: user.id,
      photoUrl: user.photoUrl,
      onlineStatus: user.onlineStatus,
      memberInChannel: user.memberInChannel,
      activePrivateChats: user.activePrivateChats,
    };
  },
  fromFirestore: (snapshot: any, options: any) => {
    const data = snapshot.data(options);
    return new User(data);
  },
};

export const privatChatConverter = {
  toFirestore: (chat: Chat) => {
    return {
      id: chat.id,
      chatBetween: chat.chatBetween,
      chatRecord: chat.chatRecord,
    };
  },
  fromFirestore: (snapshot: any, options: any) => {
    const data = snapshot.data(options);
    return new Chat(data);
  },
};

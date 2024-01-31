import { User } from 'src/app/models/user.class';

export type ChatTypes = 'channel' | 'thread' | 'private';

export interface AvatarConfig {
  user: User;
  showStatus: boolean;
  size: 'xsmall' | 'small' | 'medium' | 'large';
}

interface ReactionUser {
  id: string;
  name: string;
}

export interface ReactionEmoji {
  id: string;
  url: string;
  user: ReactionUser[];
}

export interface IMessagePanel {
  id: string;
  chatWith: User;
}

export class User {
  name: string;
  email: string;
  id: string;
  photoUrl: string;
  onlineStatus: boolean;
  memberInChannel: any[];
  activePrivateChats: any[];

  constructor(data: any) {
    this.name = data.name || '';
    this.email = data.email || '';
    this.id = data.id || '';
    this.photoUrl = data.photoUrl || '';
    this.onlineStatus = data.onlineStatus || false;
    this.memberInChannel = data.memberInChannel || [];
    this.activePrivateChats = data.activePrivateChats || [];
  }
}

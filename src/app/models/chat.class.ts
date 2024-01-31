export class Chat {
  id: string;
  chatBetween: string[];
  chatRecord: string;

  constructor(data: any) {
    this.id = data.id || '';
    this.chatBetween = data.chatBetween || [];
    this.chatRecord = data.chatRecord || '';
  }
}

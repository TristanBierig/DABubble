export class Channel {
  id: string;
  name: string;
  description: string;
  chatRecord: string;
  createdAt: any;
  createdBy: string;
  member: string[];

  constructor(data: any) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.description = data.description || '';
    this.chatRecord = data.chatRecord || '';
    this.createdAt = data.createdAt || '';
    this.createdBy = data.createdBy || '';
    this.member = data.member || [];
  }
}

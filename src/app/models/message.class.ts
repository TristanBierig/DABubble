export class Message {
  id: string;
  message: string;
  sentById: string;
  sentByName: string;
  sentByPhotoUrl: string;
  sentAt: any;
  file: {
    url: string;
    name: string;
    type: string;
  };
  thread: {
    id: string;
    length: number;
    lastAnswer: any;
  };
  reactions: {
    id: string;
    url: string;
    user: { id: string; name: string }[];
  }[];

  constructor(data: any) {
    this.id = '';
    this.message = data.message || '';
    this.sentById = data.sentById || '';
    this.sentByName = data.sentByName || '';
    this.sentByPhotoUrl = data.sentByPhotoUrl || '';
    this.sentAt = '';
    this.file = {
      url: '',
      name: '',
      type: '',
    };
    this.thread = {
      id: '',
      length: 0,
      lastAnswer: '',
    };
    this.reactions = [];
  }
}

import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Message } from 'src/app/models/message.class';
import { ChatTypes } from 'src/app/interfaces/chats/types';
import { ChatService } from 'src/app/services/chat.service';
import { Channel } from 'src/app/models/channel.class';
import { User } from 'src/app/models/user.class';
import { Chat } from 'src/app/models/chat.class';

@Component({
  selector: 'app-message-input',
  templateUrl: './message-input.component.html',
  styleUrls: ['./message-input.component.scss'],
})
export class MessageInputComponent implements OnChanges {
  @Input() currentChatRecordId!: string;
  @Input() parentChat!: ChatTypes;
  @Input() channel!: Channel;
  @Input() privateChatOpponentUser!: User;

  public msgPayload: string = '';
  public fileToUpload!: any;
  public placeholderText!: string;
  public fileName!: string;

  constructor(
    private fireService: FirestoreService,
    private chatService: ChatService
  ) {}

  ngOnChanges(): void {
    this.setPlaceholder();
  }

  setPlaceholder() {
    if (this.parentChat === 'thread') {
      this.placeholderText = 'Antworten...';
    } else if (this.channel.name) {
      this.placeholderText = `Nachricht an #${this.channel.name}`;
    } else if (this.privateChatOpponentUser !== this.fireService.currentUser) {
      this.placeholderText = `Nachricht an ${this.privateChatOpponentUser.name}`;
    } else {
      this.placeholderText = 'Notiz für mich...';
    }
  }

  /**
   * Sends the message to the corresponding chatRecord and checks if
   * the given chatRecord is for a thread or not. If so, the meta data
   * for the thread gets updated accordingly.
   *
   */
  sendMessage() {
    if (!this.msgPayload && !this.fileToUpload) return;
    const data = new Message(this.setMsgData());
    this.fireService.addMessage(
      this.currentChatRecordId,
      data,
      this.fileToUpload
    );
    this.msgPayload = '';
    this.fileToUpload = '';
    this.toggleThumbnail();
    this.toggleFileName();
    this.checkParentType();
  }

  setMsgData() {
    const user = this.fireService.currentUser;
    return {
      message: this.msgPayload.trim(),
      sentById: user.id,
      sentByName: user.name,
      sentByPhotoUrl: user.photoUrl,
    };
  }

  checkParentType() {
    if (this.parentChat === 'thread') {
      this.chatService.updateThreadMetaData();
    }
  }

  openFileUpload() {
    document.getElementById('fileUpload')?.click();
  }

  /**
   * This function gets triggered when a file is selected via the
   * html file input. Then sets a preview of the file to show in
   * the text message field. Just allows one attached file.
   *
   * @param event - File input from HTML Node
   */
  onFileChange(event: any) {
    this.fileToUpload = event.target;
    this.checkFileType();
  }

  /**
   * The file input node is restricted to only accept images or pdf files.
   * When further types should be accpeted. This function needs to be adjusted
   * accordingly.
   *
   */
  checkFileType() {
    const file = this.fileToUpload.files[0];

    if (file.type === 'application/pdf') {
      this.toggleThumbnail('assets/img/pdf.png');
      this.toggleFileName(file.name);
    } else {
      let src = URL.createObjectURL(file);
      this.toggleThumbnail(src);
    }
  }

  toggleThumbnail(src?: string) {
    let thumbnail = document.getElementById('filePreview')!;
    src
      ? thumbnail.setAttribute('src', src)
      : thumbnail.setAttribute('src', '');
  }

  toggleFileName(name?: string) {
    name ? (this.fileName = name) : (this.fileName = '');
    // Shortens the name if too long
    if (name && name.length > 20) {
      this.fileName = name.substring(0, 20) + '...';
    }
  }

  cancelUpload() {
    let input = <HTMLInputElement>document.getElementById('fileUpload');
    input.value = '';
    this.fileToUpload = '';
    this.toggleThumbnail();
    this.toggleFileName();
  }
}

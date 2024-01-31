import { Component, Inject, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { ChatSubHeaderComponent } from '../../chat/chat-sub-header/chat-sub-header.component';
import { Channel } from 'src/app/models/channel.class';
import { FirestoreService } from 'src/app/services/firestore.service';
import { SearchServiceService } from 'src/app/services/search-service.service';
import { User } from 'src/app/models/user.class';
import { Router } from '@angular/router';
import { ResponsiveService } from 'src/app/services/responsive.service';
import { DialogAddMemberToChannelComponent } from '../dialog-add-member-to-channel/dialog-add-member-to-channel.component';

@Component({
  selector: 'app-dialog-channel-menu',
  templateUrl: './dialog-channel-menu.component.html',
  styleUrls: ['./dialog-channel-menu.component.scss'],
})
export class DialogChannelMenuComponent {
  fireService: FirestoreService = inject(FirestoreService);
  searchService: SearchServiceService = inject(SearchServiceService);
  rs: ResponsiveService = inject(ResponsiveService);

  public channel: Channel;
  public createdBy!: User;

  public editNameIsOpen: boolean = false;
  public editDescriptionIsOpen: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ChatSubHeaderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Channel,
    public dialog: MatDialog,
    public router: Router
  ) {
    this.channel = new Channel(data);
    this.fireService.getUserDoc('user', data.createdBy).then((data) => {
      if (data) this.createdBy = data;
    });
  }

  toggleEditName() {
    this.editNameIsOpen = !this.editNameIsOpen;
  }

  saveName() {
    this.fireService.updateSingleDoc('channels', this.channel.id, {
      name: this.channel.name.trim(),
    });
    this.toggleEditName();
  }

  saveDescription() {
    this.fireService.updateSingleDoc('channels', this.channel.id, {
      description: this.channel.description.trim(),
    });
    this.toggleEditDescription();
  }

  toggleEditDescription() {
    this.editDescriptionIsOpen = !this.editDescriptionIsOpen;
  }

  openAddMemberDialog() {
    this.dialog.open(DialogAddMemberToChannelComponent);
  }

  closeDialog() {
    this.dialogRef.close();
  }
}

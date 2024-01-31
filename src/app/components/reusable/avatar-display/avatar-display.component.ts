import { Component, Input } from '@angular/core';
import { AvatarConfig } from 'src/app/interfaces/chats/types';

@Component({
  selector: 'app-avatar-display',
  templateUrl: './avatar-display.component.html',
  styleUrls: ['./avatar-display.component.scss'],
})
export class AvatarDisplayComponent {
  @Input() data!: AvatarConfig;
}

import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { ResponsiveService } from '../services/responsive.service';
import { Router } from '@angular/router';
import { ChatTypes } from '../interfaces/chats/types';

@Directive({
  selector: '[customLink]',
})
export class CustomNavigationDirective {
  @Input() set customLink(condition: [ChatTypes, string, string?]) {
    if (condition) {
      this.type = condition[0];
      this.mainChatID = condition[1];
      if (condition[2]) {
        this.msgID = condition[2];
      }
    }
  }

  private isMobile!: boolean;
  private isTablet!: boolean;
  private isDesktop!: boolean;

  public mainChatID!: string;
  public msgID!: string;
  public type!: ChatTypes;

  constructor(
    private el: ElementRef,
    private rs: ResponsiveService,
    private router: Router
  ) {
    this.rs.isMobile$.subscribe((val) => {
      this.isMobile = val;
    });
    this.rs.isTablet$.subscribe((val) => {
      this.isTablet = val;
    });
    this.rs.isDesktop$.subscribe((val) => {
      this.isDesktop = val;
    });
  }

  @HostListener('click') onclick() {
    switch (this.type) {
      case 'channel':
        this.navigateToChannel();
        break;
      case 'private':
        this.navigateToPrivate();
        break;
      case 'thread':
        this.navigateToThread();
        break;

      default:
        break;
    }
  }

  navigateToChannel() {
    if (this.isDesktop) {
      this.router.navigateByUrl(
        `/home(channel:chat/channel)?channelID=${this.mainChatID}`
      );
    } else {
      this.router.navigateByUrl(`/chat/channel?channelID=${this.mainChatID}`);
    }
  }

  navigateToPrivate() {
    if (this.isDesktop) {
      this.router.navigateByUrl(
        `/home(channel:chat/private)?channelID=${this.mainChatID}`
      );
    } else {
      this.router.navigateByUrl(`/chat/private?channelID=${this.mainChatID}`);
    }
  }

  navigateToThread() {
    if (this.isDesktop) {
      this.router.navigateByUrl(
        `/home(channel:chat/channel//thread:thread)?channelID=${this.mainChatID}&msgID=${this.msgID}`
      );
    } else {
      this.router.navigateByUrl(
        `thread?channelID=${this.mainChatID}&msgID=${this.msgID}`
      );
    }
  }
}

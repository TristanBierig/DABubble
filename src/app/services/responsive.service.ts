import { Injectable } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, map } from 'rxjs';
import { PRIMARY_OUTLET, Router, UrlTree } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ResponsiveService {
  isMobile$: Observable<boolean>;
  isTablet$: Observable<boolean>;
  isDesktop$: Observable<boolean>;

  constructor(private responsive: BreakpointObserver, private router: Router) {
    this.isMobile$ = this.responsive
      .observe(Breakpoints.XSmall)
      .pipe(map((result) => result.matches));

    this.isTablet$ = this.responsive
      .observe('(min-width: 600px) and (max-width: 1370px)')
      .pipe(map((result) => result.matches));

    this.isDesktop$ = this.responsive
      .observe('(min-width: 1370.02px)')
      .pipe(map((result) => result.matches));
  }

  changeRoutes(val: boolean) {
    const tree: UrlTree = this.router.parseUrl(this.router.url);
    const channelID: string = tree.queryParams['channelID'];
    const msgID: string = tree.queryParams['msgID'];
    let channelType: string;

    try {
      if (!msgID) {
        channelType = this.getChannelType(tree, val);
      } else {
        channelType = 'channel';
      }

      if (val && channelID) {
        this.changeToDesktopUrl(channelType, channelID, msgID);
      } else {
        this.changeToMobileUrl(channelType, channelID, msgID);
      }
    } catch (error) {}
  }

  getChannelType(tree: UrlTree, val: boolean): string {
    if (val && tree.root.children[PRIMARY_OUTLET].segments[1]) {
      const type = tree.root.children[PRIMARY_OUTLET].segments[1].path;
      return type;
    } else if (val === false && tree.root.children['channel'].segments[1]) {
      const type = tree.root.children['channel'].segments[1].path;
      return type;
    } else {
      return '';
    }
  }

  changeToDesktopUrl(channelType: string, channelID: string, msgID?: string) {
    if (msgID) {
      this.router.navigateByUrl(
        `/home(channel:chat/${channelType}//thread:thread)?channelID=${channelID}&msgID=${msgID}`
      );
    } else {
      this.router.navigateByUrl(
        `/home(channel:chat/${channelType})?channelID=${channelID}`
      );
    }
  }

  changeToMobileUrl(channelType: string, channelID: string, msgID?: string) {
    if (msgID) {
      this.router.navigateByUrl(
        `/thread?channelID=${channelID}&msgID=${msgID}`
      );
    } else {
      this.router.navigateByUrl(`/chat/${channelType}?channelID=${channelID}`);
    }
  }
}

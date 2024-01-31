import { NgModule, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule, Routes } from '@angular/router';
import { IntroComponent } from './components/general/auth/intro/intro.component';
import { ChannelComponent } from './components/general/chats/channel/channel.component';
import { SignUpComponent } from './components/general/auth/sign-up/sign-up.component';
import { ChooseAvatarComponent } from './components/general/auth/choose-avatar/choose-avatar.component';
import { NavbarComponent } from './components/general/sidenav/navbar/navbar.component';
import { ForgotPasswordComponent } from './components/general/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/general/auth/reset-password/reset-password.component';
// import { CreateChannelComponent } from './components/general/sidenav/create-channel/create-channel.component';
import { ThreadComponent } from './components/general/chats/thread/thread.component';
import { SignInMergeAccountsComponent } from './components/general/auth/sign-in-merge-accounts/sign-in-merge-accounts.component';
import { ResponsiveService } from './services/responsive.service';
import { ImprintComponent } from './components/general/auth/imprint/imprint.component';
import { PrivacyPolicyComponent } from './components/general/auth/privacy-policy/privacy-policy.component';
import { AuthService } from './services/auth.service';

const mobileRoutes: Routes = [
  { path: '', component: IntroComponent },
  {
    path: 'sign-in-merge-accounts/:id',
    component: SignInMergeAccountsComponent,
  },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'choose-avatar/:id', component: ChooseAvatarComponent },
  { path: 'imprint', component: ImprintComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'home', component: NavbarComponent },
  // { path: 'home/addChannel', component: CreateChannelComponent },
  { path: 'chat/:type', component: ChannelComponent },
  { path: 'thread', component: ThreadComponent },
  { path: '**', redirectTo: '/home', pathMatch: 'full' },
];

const desktopRoutes: Routes = [
  { path: '', component: IntroComponent },
  {
    path: 'sign-in-merge-accounts/:id',
    component: SignInMergeAccountsComponent,
  },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'choose-avatar/:id', component: ChooseAvatarComponent },
  { path: 'imprint', component: ImprintComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'home', component: NavbarComponent },
  // { path: 'home/addChannel', component: CreateChannelComponent },
  {
    path: 'chat/:type',
    component: ChannelComponent,
    outlet: 'channel',
  },
  {
    path: 'thread',
    component: ThreadComponent,
    outlet: 'thread',
  },
  {
    path: '**',
    redirectTo: '/home(channel:chat/channel)?channelID=3ZNVPzTSepCzgFNVsxUS',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(mobileRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
  auth: AuthService = inject(AuthService);

  constructor(public router: Router, private rs: ResponsiveService) {
    this.rs.isMobile$.subscribe((val) => {
      if (val) {
        router.resetConfig(mobileRoutes);
        if (this.auth.isLoggedIn) this.rs.changeRoutes(!val);
      }
    });

    this.rs.isTablet$.subscribe((val) => {
      if (val) {
        router.resetConfig(mobileRoutes);
        if (this.auth.isLoggedIn) this.rs.changeRoutes(!val);
      }
    });

    this.rs.isDesktop$.subscribe((val) => {
      if (val) {
        router.resetConfig(desktopRoutes);
        if (this.auth.isLoggedIn) this.rs.changeRoutes(val);
      }
    });
  }
}

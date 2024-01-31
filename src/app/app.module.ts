import { NgModule, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeDE from '@angular/common/locales/de';
registerLocaleData(localeDE, 'de');

import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayoutModule } from '@angular/cdk/layout';

import { MaterialModule } from './custom_modules/material.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './components/general/sidenav/navbar/navbar.component';
import { HeaderMobileComponent } from './components/reusable/header-mobile/header-mobile.component';
import { NavbarPanelChannelsComponent } from './components/general/sidenav/navbar-panel-channels/navbar-panel-channels.component';
import { NavbarPanelMessageComponent } from './components/general/sidenav/navbar-panel-message/navbar-panel-message.component';
import { NavbarSearchbarComponent } from './components/general/sidenav/navbar-searchbar/navbar-searchbar.component';
// import { MenuProfilMobileComponent } from './components/general/sidenav/menu-profil-mobile/menu-profil-mobile.component';
import { DialogProfilComponent } from './components/reusable/dialog-profil/dialog-profil.component';
import { IntroComponent } from './components/general/auth/intro/intro.component';
import { SignInComponent } from './components/general/auth/sign-in/sign-in.component';

import { ChannelComponent } from './components/general/chats/channel/channel.component';
import { ThreadComponent } from './components/general/chats/thread/thread.component';
import { SignUpComponent } from './components/general/auth/sign-up/sign-up.component';
import { ChooseAvatarComponent } from './components/general/auth/choose-avatar/choose-avatar.component';
import { DialogProfilEditComponent } from './components/reusable/dialog-profil-edit/dialog-profil-edit.component';
import { ForgotPasswordComponent } from './components/general/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/general/auth/reset-password/reset-password.component';
import { MessageInputComponent } from './components/reusable/chat/message-input/message-input.component';
import { ChatSubHeaderComponent } from './components/reusable/chat/chat-sub-header/chat-sub-header.component';

import { DialogNewChannelComponent } from './components/reusable/dialog-new-channel/dialog-new-channel.component';
import { DialogNewChatComponent } from './components/reusable/dialog-new-chat/dialog-new-chat.component';
import { DialogProfilMenuComponent } from './components/reusable/dialog-profil-menu/dialog-profil-menu.component';

import { ChatRecordComponent } from './components/reusable/chat/chat-record/chat-record.component';
import { SignInMergeAccountsComponent } from './components/general/auth/sign-in-merge-accounts/sign-in-merge-accounts.component';
import { AvatarDisplayComponent } from './components/reusable/avatar-display/avatar-display.component';
import { CustomNavigationDirective } from './custom_directives/custom-navigation.directive';
import { CustomAutofocusDirective } from './custom_directives/custom-autofocus.directive';
import { TextareaAutoresizeDirective } from './custom_directives/textarea-autoresize.directive';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { EmojiComponent } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { DialogCreateChannelComponent } from './components/reusable/dialog-create-channel/dialog-create-channel.component';
import { DialogManagerComponent } from './components/general/dialog-manager/dialog-manager.component';
import { DialogChannelMemberComponent } from './components/reusable/dialogs/dialog-channel-member/dialog-channel-member.component';
import { ImprintComponent } from './components/general/auth/imprint/imprint.component';
import { PrivacyPolicyComponent } from './components/general/auth/privacy-policy/privacy-policy.component';
import { DialogAddMemberToChannelComponent } from './components/reusable/dialogs/dialog-add-member-to-channel/dialog-add-member-to-channel.component';
import { DialogChannelMenuComponent } from './components/reusable/dialogs/dialog-channel-menu/dialog-channel-menu.component';
import { DialogProfilMainSearchComponent } from './components/reusable/dialog-profil-main-search/dialog-profil-main-search.component';

@NgModule({
  declarations: [
    AppComponent,
    IntroComponent,
    ChannelComponent,
    NavbarComponent,
    HeaderMobileComponent,
    NavbarPanelChannelsComponent,
    NavbarPanelMessageComponent,
    NavbarSearchbarComponent,
    SignInComponent,
    SignInMergeAccountsComponent,
    SignUpComponent,
    ChooseAvatarComponent,
    // MenuProfilMobileComponent,
    DialogProfilComponent,
    DialogProfilEditComponent,
    ForgotPasswordComponent,
    DialogNewChannelComponent,
    DialogNewChatComponent,
    DialogProfilMenuComponent,
    ResetPasswordComponent,
    MessageInputComponent,
    ThreadComponent,
    ChatSubHeaderComponent,
    ChatRecordComponent,
    SignInMergeAccountsComponent,
    AvatarDisplayComponent,
    CustomNavigationDirective,
    CustomAutofocusDirective,
    TextareaAutoresizeDirective,
    DialogCreateChannelComponent,
    DialogManagerComponent,
    DialogChannelMemberComponent,
    ImprintComponent,
    PrivacyPolicyComponent,
    DialogAddMemberToChannelComponent,
    DialogChannelMenuComponent,
    DialogProfilMainSearchComponent,
  ],
  
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MaterialModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireStorageModule,
    BrowserAnimationsModule,
    EmojiComponent,
    PickerComponent,
    LayoutModule,
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'de-DE' }],
  bootstrap: [AppComponent],
})
export class AppModule {}

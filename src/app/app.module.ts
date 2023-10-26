import { NgModule, LOCALE_ID } from '@angular/core';

import { registerLocaleData } from '@angular/common';
import localeDE from '@angular/common/locales/de';
registerLocaleData(localeDE, 'de');

import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from './custom_modules/material.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './components/wrapper/navbar/navbar.component';
import { NavbarHeaderMobileComponent } from './components/component/navbar-header-mobile/navbar-header-mobile.component';
import { NavbarPanelChannelsComponent } from './components/component/navbar-panel-channels/navbar-panel-channels.component';
import { NavbarPanelMessageComponent } from './components/component/navbar-panel-message/navbar-panel-message.component';
import { NavbarSearchbarComponent } from './components/component/navbar-searchbar/navbar-searchbar.component';
import { IntroComponent } from './components/components/intro/intro.component';
import { SignInComponent } from './components/components/sign-in/sign-in.component';

import { MainChatComponent } from './components/components/main-chat/main-chat.component';
import { SignUpComponent } from './components/components/sign-up/sign-up.component';

@NgModule({
  declarations: [
    AppComponent,
    IntroComponent,
    MainChatComponent,
    NavbarComponent, 
    NavbarHeaderMobileComponent, 
    NavbarPanelChannelsComponent, 
    NavbarPanelMessageComponent, 
    NavbarSearchbarComponent,
    SignInComponent,
    SignUpComponent,
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
    BrowserAnimationsModule,
  ],
  providers: [
    {provide: LOCALE_ID, useValue: 'de-DE' }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

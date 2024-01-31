import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DialogManagerService {
  /** behavior subject = store init values */
  showNavbar$:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  showDialogProfilMenu$:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  showDialogAddChannel$:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  showDialogNewChannel$:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  showDialogNewChat$:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  selectedUser!: any;


  constructor() { }

  showNavbar(){
    const currentValue = this.showNavbar$.value;
    this.showNavbar$.next(!currentValue);
  }

  showDialogProfilMenu(){
    const currentValue = this.showDialogProfilMenu$.value;
    this.showDialogProfilMenu$.next(!currentValue);
  }

  showDialogAddChannel(){
    const currentValue = this.showDialogAddChannel$.value;
    this.showDialogAddChannel$.next(!currentValue);
  }

  showDialogNewChannel(){
    const currentValue = this.showDialogNewChannel$.value;
    this.showDialogNewChannel$.next(!currentValue);
  }

  showDialogNewChat(){
    const currentValue = this.showDialogNewChat$.value;
    this.showDialogNewChat$.next(!currentValue);
  }
}

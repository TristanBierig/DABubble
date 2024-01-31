import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DialogManagerService } from 'src/app/services/dialog-manager.service';
import { ResponsiveService } from 'src/app/services/responsive.service';

@Component({
  selector: 'app-dialog-manager',
  templateUrl: './dialog-manager.component.html',
  styleUrls: ['./dialog-manager.component.scss']
})
export class DialogManagerComponent {

  constructor(
    private auth: AuthService, 
    public rs: ResponsiveService, 
    public dialogService: DialogManagerService,
  ){}
}

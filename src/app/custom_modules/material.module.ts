import { NgModule } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatDividerModule} from '@angular/material/divider';

const MaterialComponents = [

  MatButtonModule,
  MatDialogModule,
  MatCardModule,
  MatDividerModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
];


@NgModule({
  imports: [
    MaterialComponents,
  ],
  exports: [MaterialComponents],
  providers: [],
})
export class MaterialModule {}

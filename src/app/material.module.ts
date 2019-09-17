import { NgModule } from '@angular/core';

import {
  MatInputModule,
  MatButtonModule,
  MatSnackBarModule,
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
  MatCardModule,
  MatIconModule,
  MatGridListModule, MatMenuModule,
} from '@angular/material';

import {LayoutModule} from '@angular/cdk/layout';

const modules = [
  MatCardModule,
  MatInputModule,
  MatButtonModule,
  MatSnackBarModule,
  MatIconModule,
  MatGridListModule,
  MatMenuModule,
  LayoutModule
];

@NgModule({
  imports: modules,
  exports: modules,
  providers: [
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2500}}
  ]
})
export class MaterialModule {}

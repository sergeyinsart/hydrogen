import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavHeaderComponent } from './nav-header/nav-header.component';
import {MaterialModule} from '../material.module';

@NgModule({
  declarations: [NavHeaderComponent],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    NavHeaderComponent
  ]
})
export class UiModule { }

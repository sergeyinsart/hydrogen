import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import {AssetSizeResolver, HoldingsResolver} from './dashboard.routing';
import {ChartsModule} from 'ng2-charts';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    ChartsModule
  ],
  providers: [
    AssetSizeResolver,
    HoldingsResolver,
    DatePipe
  ]
})
export class DashboardModule { }

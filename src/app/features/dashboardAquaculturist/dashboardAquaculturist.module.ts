import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';

import { DashboardAquaculturistRoutingModule } from './dashboardAquaculturist-routing.module';
import { TemperatureDashboardComponent } from './views/temperature-dashboard/temperature-dashboard.component';


@NgModule({
  declarations: [
    TemperatureDashboardComponent
  ],
  imports: [
    CommonModule,
    DashboardAquaculturistRoutingModule,
    NgApexchartsModule
    
  ]
})
export class DashboardAquaculturistModule { }

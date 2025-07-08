import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';

import { DashboardAquaculturistRoutingModule } from './dashboardAquaculturist-routing.module';
import { TemperatureDashboardComponent } from './views/temperature-dashboard/temperature-dashboard.component';
import { WeightDashboardComponent } from './views/weight-dashboard/weight-dashboard.component';


@NgModule({
  declarations: [
    TemperatureDashboardComponent,
    WeightDashboardComponent
  ],
  imports: [
    CommonModule,
    DashboardAquaculturistRoutingModule,
    NgApexchartsModule
    
  ]
})
export class DashboardAquaculturistModule { }

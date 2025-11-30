import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { DashboardAquaculturistRoutingModule } from './dashboardAquaculturist-routing.module';
import { TemperatureDashboardComponent } from './views/temperature-dashboard/temperature-dashboard.component';
import { WeightDashboardComponent } from './views/weight-dashboard/weight-dashboard.component';
import { WaterMonitoringDashboardComponent } from './views/water-monitoring-dashboard/water-monitoring-dashboard.component';
import { GrowthMonitoringDashboardComponent } from './views/growth-monitoring-dashboard/growth-monitoring-dashboard.component';
import { FormsModule } from '@angular/forms';
import { AlertsModule } from '../../core/services/alerts/alerts.module';



@NgModule({
  declarations: [
  WeightDashboardComponent,
    WaterMonitoringDashboardComponent,
    GrowthMonitoringDashboardComponent,
    TemperatureDashboardComponent 
  ],
  imports: [
    CommonModule,
    FormsModule,
    DashboardAquaculturistRoutingModule,
    NgApexchartsModule,
    AlertsModule,
  ],
   providers: [
    provideHttpClient(withFetch()), 
  ]
})
export class DashboardAquaculturistModule {}

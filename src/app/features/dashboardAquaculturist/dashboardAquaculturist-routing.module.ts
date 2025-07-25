import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TemperatureDashboardComponent } from './views/temperature-dashboard/temperature-dashboard.component';
import { WeightDashboardComponent } from './views/weight-dashboard/weight-dashboard.component';
import { WaterMonitoringDashboardComponent } from './views/water-monitoring-dashboard/water-monitoring-dashboard.component';
import { GrowthMonitoringDashboardComponent } from './views/growth-monitoring-dashboard/growth-monitoring-dashboard.component';
import { AlertsDashboardComponent } from './views/alerts-dashboard/alerts-dashboard.component';
import { AcuicultorGuard } from '../auth/infraestructure/authRepository/acuicultor.guard';

const routes: Routes = [
  {
    path: 'temperature',
    component: TemperatureDashboardComponent,
    canActivate: [AcuicultorGuard]
  },
  {
    path: 'weight',
    component: WeightDashboardComponent,
    canActivate: [AcuicultorGuard]
  },
  {
    path: 'growth',
    component: GrowthMonitoringDashboardComponent,
    canActivate: [AcuicultorGuard]
  },
  {
    path: 'waterMonitoring',
    component: WaterMonitoringDashboardComponent,
    canActivate: [AcuicultorGuard]
  },
  {
    path: 'alertsDashboard',
    component: AlertsDashboardComponent,
    canActivate: [AcuicultorGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardAquaculturistRoutingModule { }

import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TemperatureDashboardComponent } from './views/temperature-dashboard/temperature-dashboard.component';
import { WeightDashboardComponent } from './views/weight-dashboard/weight-dashboard.component';

const routes: Routes = [
  {
    path: 'temperature',
    component: TemperatureDashboardComponent
  },
  {
    path: 'weight',
    component: WeightDashboardComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardAquaculturistRoutingModule { }

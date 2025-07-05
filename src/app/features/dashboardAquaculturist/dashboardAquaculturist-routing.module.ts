import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TemperatureDashboardComponent } from './views/temperature-dashboard/temperature-dashboard.component';
import path from 'node:path/win32';

const routes: Routes = [
  {
    path: '',
    component: TemperatureDashboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardAquaculturistRoutingModule { }

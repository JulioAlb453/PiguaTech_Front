import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardSupervisorRoutingModule } from './dashboard-supervisor-routing.module';
import { HabitatStatusDashboardComponent } from './views/habitat-status-dashboard/habitat-status-dashboard.component';

import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
    HabitatStatusDashboardComponent
  ],
  imports: [
    CommonModule,
    DashboardSupervisorRoutingModule,
    MatIconModule
  ]
})
export class DashboardSupervisorModule { }

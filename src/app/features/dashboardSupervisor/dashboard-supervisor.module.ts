import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardSupervisorRoutingModule } from './dashboard-supervisor-routing.module';
import { HabitatStatusDashboardComponent } from './views/habitat-status-dashboard/habitat-status-dashboard.component';

import { MatIconModule } from '@angular/material/icon';
import { ReportGeneratorComponent } from './views/report-generator/report-generator.component';
import { ReactiveFormsModule } from '@angular/forms';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SummaryReportsDashboardComponent } from './views/summary-reports-dashboard/summary-reports-dashboard.component';



@NgModule({
  declarations: [
    HabitatStatusDashboardComponent,
    ReportGeneratorComponent,
    SummaryReportsDashboardComponent
  ],
  imports: [
    CommonModule,
    DashboardSupervisorRoutingModule,
    MatIconModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule
  ]
})
export class DashboardSupervisorModule { }

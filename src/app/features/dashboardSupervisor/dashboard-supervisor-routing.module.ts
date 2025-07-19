import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HabitatStatusDashboardComponent } from './views/habitat-status-dashboard/habitat-status-dashboard.component';
import { ReportGeneratorComponent } from './views/report-generator/report-generator.component';
import { SummaryReportsDashboardComponent } from './views/summary-reports-dashboard/summary-reports-dashboard.component';

const routes: Routes = [
  { path: 'home',
    component: HabitatStatusDashboardComponent },
  {
      path: 'reports',
      component: ReportGeneratorComponent
  },
  {
      path: 'summary',
      component: SummaryReportsDashboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardSupervisorRoutingModule {}

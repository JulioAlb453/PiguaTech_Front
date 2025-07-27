import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HabitatStatusDashboardComponent } from './views/habitat-status-dashboard/habitat-status-dashboard.component';
import { ReportGeneratorComponent } from './views/report-generator/report-generator.component';
import { SummaryReportsDashboardComponent } from './views/summary-reports-dashboard/summary-reports-dashboard.component';
import { SupervisorGuard } from '../auth/infraestructure/authRepository/supervisor.guard';

const routes: Routes = [
  {
    path: 'home',
    component: HabitatStatusDashboardComponent,
    canActivate: [SupervisorGuard],
  },
  {
    path: 'reports',
    component: ReportGeneratorComponent,
    canActivate: [SupervisorGuard],
  },
  {
    path: 'summary',
    component: SummaryReportsDashboardComponent,
    canActivate: [SupervisorGuard],
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardSupervisorRoutingModule {}

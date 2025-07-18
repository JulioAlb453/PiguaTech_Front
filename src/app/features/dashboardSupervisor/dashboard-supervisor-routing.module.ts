import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HabitatStatusDashboardComponent } from './views/habitat-status-dashboard/habitat-status-dashboard.component';
import { ReportGeneratorComponent } from './views/report-generator/report-generator.component';

const routes: Routes = [
  { path: 'home',
    component: HabitatStatusDashboardComponent },
    {
      path: 'reports',
      component: ReportGeneratorComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardSupervisorRoutingModule {}

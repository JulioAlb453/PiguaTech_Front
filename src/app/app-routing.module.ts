import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './features/auth/views/login/login.component';
import { ShelversOverviewFatherComponentComponent } from './shared/components/shelvers-overview-father-component/shelvers-overview-father-component.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { DashboardSupervisorModule } from './features/dashboardSupervisor/dashboard-supervisor.module';

const routes: Routes = [
  {
    path: 'home',
    component: ShelversOverviewFatherComponentComponent,
  },
  { path: 'login', component: LoginComponent },

  {
    path: 'dashboardAcuaculturist',
    loadChildren: () =>
      import(
        './features/dashboardAquaculturist/dashboardAquaculturist.module'
      ).then((m) => m.DashboardAquaculturistModule),
  },
  {
    path: 'dashboardSupervisor',
    loadChildren: () =>
      import(
      './features/dashboardSupervisor/dashboard-supervisor.module'
      ).then((m) => m.DashboardSupervisorModule)
    
  },

  {
    path: '**',
    component: NotFoundComponent,
  },

  { path: '', redirectTo: 'login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes), DashboardSupervisorModule, ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

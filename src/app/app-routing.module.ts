import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './features/auth/views/login/login.component';
import { RegisterComponent } from './features/auth/views/register/register.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  {
    path: 'supervisor',
    loadChildren: () =>
      import('./features/dashboardSupervisor/dashboard-supervisor.module').then(
        (m) => m.DashboardSupervisorModule
      ),
  },

  {
    path: 'acuicultor',
    loadChildren: () =>
      import('./features/dashboardAquaculturist/dashboardAquaculturist.module').then(
        (m) => m.DashboardAquaculturistModule
      ),
  },

  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

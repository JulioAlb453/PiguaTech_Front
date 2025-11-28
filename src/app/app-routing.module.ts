import { NgModule } from '@angular/core';
import { PreloadAllModules,RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './features/auth/views/login/login.component';
import { RegisterComponent } from './features/auth/views/register/register.component';
import { ErrorComponent } from './pages/not-found/error.component';

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

  { path: '**', component: ErrorComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{
     preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule],
})
export class AppRoutingModule {}


import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './features/auth/views/login/login.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },

  {
    path: 'dashboard', 
    loadChildren: () => 
      import('./features/dashboardAquaculturist/dashboardAquaculturist.module')
        .then(m => m.DashboardAquaculturistModule)
  },

  {
    path: '**',
    component: NotFoundComponent
  },

  { path: '', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)], 
  exports: [RouterModule]
})
export class AppRoutingModule { }
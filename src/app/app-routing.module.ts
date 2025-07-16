import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './features/auth/views/login/login.component';
import { ShelversOverviewComponent } from './shared/components/shelvers-overview/shelvers-overview.component';
import { ShelversOverviewFatherComponentComponent } from './shared/components/shelvers-overview-father-component/shelvers-overview-father-component.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

const routes: Routes = [
  {
    path: 'home',
    component: ShelversOverviewFatherComponentComponent,
  },
  { path: 'login', component: LoginComponent },

  {
    path: 'dashboard',
    loadChildren: () =>
      import(
        './features/dashboardAquaculturist/dashboardAquaculturist.module'
      ).then((m) => m.DashboardAquaculturistModule),
  },

  {
    path: '**',
    component: NotFoundComponent,
  },

  { path: '', redirectTo: 'login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

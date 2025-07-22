import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http'; // Nueva forma en Angular 19

import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';
import { RegisterUseCaseService } from './application/use-case/register.use-case.service';
import { AuthAPIService } from './infraestructure/authAPI.service';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  providers: [
    provideHttpClient(), 
    
    AuthAPIService,
    RegisterUseCaseService,

  ]
})
export class AuthModule {}
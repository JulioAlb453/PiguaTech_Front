import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './views/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    LoginComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ]
})

// Este módulo de Angular agrupa todos los componentes, servicios y otros módulos relacionados con la autenticación.
export class AuthModule { }

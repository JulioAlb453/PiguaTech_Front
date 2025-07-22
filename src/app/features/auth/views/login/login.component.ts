import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AuthAPIService } from '../../infraestructure/authAPI.service'; // Ajusta el path si es necesario
import { CredentialModel } from '../../domain/models/credential.model';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMsg: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthAPIService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: [''],
      password: ['']
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const credentials: CredentialModel = this.loginForm.value;
      this.authService.login(credentials).subscribe({
        next: user => {
          console.log('Usuario logueado:', user);
        },
        error: err => {
          this.errorMsg = err.error?.detail || 'Error al iniciar sesión';
          console.error('Error al loguear:', err);
        }
      });
    } else {
      this.errorMsg = 'Formulario inválido';
      console.error('Formulario inválido');
    }
  }
}
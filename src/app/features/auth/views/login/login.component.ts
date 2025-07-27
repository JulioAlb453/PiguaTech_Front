import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthAPIService } from '../../infraestructure/authAPI.service'; 
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
    private authService: AuthAPIService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.errorMsg = 'Formulario inválido';
      console.error('Formulario inválido');
      return;
    }

    const credentials: CredentialModel = this.loginForm.value;

    this.authService.login(credentials).subscribe({
      next: (user) => {
        console.log('Usuario logueado:', user);

        const normalizedRole = user.role?.trim().toLowerCase();

        if (normalizedRole === 'supervisor') {
          this.router.navigate(['/supervisor/home']);
        } else if (normalizedRole === 'acuicultor') {
          this.router.navigate(['/acuicultor/temperature']);
        } else {
          this.errorMsg = 'Rol no reconocido, acceso denegado';
          console.error('Rol desconocido:', user.role);
          this.router.navigate(['/login']);
        }
      },
      error: (err) => {
        this.errorMsg = err.error?.detail || 'Error al iniciar sesión';
        console.error('Error al loguear:', err);
      },
    });
  }
}

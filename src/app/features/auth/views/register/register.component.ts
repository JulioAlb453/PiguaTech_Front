// register.component.ts
import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { UserRole } from '../../domain/models/user-role.enum';
import { RegisterData } from '../../domain/models/iauth.repository';
import { REGISTER_USE_CASE } from '../../infraestructure/authRepository/providers/auth.provider';
import { passwordMatchValidator } from '../../application/use-case/password-match.validator';
import { RegisterUseCaseService } from '../../application/use-case/register.use-case.service';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  errorMessage: string | null = null;
  isLoading = false;
  roles = Object.values(UserRole); 
  UserRole = UserRole

  constructor(
    private fb: FormBuilder,
    private router: Router,
    @Inject(REGISTER_USE_CASE) private registerUseCase: RegisterUseCaseService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      names: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      rol: [UserRole.Acuicultor, Validators.required] 
    }, { validators: passwordMatchValidator });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const { confirmPassword, ...formData } = this.registerForm.value;
    const registerData: RegisterData = {
      ...formData,
      token: ''
    };

    this.registerUseCase.execute(registerData).subscribe({
      next: (user) => {
        this.isLoading = false;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.message || 'Error en el registro';
        console.error('Error:', err);
      }
    });
  }

  getFormProgress(): number {
  const controls = this.registerForm.controls;
  const totalFields = Object.keys(controls).length;
  let validFields = 0;

  Object.keys(controls).forEach(key => {
    const control = controls[key];
    if (control.valid && control.value && control.value.toString().trim() !== '') {
      validFields++;
    }
  });

  return Math.round((validFields / totalFields) * 100);
}
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, Observable, of, throwError } from 'rxjs';

import { UserRole } from '../../domain/models/user-role.enum';

export interface RegisterData {
  names: string;
  email: string;
  password: string;
  rol: string;
}

export interface UserModel {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  token: string;
}

export interface CredentialModel {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthAPIService {

  constructor(private http: HttpClient) { }

   private readonly USERS_KEY = 'app_users';

  register(data: any): Observable<any> {
    const users = JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');
    
    if (users.some((user: any) => user.email === data.email)) {
      return throwError(() => new Error('Email ya registrado'));
    }

    const newUser = {
      id: Date.now().toString(),
      ...data,
      token: 'fake-jwt-token'
    };

    users.push(newUser);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));

    return of(newUser).pipe(delay(500));
  }

  // // Registro de usuario
  // register(data: RegisterData): Observable<UserModel> {
  //   return this.http.post<UserModel>('/register', data);
  // }

  // login(credentials: CredentialModel): Observable<UserModel> {
  //   return this.http.post<UserModel>('/login', credentials);
  // }

  // // Cierre de sesión (opcional)
  // logout(): Observable<void> {
  //   return this.http.post<void>(`/logout`, {});
  // }

  // // Verificación de token (opcional)
  // verifyToken(token: string): Observable<{ isValid: boolean }> {
  //   return this.http.post<{ isValid: boolean }>(`/verify-token`, { token });
  // }

  // // Recuperación de contraseña (opcional)
  // requestPasswordReset(email: string): Observable<{ message: string }> {
  //   return this.http.post<{ message: string }>(`/request-password-reset`, { email });
  // }
}
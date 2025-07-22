// auth.repository.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap } from 'rxjs/operators';
import { IAuthRepository,RegisterData } from '../domain/models/iauth.repository';
import { UserModel } from '../domain/models/user.model';
import { CredentialModel } from '../domain/models/credential.model';

@Injectable({
  providedIn: 'root'
})
export class AuthRepositoryService implements IAuthRepository {
  private readonly USERS_KEY = 'piguatech_users';
  private readonly API_URL = 'https://tu-api.com/auth'; // Cambiar por tu URL real

  constructor(private http: HttpClient) {}

  register(data: RegisterData): Observable<UserModel> {

    return of(null).pipe(
      delay(500),
      mergeMap(() => {
        const users = this.getUsersFromStorage();
        const emailExists = users.some(user => user.email === data.email);
        
        if (emailExists) {
          return throwError(() => new Error(`El correo ${data.email} ya está registrado`));
        }

        const newUser: UserModel = {
          id: this.generateId(),
          name: data.names,
          email: data.email,
          role: data.rol,
          token: 'fake-jwt-token' 
        };

        users.push(newUser);
        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
        return of(newUser);
      })
    );
  }

  login(credentials: CredentialModel): Observable<UserModel> {
    const users = this.getUsersFromStorage();
    const user = users.find(u => u.email === credentials.email);
    
    return user 
      ? of(user).pipe(delay(500))
      : throwError(() => new Error('Credenciales inválidas'));
  }

  private getUsersFromStorage(): UserModel[] {
    const users = localStorage.getItem(this.USERS_KEY);
    return users ? JSON.parse(users) : [];
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }
}
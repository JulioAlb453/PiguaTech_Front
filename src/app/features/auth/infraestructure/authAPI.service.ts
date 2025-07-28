import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { mergeMap, tap, map } from 'rxjs/operators';
import { IAuthRepository, RegisterData } from '../domain/models/iauth.repository';
import { UserModel } from '../domain/models/user.model';
import { CredentialModel } from '../domain/models/credential.model';

@Injectable({
  providedIn: 'root'
})
export class AuthAPIService implements IAuthRepository {

<<<<<<< HEAD
  private readonly API_URL = 'http://127.0.0.1:8000/auth';
=======
  private readonly API_URL = 'http://localhost:8000/auth';
>>>>>>> 7419f01b6f4c18aeb1a55758df1dc3b7a75565fb

  //  emitir el usuario actual
  private currentUserSubject = new BehaviorSubject<UserModel | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    if (typeof window !== 'undefined' && localStorage) {
      const stored = localStorage.getItem('user');
      if (stored) {
        this.currentUserSubject.next(JSON.parse(stored));
      }
    }
  }

  register(data: RegisterData): Observable<UserModel> {
    const payload = {
      full_name: data.names,
      email: data.email,
      password: data.password,
      confirm_password: data.password, 
      role: data.rol
    };
    return this.http.post<{ msg: string }>(`${this.API_URL}/register`, payload).pipe(
      mergeMap(() => this.login({ email: data.email, password: data.password }))
    );
  }

  login(credentials: CredentialModel): Observable<UserModel> {
    return this.http.post<{ access_token: string, token_type: string }>(
      `${this.API_URL}/login`,
      credentials
    ).pipe(
      mergeMap(response => {
        return this.http.get<any>(`${this.API_URL}/profile`, {
          headers: { Authorization: `Bearer ${response.access_token}` }
        }).pipe(
          tap(profileResp => {
            const user = profileResp.user;
            const userData: UserModel = {
              id: user.user_id?.toString() ?? '',
              name: user.full_name ?? '',
              email: user.email,
              role: user.role,
              token: response.access_token
            };
            localStorage.setItem('user', JSON.stringify(userData));
            // Actualizar para notificar cambio de usuario
            this.currentUserSubject.next(userData);
          }),
          map(profileResp => {
            const user = profileResp.user;
            return {
              id: user.user_id?.toString() ?? '',
              name: user.full_name ?? '',
              email: user.email,
              role: user.role,
              token: response.access_token
            } as UserModel;
          })
        );
      })
    );
  }

  logout(): void {
    localStorage.removeItem('user');
    // no hay usuario logueado
    this.currentUserSubject.next(null);
  }

  getLoggedUser(): UserModel | null {
    return this.currentUserSubject.getValue();
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.getValue();
  }
}

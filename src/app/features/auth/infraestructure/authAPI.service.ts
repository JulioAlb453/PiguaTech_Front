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
export class AuthAPIService implements IAuthRepository {

  private readonly API_URL = 'http://localhost:8000/auth'; //puerto del backend

  constructor(private http: HttpClient) {}

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
          mergeMap(profileResp => {
            const user = profileResp.user;
            return of({
              id: user.user_id?.toString() ?? '',
              name: user.full_name ?? '',
              email: user.email,
              role: user.role,
              token: response.access_token
               } as UserModel);
          })
        );
      })
    );
  }
}
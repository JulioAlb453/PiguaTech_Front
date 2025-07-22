import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, Observable, of, throwError } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import {
  IAuthRepository,
  RegisterData,
} from '../../domain/models/iauth.repository';
import { UserModel } from '../../domain/models/user.model';
import { CredentialModel } from '../../domain/models/credential.model';

@Injectable({
  providedIn: 'root',
})
export class RegisterUseCaseService {
  private readonly USERS_KEY = 'piguatech_users';

  constructor() {}

  register(data: RegisterData): Observable<UserModel> {
    return of(null).pipe(
      delay(500),
      mergeMap(() => {
        const users = this._getUsersFromStorage();

        const emailExists = users.some((user) => user.email === data.email);
        if (emailExists) {
          return throwError(
            () =>
              new Error(`El correo electrónico '${data.email}' ya está en uso.`)
          );
        }

        const newUser: UserModel = {
          id: this._generateId(),
          name: data.names,
          email: data.email,
          role: data.rol,
          token: data.token,
        };

        users.push(newUser);
        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));

        console.log('Usuario guardado en LocalStorage:', newUser);

        return of(newUser);
      })
    );
  }

  private _getUsersFromStorage(): UserModel[] {
    const usersJson = localStorage.getItem(this.USERS_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
  }

  private _generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  login(credentials: CredentialModel): Observable<UserModel> {
    const users = this._getUsersFromStorage();
    const foundUser = users.find((user) => user.email === credentials.email);

    if (foundUser) {
      return of(foundUser).pipe(delay(500));
    } else {
      return throwError(() => new Error('Credenciales inválidas.'));
    }
  }
}

import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthAPIService } from '../../infraestructure/authRepository/auth-api.service';
import {  UserModel } from '../../domain/models/user.model';
import { RegisterData } from '../../domain/models/iauth.repository';
import { AUTH_REPOSITORY } from '../../infraestructure/authRepository/providers/auth.provider';
@Injectable({
  providedIn: 'root'
})
export class RegisterUseCaseService {
  constructor(private authAPI: AuthAPIService) {}

  execute(data: RegisterData): Observable<UserModel> {
    return this.authAPI.register(data);
  }
}
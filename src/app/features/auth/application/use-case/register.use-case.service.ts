import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthAPIService } from '../../infraestructure/authAPI.service';
import {  UserModel } from '../../domain/models/user.model';
import { RegisterData } from '../../domain/models/iauth.repository';
@Injectable({
  providedIn: 'root'
})

//este servicio es para implementar la logica de negocio
// y validaciones 
export class RegisterUseCaseService {
  constructor(private authAPI: AuthAPIService) {}

  execute(data: RegisterData): Observable<UserModel> {
    //aqui podemos integrar la parte de validaciones, la logica de negocio, etc
    return this.authAPI.register(data);
  }
}
import { InjectionToken, inject } from '@angular/core';
import { RegisterUseCaseService } from '../../../application/use-case/register.use-case.service';
import { AuthAPIService } from '../../authAPI.service';


// Este es como un "nombre clave" que usaremos para obtener el servicio de autenticación
// Cuando alguien pida AUTH_REPOSITORY, Angular le dará el AuthAPIService
export const AUTH_REPOSITORY = new InjectionToken('AuthRepository', {
  providedIn: 'root',
  factory: () => inject(AuthAPIService) 
});

// Este es el "nombre clave" para el servicio que maneja el registro de usuarios
// Necesita el AUTH_REPOSITORY para funcionar (como una pieza que conectamos)
export const REGISTER_USE_CASE = new InjectionToken('RegisterUseCase', {
  providedIn: 'root',
  factory: () => new RegisterUseCaseService(inject(AUTH_REPOSITORY))
});
import { InjectionToken, inject } from '@angular/core';
import { AuthAPIService } from '../auth-api.service';
import { RegisterUseCaseService } from '../../../application/use-case/register.use-case.service';


export const AUTH_REPOSITORY = new InjectionToken('AuthRepository', {
  providedIn: 'root',
  factory: () => inject(AuthAPIService) // Usamos el servicio directamente
});

export const REGISTER_USE_CASE = new InjectionToken('RegisterUseCase', {
  providedIn: 'root',
  factory: () => new RegisterUseCaseService(inject(AUTH_REPOSITORY))
});
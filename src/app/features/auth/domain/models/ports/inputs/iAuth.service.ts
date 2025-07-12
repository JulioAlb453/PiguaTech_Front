import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

// Este es el contrato que los adaptadores de entrada (como la UI) usarán.
// Describe el "QUÉ" se puede hacer, no el "CÓMO".
export class IAuthService {
  // Aquí se pueden definir los métodos que deben implementarse en los adaptadores de entrada.
  // Por ejemplo:
  // login(credentials: CredentialModel): Promise<UserModel>;
  // logout(): Promise<void>;
  
  constructor() { }
}

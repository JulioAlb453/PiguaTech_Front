import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

// Contrato que los adaptadores de infraestructura (alguna API, WS, etc) deben implementar
export class IWeightMeasurementRepositoryService {

  constructor() { }
}

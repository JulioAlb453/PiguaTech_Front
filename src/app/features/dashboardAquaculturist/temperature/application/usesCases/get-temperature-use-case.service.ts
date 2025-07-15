import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IMonitoringService } from '../../domain/input/i-monitoring.service';
import { TemperatureData } from '../../domain/models/temperature-data.model';

@Injectable()
export class GetTemperatureUseCaseService {

  // El caso de uso depende de la ABSTRACCIÓN (el puerto), no de la implementación.
  constructor(private readonly monitoringService: IMonitoringService) {}

  // Podrías tener un método para datos históricos
  // executeHistorical(range: TimeRange) { ... }

  // Y ahora uno para datos en tiempo real
  executeRealTime(): Observable<TemperatureData> {
    return this.monitoringService.getRealTimeData();
  }
}
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { IMonitoringService, HistoricalTemperatureData } from '../../domain/input/i-monitoring.service';
import { TemperatureData } from '../../domain/models/temperature-data.model';
import { TimeRange } from '../../domain/models/time-range.enum';

interface WsMessage {
  topic: string;
  payload: any;
}

@Injectable() // No uses providedIn: 'root' aquí, lo proveeremos manualmente.
export class WebsocketTemperatureService implements IMonitoringService {
  
  private socket$: WebSocketSubject<WsMessage>;
  private readonly WEBSOCKET_URL = 'ws://localhost:8765';

  constructor() {
    this.socket$ = webSocket<WsMessage>(this.WEBSOCKET_URL);
  }

  // --- IMPLEMENTACIÓN DEL NUEVO MÉTODO ---
  getRealTimeData(): Observable<TemperatureData> {
    return this.socket$.asObservable().pipe(
      // 1. Filtrar solo los mensajes para el topic de temperatura
      filter(msg => msg.topic === 'sensor.temperatura'),
      // 2. Extraer y parsear el payload
      map(msg => {
        try {
          // El payload es un string JSON, lo convertimos a objeto
          const parsedPayload = JSON.parse(msg.payload);
          // Mapeamos al modelo de nuestro dominio
          return {
            value: parsedPayload.value,
            timestamp: new Date().toISOString() // O usar el timestamp del backend si lo provee
          } as TemperatureData;
        } catch (e) {
          console.error("Payload de temperatura no válido:", msg.payload, e);
          return null;
        }
      }),
      // 3. Ignorar cualquier mensaje que no se pudo parsear
      filter((data): data is TemperatureData => data !== null)
    );
  }

  // --- MÉTODO LEGADO (para datos históricos) ---
  // Por ahora, puedes dejarlo sin implementar o que devuelva datos mock
  // si no lo necesitas junto con el tiempo real.
  getData(range: TimeRange): Observable<HistoricalTemperatureData> {
    // Si este adaptador SÓLO maneja tiempo real, puedes lanzar un error.
    throw new Error('Este adaptador solo soporta datos en tiempo real.');
    
    // O devolver un observable vacío si es más conveniente
    // return of({ series: [], categories: [] });
  }
}
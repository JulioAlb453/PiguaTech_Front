import { Injectable } from '@angular/core';
import { Observable, interval } from 'rxjs';
import { map } from 'rxjs/operators';

export interface TemperatureData {
  value: number;
  timestamp: string;
}

//Datos para simulación
@Injectable({ providedIn: 'root' })
export class WebSocketService {
  getTemperatureStream(): Observable<TemperatureData> {
    return new Observable<TemperatureData>((observer) => {
      let socket: WebSocket;

      try {
        socket = new WebSocket('ws://localhost:8000/ws/temperature');

        socket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          observer.next(data);
        };

        socket.onerror = (err) => {
          console.warn('❌ WebSocket error. Usando datos simulados.');
          this.startMockStream(observer);
        };

        socket.onclose = () => {
          console.warn('❌ WebSocket cerrado. Usando datos simulados.');
          this.startMockStream(observer);
        };

      } catch (err) {
        console.warn('❌ Error al crear WebSocket. Usando datos simulados.');
        this.startMockStream(observer);
      }
    });
  }

  private startMockStream(observer: any) {
    interval(1000).pipe(
      map(() => ({
        value: Math.random() * 10 + 20,
        timestamp: new Date().toISOString()
      }))
    ).subscribe(observer);
  }
}




/*import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface TemperatureData {
  value: number;
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private ws: WebSocket;

  constructor() {
    this.ws = new WebSocket('ws://localhost:8000/ws/temperature'); // 👈 ajusta la URL de tu FastAPI
  }

  getTemperatureStream(): Observable<TemperatureData> {
    return new Observable(observer => {
      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        observer.next(data);
      };

      this.ws.onerror = (error) => {
        observer.error(error);
      };

      this.ws.onclose = () => {
        observer.complete();
      };
    });
  }
}*/

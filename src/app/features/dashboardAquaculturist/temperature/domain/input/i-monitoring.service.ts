// src/app/core/services/monitoring.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { WebSocketService } from './websocket.service';

export interface TemperatureData {
  value: number;
  timestamp: string;
}

export enum TimeRange {
  Daily = 'daily',
  Weekly = 'weekly',
  Monthly = 'monthly'
}

@Injectable({
  providedIn: 'root'
})
export class MonitoringService {
  private API_URL = 'http://localhost:8000/readings';

  constructor(
    private http: HttpClient,
    private webSocketService: WebSocketService
  ) {}

  // HISTÓRICO de temperatura
  getTemperatureData(range: TimeRange): Observable<any> {
    const params = new HttpParams().set('period', range);
    return this.http.get(`${this.API_URL}/temperature-trend`, { params }).pipe(
      catchError(err => {
        console.error('Error fetching historical temperature data:', err);
        return throwError(() => err);
      })
    );
  }

  // HISTÓRICO de peso semanal
  getWeeklyWeightTrend(pondId: number, weeks: number): Observable<any> {
    let params = new HttpParams()
      .set('pond_id', pondId)
      .set('weeks', weeks);

    return this.http.get(`${this.API_URL}/weight-trend`, { params }).pipe(
      catchError(err => {
        console.error('Error fetching weekly weight trend:', err);
        return throwError(() => err);
      })
    );
  }

  // TEMPERATURA en tiempo real (websocket)
  getRealTimeData(): Observable<TemperatureData> {
    return this.webSocketService.getTemperatureStream();
  }
}

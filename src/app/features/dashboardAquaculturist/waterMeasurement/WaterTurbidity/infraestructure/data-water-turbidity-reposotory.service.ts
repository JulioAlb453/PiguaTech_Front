import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WaterTurbidity } from '../domain/models/water-turbity'; 

@Injectable({ providedIn: 'root' })
export class DataWaterTurbidityReposotoryService {
  constructor(private http: HttpClient) {}

  getTurbidityTrend(): Observable<WaterTurbidity> {
    return this.http.get<WaterTurbidity>('/api/readings/turbidity');
  }
}

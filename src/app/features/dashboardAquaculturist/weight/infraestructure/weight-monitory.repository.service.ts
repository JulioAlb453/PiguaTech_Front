// src/app/services/weight-monitory-repository.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface WeightTrendData {
  month: number;
  avg_weight: number;
}

@Injectable({
  providedIn: 'root'
})
export class WeightMonitoryRepositoryService {
  private baseUrl = 'http://localhost:3000/readings';

  constructor(private http: HttpClient) {}

  getWeightTrend(): Observable<any> {
    return this.http.get(`${this.baseUrl}/weight-trend`);
  }
}

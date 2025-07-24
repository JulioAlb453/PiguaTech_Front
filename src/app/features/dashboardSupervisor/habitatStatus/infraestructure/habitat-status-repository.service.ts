// habitat-status-repository.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { CurrentParameter } from '../domain/models/habitad-current-conditions/current-parameter.model';
import { ParameterIndicador } from '../domain/models/habitad-indicator/parameter-indicador.model';

@Injectable({
  providedIn: 'root'
})
export class HabitatStatusRepositoryService {

  private apiUrl = 'http://localhost:8000/api/habitat-status';

  constructor(private http: HttpClient) {}

  getHabitatStatus(): Observable<{
    currentConditions: CurrentParameter[],
    parameterIndicators: ParameterIndicador[],
    lastUpdate: string
  }> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => ({
        currentConditions: response.current_conditions,
        parameterIndicators: response.parameter_indicators,
        lastUpdate: response.last_update
      }))
    );
  }
}

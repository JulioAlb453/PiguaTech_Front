// get-habitat-status-use-case.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HabitatStatusRepositoryService } from '../infraestructure/habitat-status-repository.service';
import { CurrentParameter } from '../domain/models/habitad-current-conditions/current-parameter.model';
import { ParameterIndicador } from '../domain/models/habitad-indicator/parameter-indicador.model';

@Injectable({
  providedIn: 'root'
})
export class GetHabitatStatusUseCaseService {

  constructor(private repository: HabitatStatusRepositoryService) {}

  execute(): Observable<{
    currentConditions: CurrentParameter[],
    parameterIndicators: ParameterIndicador[],
    lastUpdate: string
  }> {
    return this.repository.getHabitatStatus();
  }
}

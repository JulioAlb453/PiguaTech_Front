import { Component, OnInit } from '@angular/core';
import { GetHabitatStatusUseCaseService } from '../../habitatStatus/aplication/get-habitat-status-use-case.service';
import { CurrentParameter } from '../../habitatStatus/domain/models/habitad-current-conditions/current-parameter.model';
import { ParameterIndicador } from '../../habitatStatus/domain/models/habitad-indicator/parameter-indicador.model';
import { ParameterState } from '../../habitatStatus/domain/models/common/parameter-state.enum';

@Component({
  selector: 'app-habitat-status-dashboard',
  standalone: false, 
  templateUrl: './habitat-status-dashboard.component.html',
  styleUrl: './habitat-status-dashboard.component.scss',
})
export class HabitatStatusDashboardComponent implements OnInit {
  public lastUpdate: Date = new Date();
  public currentConditions: CurrentParameter[] = [];
  public parameterIndicators: ParameterIndicador[] = [];

  constructor(private getHabitatStatusUseCase: GetHabitatStatusUseCaseService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.getHabitatStatusUseCase.execute().subscribe({
      next: (data) => {
        this.currentConditions = data.currentConditions;
        this.parameterIndicators = data.parameterIndicators;
        this.lastUpdate = data.lastUpdate ? new Date(data.lastUpdate) : new Date();
      },
      error: (err) => {
        console.error('Error:', err);
        this.loadDataTem();
      }
    });
  }

  // ✅ Fallback HARDCODE si la API falla
  loadDataTem(): void {
    this.currentConditions = [
      { name: 'Temperatura', curretValue: 27, unit: '°C', trend: 2.2 },
      { name: 'Turbidez', curretValue: 1.2, unit: '°G/L', trend: -0.1 },
      { name: 'Volumen del agua', curretValue: 15, unit: 'L', trend: 500 },
      {
        name: 'Peso de la población',
        curretValue: 250,
        unit: 'Gr',
        trend: 200,
      },
    ];

    this.parameterIndicators = [
      {
        name: 'Temperatura',
        icon: 'thermostat',
        optimalRange: '27°C - 32°C',
        state: ParameterState.Optimo,
      },
      {
        name: 'Turbidez',
        icon: 'water',
        optimalRange: '5 G/L - 7 G/L',
        state: ParameterState.Optimo,
      },
      {
        name: 'Volumen de agua',
        icon: 'opacity',
        optimalRange: '13 L - 15 L',
        state: ParameterState.Atencion,
      },
      {
        name: 'Peso de la población',
        icon: 'scale',
        optimalRange: '270 gr - 320 gr',
        state: ParameterState.Optimo,
      },
    ];
      this.lastUpdate = new Date();
  }
}

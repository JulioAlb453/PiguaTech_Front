// Importaciones de Angular
import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- IMPORTANTE: Necesario para *ngIf, etc. en componentes standalone
import { Subscription } from 'rxjs';

// Importaciones de la librería de gráficas
import {
  ApexAxisChartSeries, ApexChart, ApexXAxis, ApexYAxis,
  ApexStroke, ApexGrid, ApexDataLabels, ChartComponent, NgApexchartsModule // <-- IMPORTANTE: Se importa el módulo del gráfico
} from "ng-apexcharts";

// Importa aquí tus servicios y modelos (descomenta cuando los tengas)
// import { GetTemperatureUseCaseService } from '../../temperature/application/usesCases/get-temperature-use-case.service';
// import { TemperatureData } from '../../temperature/domain/models/temperature-data.model';

// Definimos el tipo completo para evitar errores
export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  grid: ApexGrid;
  dataLabels: ApexDataLabels;
};

@Component({
  selector: 'app-temperature-dashboard',
  standalone: true,  
  imports: [
    CommonModule,       
    NgApexchartsModule   
  ],
  templateUrl: './temperature-dashboard.component.html',
  styleUrls: ['./temperature-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // providers: [GetTemperatureUseCaseService, ... ] 
})
export class TemperatureDashboardComponent implements OnInit, OnDestroy {

  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions!: ChartOptions;

  private dataSubscription!: Subscription;
  private readonly MAX_DATA_POINTS = 20;

  constructor(
    // private readonly getTemperatureUseCase: GetTemperatureUseCaseService, 
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initializeChartWithOptions();
    // this.subscribeToRealtimeData(); 
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  private initializeChartWithOptions(): void {
    this.chartOptions = {
      series: [{
        name: 'Temperatura',
        data: []
      }],
      chart: {
        height: 250,
        type: 'line',
        background: 'transparent',
        animations: {
          enabled: true,
          dynamicAnimation: { speed: 1000 }
        },
        toolbar: { show: false },
        zoom: { enabled: false }
      },
      stroke: {
        curve: "smooth",
        width: 3.5,
        colors: ["#e0e0e0"]
      },
      dataLabels: {
        enabled: false
      },
      grid: {
        show: false
      },
      xaxis: {
        type: 'category',
        range: this.MAX_DATA_POINTS,
        labels: {
          style: {
            colors: '#a0a0a0',
            fontSize: "14px",
            fontWeight: 500
          }
        },
        axisBorder: { show: false },
        axisTicks: { show: false }
      },
      yaxis: {
        show: false
      }
    };
  }

  /*
  private subscribeToRealtimeData(): void {
    this.dataSubscription = this.getTemperatureUseCase.executeRealTime()
      .subscribe({
        next: (dataPoint: TemperatureData) => this.updateChart(dataPoint),
        error: (err) => console.error("Error en la conexión WebSocket:", err)
      });
  }

  private updateChart(dataPoint: TemperatureData): void {
    const currentSeriesData = this.chartOptions.series[0].data as number[];
    const currentCategories = this.chartOptions.xaxis.categories as string[] || [];

    currentSeriesData.push(dataPoint.value);
    currentCategories.push(new Date(dataPoint.timestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }));

    if (currentSeriesData.length > this.MAX_DATA_POINTS) {
      currentSeriesData.shift();
      currentCategories.shift();
    }

    this.chart.updateOptions({
      series: [{ data: currentSeriesData }],
      xaxis: { categories: currentCategories }
    });

    this.cdr.markForCheck();
  }
  */
}
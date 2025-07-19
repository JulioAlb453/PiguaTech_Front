// Importaciones de Angular
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- IMPORTANTE: Necesario para *ngIf, etc. en componentes standalone
import { Subscription } from 'rxjs';

// Importaciones de la librería de gráficas
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexStroke,
  ApexGrid,
  ApexDataLabels,
  ApexLegend,
  ApexTooltip,
  ChartComponent,
  NgApexchartsModule,
} from 'ng-apexcharts';

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
  legend: ApexLegend;
  colors: string[];
  tooltip: ApexTooltip;
};

@Component({
  selector: 'app-temperature-dashboard',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './temperature-dashboard.component.html',
  styleUrls: ['./temperature-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // providers: [GetTemperatureUseCaseService, ... ]
})
export class TemperatureDashboardComponent implements OnInit, OnDestroy {
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions!: ChartOptions;

  private dataSubscription!: Subscription;
  private readonly MAX_DATA_POINTS = 20;

  // Datos para mostrar en la UI
  public currentTemperature: number = 18.5;
  public averageHigh: number = 29.8;
  public averageLow: number = 7.3;

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
    // --- DATOS DE EJEMPLO PARA LAS TRES SERIES ---
    const categories = [
      'Ene',
      'Feb',
      'Mar',
      'Abr',
      'May',
      'Jun',
      'Jul',
      'Ago',
      'Sep',
      'Oct',
      'Nov',
      'Dic',
    ];

    const tempDataMaxLimit = [30, 30, 31, 31, 32, 32, 33, 33, 32, 31, 30, 30];
    const tempDataMinLimit = [10, 10, 11, 11, 12, 12, 13, 13, 12, 11, 10, 10];

    const tempActualData = tempDataMinLimit.map((min, index) => {
      const max = tempDataMaxLimit[index];
      return parseFloat((min + Math.random() * (max - min)).toFixed(1));
    });

   this.chartOptions = {
      series: [
        { name: 'Límite Máximo', data: tempDataMaxLimit },
        { name: 'Temperatura Actual', data: tempActualData },
        { name: 'Límite Mínimo', data: tempDataMinLimit }
      ],
      chart: {
        height: 320,
        type: 'line',
        background: '#1a1a1a', // Fondo oscuro
        foreColor: '#ffffff', // Color de texto blanco
        toolbar: { show: false },
        zoom: { enabled: false },
        dropShadow: {
          enabled: true,
          color: '#000000',
          top: 10,
          left: 7,
          blur: 10,
          opacity: 0.2
        }
      },
      colors: ["#FF4560", "#00E396", "#775DD0"], 
      stroke: {
        curve: "smooth",
        width: [2.5, 4, 2.5],
        dashArray: [5, 0, 5]
      },
      dataLabels: {
        enabled: false
      },
      grid: {
        borderColor: '#333333', // Líneas de grid más suaves
        strokeDashArray: 3,
        yaxis: { 
          lines: { 
            show: true 
          } 
        },
        xaxis: { 
          lines: { 
            show: false 
          } 
        }
      },
      xaxis: {
        categories: categories,
        labels: { 
          style: { 
            colors: '#ffffff', // Texto blanco
            fontSize: "14px" 
          } 
        },
        axisBorder: { 
          show: false 
        },
        axisTicks: { 
          show: false 
        }
      },
      yaxis: {
        labels: {
          style: { 
            colors: '#ffffff', // Texto blanco
            fontSize: '14px' 
          },
          formatter: (val) => `${val.toFixed(0)}°C`
        }
      },
      legend: {
        show: true,
        position: 'top',
        horizontalAlign: 'right',
        fontSize: '14px',
        labels: { 
          colors: '#ffffff' // Texto blanco
        },
        markers: {
          strokeWidth: 4
        }
      },
      tooltip: {
        enabled: true,
        shared: true,
        theme: 'dark', // Tooltip oscuro
        style: {
          fontSize: '14px'
        }
      }
    };
  }
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

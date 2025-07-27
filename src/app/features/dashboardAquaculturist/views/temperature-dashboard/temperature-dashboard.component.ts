import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
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
  NgApexchartsModule
} from 'ng-apexcharts';

import {
  MonitoringService,
  TimeRange,
  TemperatureData
} from '../../temperature/domain/input/i-monitoring.service';
import { WebSocketService } from '../../temperature/domain/input/websocket.service';


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
  imports: [NgApexchartsModule],
  templateUrl: './temperature-dashboard.component.html',
  styleUrls: ['./temperature-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemperatureDashboardComponent implements OnInit, OnDestroy {
  public TimeRange = TimeRange;

  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions!: ChartOptions;

  private dataSubscription!: Subscription;
  private readonly MAX_DATA_POINTS = 20;

  public currentTemperature: number = 0; 
  public averageHigh: number = 29.8;
  public averageLow: number = 7.3;

  // Estado del rango de tiempo seleccionado
  public selectedRange: TimeRange = TimeRange.Weekly;

  constructor(
    private monitoringService: MonitoringService,
    private webSocketService: WebSocketService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initializeChartWithDefaults();
    this.loadHistoricalData(this.selectedRange);
    this.subscribeToRealtimeData();
  }

  ngOnDestroy(): void {
    this.dataSubscription?.unsubscribe();
  }

  // Cambiar rango y recargar datos
  onRangeChange(range: TimeRange) {
    this.selectedRange = range;
    this.loadHistoricalData(range);
  }

  /** Inicializa con data mínima para que el gráfico no esté vacío */
  private initializeChartWithDefaults(): void {
    this.chartOptions = {
      series: [
        { name: 'Límite Máximo', data: [this.averageHigh] },
        { name: 'Temperatura Actual', data: [] },
        { name: 'Límite Mínimo', data: [this.averageLow] }
      ],
      chart: {
        height: 320,
        type: 'line',
        background: '#1a1a1a',
        foreColor: '#ffffff',
        toolbar: { show: false },
        zoom: { enabled: false }
      },
      colors: ['#FF4560', '#00E396', '#775DD0'],
      stroke: {
        curve: 'smooth',
        width: [2.5, 4, 2.5],
        dashArray: [5, 0, 5]
      },
      dataLabels: { enabled: false },
      grid: {
        borderColor: '#333333',
        strokeDashArray: 3,
        yaxis: { lines: { show: true } },
        xaxis: { lines: { show: false } }
      },
      xaxis: {
        categories: [],
        labels: {
          style: { colors: '#ffffff', fontSize: '14px' }
        },
        axisBorder: { show: false },
        axisTicks: { show: false }
      },
      yaxis: {
        labels: {
          style: { colors: '#ffffff', fontSize: '14px' },
          formatter: val => `${val.toFixed(1)}°C`
        }
      },
      legend: {
        show: true,
        position: 'top',
        horizontalAlign: 'right',
        fontSize: '14px',
        labels: { colors: '#ffffff' },
        markers: { strokeWidth: 4 }
      },
      tooltip: {
        enabled: true,
        shared: true,
        theme: 'dark',
        style: { fontSize: '14px' }
      }
    };
  }

  /** Carga datos reales del backend y reemplaza todo */
  private loadHistoricalData(range: TimeRange): void {
    this.monitoringService.getTemperatureData(range).subscribe({
      next: (data: any) => {
        const actualSeries = data.map((item: any) => item.temperature);
        const categories = data.map((item: any) =>
          new Date(item.date).toLocaleTimeString()
        );

        this.chartOptions.series = [
          { name: 'Límite Máximo', data: Array(actualSeries.length).fill(this.averageHigh) },
          { name: 'Temperatura Actual', data: actualSeries },
          { name: 'Límite Mínimo', data: Array(actualSeries.length).fill(this.averageLow) }
        ];

        this.chartOptions.xaxis.categories = categories;

        this.chart.updateOptions({
          series: this.chartOptions.series,
          xaxis: { categories }
        });
      },
      error: (err: any) => console.error('Error loading historical data:', err)
    });
  }

  /** Escucha stream real-time y añade al gráfico */
  private subscribeToRealtimeData(): void {
    this.dataSubscription = this.webSocketService.getTemperatureStream().subscribe({
      next: (data: TemperatureData) => {
        this.currentTemperature = data.value;
        this.appendRealtimeData(data);
        this.cdr.markForCheck();
      },
      error: err => console.error('Error on realtime', err)
    });
  }

  /** Añade punto nuevo al final */
  private appendRealtimeData(data: TemperatureData): void {
    const series = [...this.chartOptions.series];
    const actual = series[1].data as number[];
    const categories = [...this.chartOptions.xaxis.categories as string[]];

    actual.push(data.value);
    categories.push(new Date(data.timestamp).toLocaleTimeString());

    if (actual.length > this.MAX_DATA_POINTS) {
      actual.shift();
      categories.shift();
    }

    // Mantiene líneas de límite con misma longitud
    series[0].data = Array(actual.length).fill(this.averageHigh);
    series[2].data = Array(actual.length).fill(this.averageLow);

    this.chart.updateOptions({
      series: series,
      xaxis: { categories }
    });
  }
}

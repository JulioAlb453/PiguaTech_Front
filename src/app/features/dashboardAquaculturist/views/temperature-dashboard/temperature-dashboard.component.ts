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

import { TimeRange } from '../../temperature/domain/input/i-monitoring.service';

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
  standalone: false,
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
  private readonly UPDATE_INTERVAL = 3000; // 3 segundos

  public currentTemperature: number = 24.5; 
  public averageHigh: number = 29.8;
  public averageLow: number = 7.3;

  // Estado del rango de tiempo seleccionado
  public selectedRange: TimeRange = TimeRange.Weekly;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.initializeChartWithDefaults();
    this.loadHardcodedData(this.selectedRange);
    this.simulateRealtimeData();
  }

  ngOnDestroy(): void {
    this.dataSubscription?.unsubscribe();
  }

  // Cambiar rango y recargar datos
  onRangeChange(range: TimeRange) {
    this.selectedRange = range;
    this.loadHardcodedData(range);
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

  /** Carga datos hardcodeados según el rango seleccionado */
  private loadHardcodedData(range: TimeRange): void {
    let data: { temperature: number; date: string }[] = [];
    let categories: string[] = [];

    switch (range) {
      case TimeRange.Daily:
        // Datos para 24 horas (cada hora)
        for (let i = 0; i < 24; i++) {
          const hour = i < 10 ? `0${i}:00` : `${i}:00`;
          const temp = 15 + Math.sin(i / 4) * 10 + (Math.random() * 2 - 1);
          data.push({ temperature: parseFloat(temp.toFixed(1)), date: hour });
          categories.push(hour);
        }
        break;
      
      case TimeRange.Weekly:
        // Datos para 7 días
        const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
        days.forEach(day => {
          const temp = 15 + Math.random() * 10;
          data.push({ temperature: parseFloat(temp.toFixed(1)), date: day });
          categories.push(day);
        });
        break;
      
      case TimeRange.Monthly:
        // Datos para 4 semanas
        for (let i = 1; i <= 4; i++) {
          const temp = 15 + Math.sin(i) * 5 + (Math.random() * 3 - 1.5);
          data.push({ temperature: parseFloat(temp.toFixed(1)), date: `Sem ${i}` });
          categories.push(`Sem ${i}`);
        }
        break;
    }

    const actualSeries = data.map(item => item.temperature);

    this.chartOptions.series = [
      { name: 'Límite Máximo', data: Array(actualSeries.length).fill(this.averageHigh) },
      { name: 'Temperatura Actual', data: actualSeries },
      { name: 'Límite Mínimo', data: Array(actualSeries.length).fill(this.averageLow) }
    ];

    this.chartOptions.xaxis.categories = categories;

    if (this.chart) {
      this.chart.updateOptions({
        series: this.chartOptions.series,
        xaxis: { categories }
      });
    }
  }

  /** Simula datos en tiempo real */
  private simulateRealtimeData(): void {
    this.dataSubscription = new Subscription();
    
    // Simular actualización cada 3 segundos
    const intervalId = setInterval(() => {
      const newTemp = 20 + Math.random() * 5; // Temperatura entre 20-25°C
      this.currentTemperature = parseFloat(newTemp.toFixed(1));
      this.appendRealtimeData({
        value: this.currentTemperature,
        timestamp: new Date().toISOString()
      });
      this.cdr.markForCheck();
    }, 3000);

    this.dataSubscription.add({ unsubscribe: () => clearInterval(intervalId) });
  }

  /** Añade punto nuevo al final */
  private appendRealtimeData(data: { value: number; timestamp: string }): void {
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
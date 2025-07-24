import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
// Importaciones de Angular
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
 // <-- IMPORTANTE: Necesario para *ngIf, etc. en componentes standalone
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
  NgApexchartsModule,
} from 'ng-apexcharts';

import { MonitoringService, TimeRange, TemperatureData } from '../../temperature/domain/input/i-monitoring.service';
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
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions!: ChartOptions;

  private dataSubscription!: Subscription;
  private readonly MAX_DATA_POINTS = 20;

  public currentTemperature: number = 18.5;
  public averageHigh: number = 29.8;
  public averageLow: number = 7.3;

  constructor(
    private monitoringService: MonitoringService,
    private webSocketService: WebSocketService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initializeChartWithOptions();
    this.loadHistoricalData(TimeRange.Weekly);
    this.subscribeToRealtimeData();
  }

  ngOnDestroy(): void {
    this.dataSubscription?.unsubscribe();
  }

private initializeChartWithOptions(): void {
  this.chartOptions = {
    series: [
      { name: 'Límite Máximo', data: [] },
      { name: 'Temperatura Actual', data: [] },
      { name: 'Límite Mínimo', data: [] }
    ],
    chart: {
      height: 320,
      type: 'line',
      background: '#1a1a1a',
      foreColor: '#ffffff',
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
        style: {
          colors: '#ffffff',
          fontSize: "14px"
        }
      },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#ffffff',
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


private loadHistoricalData(range: TimeRange): void {
  this.monitoringService.getData(range).subscribe({
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


  private subscribeToRealtimeData(): void {
    this.dataSubscription = this.webSocketService.getTemperatureStream().subscribe({
      next: (data: TemperatureData) => {        
      this.currentTemperature = data.value;
        this.updateChart(data);
        this.cdr.markForCheck();
      }
    });
  }

  private updateChart(dataPoint: TemperatureData): void {
    const series = [...this.chartOptions.series];
    const actualSeries = series[1].data as number[];
    const categories = [...this.chartOptions.xaxis.categories as string[]];

    actualSeries.push(dataPoint.value);
    categories.push(new Date(dataPoint.timestamp).toLocaleTimeString());

    if (actualSeries.length > this.MAX_DATA_POINTS) {
      actualSeries.shift();
      categories.shift();
    }

    this.chart.updateOptions({
      series: [
        series[0],
        { name: 'Temperatura Actual', data: actualSeries },
        series[2]
      ],
      xaxis: { categories }
    });
  }
}

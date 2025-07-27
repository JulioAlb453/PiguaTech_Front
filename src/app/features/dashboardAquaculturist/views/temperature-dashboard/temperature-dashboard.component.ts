import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { Subscription, interval } from 'rxjs';
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
} from 'ng-apexcharts';

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
  @ViewChild('chart', { static: true }) chart!: ChartComponent;
  public chartOptions: ChartOptions;

  private dataSubscription!: Subscription;
  private readonly MAX_DATA_POINTS = 20;
  private readonly UPDATE_INTERVAL = 3000; // 3 segundos

  public currentTemperature: number = 0;
  public averageHigh: number = 34;
  public averageLow: number = 22;
  private baseTemperature: number = 26;

  public alertaTemperatura: boolean = false;

  constructor(private cdr: ChangeDetectorRef) {
    this.chartOptions = this.createChartOptions();
  }

  ngOnInit(): void {
    this.generateInitialData();
    this.startDataStream();

    // WebSocket temporalmente desactivado
    // this.socketService.connect().subscribe(data => {
    //   this.handleIncomingData(data);
    // });
  }

  ngOnDestroy(): void {
    this.dataSubscription?.unsubscribe();
  }

  private createChartOptions(): ChartOptions {
    return {
      series: [
        { name: 'Temperatura Actual', data: [] },
        { name: 'Límite Máximo', data: [] },
        { name: 'Límite Mínimo', data: [] }
      ],
      chart: {
        height: 350,
        type: 'line',
        animations: { enabled: true },
        background: '#1a1a1a',
        foreColor: '#ffffff',
        toolbar: { show: false },
        zoom: { enabled: false }
      },
      colors: ["#00E396", "#FF4560", "#775DD0"],
      stroke: {
        curve: "smooth",
        width: [4, 2, 2],
        dashArray: [0, 5, 5]
      },
      dataLabels: { enabled: false },
      grid: {
        borderColor: '#333333',
        strokeDashArray: 3,
        yaxis: { lines: { show: true } },
        xaxis: { lines: { show: false } }
      },
      xaxis: {
        type: 'datetime',
        labels: {
          style: { colors: '#ffffff' },
          formatter: (value) => {
            const date = new Date(value);
            return date.toLocaleTimeString('es-MX', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false
            });
          }
        },
        axisBorder: { show: false },
        axisTicks: { show: false }
      },
      yaxis: {
        min: 20,
        max: 32,
        labels: {
          style: { colors: '#ffffff' },
          formatter: (val) => `${val.toFixed(0)}°C`
        }
      },
      legend: {
        position: 'top',
        labels: { colors: '#ffffff' }
      },
      tooltip: {
        theme: 'dark',
        y: { formatter: (val) => `${val.toFixed(1)}°C` },
        x: {
          formatter: (val) => {
            const date = new Date(val);
            return date.toLocaleTimeString('es-MX', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false
            });
          }
        }
      }
    };
  }

  private generateInitialData(): void {
    const now = Date.now();
    const initialDataPoints = 5;

    for (let i = 0; i < initialDataPoints; i++) {
      const timestamp = new Date(now - (initialDataPoints - i - 1) * this.UPDATE_INTERVAL);
      const temp = this.getRandomTemperature();

      this.addDataPoint({
        value: temp,
        timestamp: timestamp.getTime()
      });

      if (i === initialDataPoints - 1) {
        this.currentTemperature = temp;
        this.updateAlert(temp);
      }
    }
  }

  private startDataStream(): void {
    this.dataSubscription = interval(this.UPDATE_INTERVAL).subscribe(() => {
      const newData = {
        value: this.getRandomTemperature(),
        timestamp: Date.now()
      };

      this.currentTemperature = newData.value;
      this.addDataPoint(newData);
      this.updateAlert(newData.value);
      this.cdr.markForCheck();
    });
  }
private getRandomTemperature(): number {
  const random = Math.random();

  // 30% probabilidad de punto crítico (fuera de rango)
  if (random < 0.6) {
    const isLow = Math.random() < 0.5;
    if (isLow) {
      // Pico crítico bajo entre 20 y 23.9 (más bajo que antes para alertar fuerte)
      return parseFloat((20 + Math.random() * 3.9).toFixed(1));
    } else {
      // Pico crítico alto entre 30.1 y 35 (más alto que antes para alertar fuerte)
      return parseFloat((30.1 + Math.random() * 4.9).toFixed(1));
    }
  }

  // Temperatura normal entre 24 y 30 con pequeña variación
  const variation = Math.random() * 1.5 - 0.75; // -0.75 a +0.75
  this.baseTemperature = Math.min(30, Math.max(24, this.baseTemperature + variation));
  return parseFloat(this.baseTemperature.toFixed(1));
}

  private addDataPoint(point: { value: number; timestamp: number }): void {
    const series = [...this.chartOptions.series];
    const newDataPoint = {
      x: point.timestamp,
      y: point.value
    };

    (series[0].data as any[]).push(newDataPoint);

    if (series[0].data.length > this.MAX_DATA_POINTS) {
      (series[0].data as any[]).shift();
    }

    series[1].data = (series[0].data as any[]).map(item => ({ x: item.x, y: this.averageHigh }));
    series[2].data = (series[0].data as any[]).map(item => ({ x: item.x, y: this.averageLow }));

    this.chartOptions.series = series;

    if (this.chart) {
      this.chart.updateSeries(series);
    }
  }

  private updateAlert(temp: number): void {
  this.alertaTemperatura = temp < this.averageLow || temp > this.averageHigh;
}
}

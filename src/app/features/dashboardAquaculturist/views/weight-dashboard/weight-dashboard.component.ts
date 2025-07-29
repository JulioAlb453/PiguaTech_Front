import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import {
  ChartComponent,
  ApexChart,
  ApexAxisChartSeries,
  ApexXAxis,
  ApexYAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexTheme,
  ApexStroke,
  ApexFill, 
  ApexTooltip,
  ApexGrid,
  ApexPlotOptions,
  ApexLegend
} from 'ng-apexcharts';
import { NotificationService } from '../../../../core/services/notification.service';

// Definiendo el tipo aquí para mantenerlo autocontenido
type ChartOption = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  dataLabels: ApexDataLabels;
  title: ApexTitleSubtitle;
  theme: ApexTheme;
  colors: string[];
  plotOptions: ApexPlotOptions;
  grid?: ApexGrid;
  stroke: ApexStroke;
  fill: ApexFill;
  tooltip: ApexTooltip;
  legend: ApexLegend;
};

interface DynamicMetrics {
  averageWeight: number;
  growthSinceLast: number;
  sampleSize: number;
  minWeight: number;
  maxWeight: number;
  variationCoefficient: number;
  progressPercentage: number;
}

@Component({
  selector: 'app-weight-dashboard',
  standalone: false,
  templateUrl: './weight-dashboard.component.html',
  styleUrls: ['./weight-dashboard.component.scss'],
})
export class WeightDashboardComponent implements OnInit {
  @ViewChild('chart') chart!: ChartComponent;
  
  public chartOptions: Partial<ChartOption> = {};
  
  public isWeighing = false;
  public lastWeighingResult: number | null = null;
  
  private weighingHistory: number[] = [];
  private weighingCategories: string[] = [];
  
  public readonly GOAL_WEIGHT = 30;

  public dynamicMetrics!: DynamicMetrics;
  
  constructor(
    private crd: ChangeDetectorRef,
    private notificationService: NotificationService
  ) {
    this.initializeMetrics();
  }

  ngOnInit(): void {
    this.initializeBarChart();
  }

  initializeMetrics(): void {
    this.dynamicMetrics = {
      averageWeight: 0,
      growthSinceLast: 0,
      sampleSize: 0,
      minWeight: 0,
      maxWeight: 0,
      variationCoefficient: 0,
      progressPercentage: 0,
    };
  }

  initializeBarChart(): void {
    this.chartOptions = {
      series: [{ name: 'Peso Registrado', data: [] }],
      chart: {
        type: 'bar',
        height: 350,
        toolbar: { show: false },
        background: 'transparent',
        foreColor: '#e0e0e0',
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          horizontal: false,
          distributed: true,
        },
      },
      xaxis: {
        categories: [],
        labels: { style: { colors: '#e0e0e0' } },
      },
      yaxis: {
        title: { text: 'Peso (g)', style: { color: '#e0e0e0' } },
        labels: { style: { colors: '#e0e0e0' } },
      },
      dataLabels: {
        enabled: true,
        formatter: (val: number) => val.toFixed(2) + 'g',
        style: { colors: ['#fff'], fontSize: '12px' },
      },
      title: {
        text: 'Historial de Pesajes Individuales',
        align: 'left',
        style: { color: '#e0e0e0', fontSize: '16px' },
      },
      grid: {
        borderColor: '#444',
      },
      legend: {
        show: false
      }
    };
  }
  
  updateDynamicMetrics(): void {
    const history = this.weighingHistory;
    const sampleSize = history.length;

    if (sampleSize === 0) {
      this.initializeMetrics();
      return;
    }

    const sum = history.reduce((a, b) => a + b, 0);
    const average = sum / sampleSize;
    
    const squaredDiffs = history.map(value => Math.pow(value - average, 2));
    const avgSquaredDiff = squaredDiffs.reduce((a, b) => a + b, 0) / sampleSize;
    const stdDev = Math.sqrt(avgSquaredDiff);

    this.dynamicMetrics = {
      sampleSize: sampleSize,
      averageWeight: average,
      minWeight: Math.min(...history),
      maxWeight: Math.max(...history),
      growthSinceLast: sampleSize > 1 ? ((history[sampleSize - 1] - history[sampleSize - 2]) / history[sampleSize - 2]) * 100 : 0,
      variationCoefficient: average > 0 ? (stdDev / average) * 100 : 0,
      progressPercentage: (average / this.GOAL_WEIGHT) * 100,
    };
  }

  public performWeighing(): void {
    if (this.isWeighing) return;

    this.isWeighing = true;
    this.lastWeighingResult = null;
    
    setTimeout(() => {
      const result = 6 + Math.random() * 2;
      const newWeight = parseFloat(result.toFixed(2));

      this.lastWeighingResult = newWeight;
      this.isWeighing = false;
      
      this.weighingHistory.push(newWeight);
      this.weighingCategories.push(`Pesaje #${this.weighingHistory.length}`);
      
      this.updateDynamicMetrics();
      
      if (this.chart) {
        this.chart.updateOptions({
          series: [{ data: this.weighingHistory }],
          xaxis: { categories: this.weighingCategories }
        });
      }
      
      this.notificationService.showSuccess('Pesaje Completado', `El peso registrado es de ${newWeight} gramos.`);
      this.crd.detectChanges();

      setTimeout(() => {
        this.lastWeighingResult = null;
        this.crd.detectChanges();
      }, 7000);
    }, 5000);
  }
}
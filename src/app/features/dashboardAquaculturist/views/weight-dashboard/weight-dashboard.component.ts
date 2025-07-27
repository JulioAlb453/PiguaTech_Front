import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ChartComponent, ApexChart, ApexAxisChartSeries, ApexXAxis, ApexYAxis, ApexDataLabels, ApexTitleSubtitle, ApexTheme } from 'ng-apexcharts';
import { WeightMonitoryRepositoryService } from '../../weight/infraestructure/weight-monitory.repository.service';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';

type ChartOption = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  dataLabels: ApexDataLabels;
  title: ApexTitleSubtitle;
  theme: ApexTheme;
  colors: string[];
};

interface GrowthMetric {
  label: string;
  value: string;
}

@Component({
  selector: 'app-weight-dashboard',
  standalone: true, // <-- Asegúrate de que es standalone
  imports: [CommonModule, NgApexchartsModule], // <-- Agrega estos imports
  templateUrl: './weight-dashboard.component.html',
  styleUrls: ['./weight-dashboard.component.scss']
})

export class WeightDashboardComponent implements OnInit {
  @ViewChild('chart') chart!: ChartComponent;

  public chartOptions!: Partial<ChartOption>;
  public keyMetrics: GrowthMetric[] = [
    { label: 'Total de Piguas', value: '1,250' },
    { label: 'Tasa de Crecimiento Actual', value: '3.2%' },
    { label: 'Tasa de Crecimiento vs. Periodo Anterior', value: '2.8% vs. 2.5%' }
  ];

  public kpiData = {
    value: 0,
    unit: 'kg',
    trend: 0,
    period: ''
  };

  public isMeasuring = false; 

  constructor(
    private crd: ChangeDetectorRef,
    private weightRepo: WeightMonitoryRepositoryService
  ) {}

  ngOnInit(): void {
    this.initializeChart();
    this.loadWeightTrend();
  }

  toggleMeasurement(): void {
    this.isMeasuring = !this.isMeasuring;
    // lógica para manejar el inicio/detención de medición
  }

  initializeChart(): void {
    this.chartOptions = {
      series: [{ name: 'Peso Promedio', data: [] }],
      chart: {
        type: 'line',
        height: 300,
        toolbar: { show: false }
      },
      xaxis: {
        categories: []
      },
      yaxis: {
        title: {
          text: 'Peso Promedio (kg)'
        }
      },
      dataLabels: {
        enabled: true
      },
      title: {
        text: 'Peso Promedio a lo Largo del Tiempo'
      },
      theme: {
        mode: 'light'
      },
      colors: ['#008FFB']
    };
  }

  loadWeightTrend(): void {
    this.weightRepo.getWeightTrend().subscribe(data => {
      const seriesData = data.map((item: any) => item.avg_weight);
      const categories = data.map((item: any) => this.monthName(item.month));

      this.chartOptions = {
        ...this.chartOptions,
        series: [{ name: 'Peso Promedio', data: seriesData }],
        xaxis: {
          ...this.chartOptions.xaxis,
          categories: categories
        }
      };

      this.kpiData = {
        value: seriesData[seriesData.length - 1],
        unit: 'kg',
        trend: this.calculateTrend(seriesData),
        period: 'Últimos Meses'
      };

      this.crd.detectChanges();
    });
  }

  monthName(monthNumber: number): string {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return months[monthNumber - 1];
  }

  calculateTrend(seriesData: number[]): number {
    if (seriesData.length < 2) return 0;
    const prev = seriesData[seriesData.length - 2];
    const curr = seriesData[seriesData.length - 1];
    return parseFloat((((curr - prev) / prev) * 100).toFixed(2));
  }
}

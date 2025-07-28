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
  plotOption: any;
  grid?: any; // Add grid property to support chartOptions.grid
};

interface GrowthMetric {
  label: string;
  value: string;
}

@Component({
  selector: 'app-weight-dashboard',
  standalone: false,
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
      height: '100%', 
      toolbar: { show: false },
      background: 'transparent',
      foreColor: '#e0e0e0' 
    },
    xaxis: {
      categories: [],
      labels: {
        style: {
          colors: '#e0e0e0' 
        }
      }
    },
    yaxis: {
      title: {
        text: 'Peso Promedio (kg)',
        style: {
          color: '#e0e0e0'
        }
      },
      labels: {
        style: {
          colors: '#e0e0e0' 
        }
      }
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: ['#fff'] 
      }
    },
    title: {
      text: 'Peso Promedio a lo Largo del Tiempo',
      style: {
        color: '#e0e0e0' 
      }
    },
    theme: {
      mode: 'dark' 
    },
    colors: ['#f39c12'],
    grid: {
      borderColor: '#444' 
    }
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

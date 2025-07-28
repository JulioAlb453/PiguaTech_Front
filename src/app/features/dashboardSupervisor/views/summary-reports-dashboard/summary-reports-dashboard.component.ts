import { Component, OnInit } from '@angular/core';
import ApexCharts from 'apexcharts';

interface SensorData {
  temperature: TemperatureData[];
  turbidity: TurbidityData;
  volume: VolumeData[];
  weight: WeightData[];
  population: PopulationData[];
}

interface TemperatureData {
  date: string;
  value: number;
  week: string;
}

interface TurbidityData {
  clear: number;
  slightlyTurbid: number;
  turbid: number;
  total: number;
  trend: number;
}

interface VolumeData {
  area: string;
  percentage: number;
  capacity: number;
}

interface WeightData {
  pigua: string;
  count: number;
  growth: number;
  avgWeight: number;
}

interface PopulationData {
  date: string;
  count: number;
  week: string;
  survival: number;
}

@Component({
  selector: 'app-summary-reports-dashboard',
  standalone: false,
  templateUrl: './summary-reports-dashboard.component.html',
  styleUrl: './summary-reports-dashboard.component.scss',
})
export class SummaryReportsDashboardComponent implements OnInit {
  private data: SensorData = {
    temperature: [
      { date: '2025-07-01', value: 24.5, week: 'Sem 1' },
      { date: '2025-07-02', value: 25.2, week: 'Sem 1' },
      { date: '2025-07-03', value: 26.1, week: 'Sem 1' },
      { date: '2025-07-04', value: 25.8, week: 'Sem 1' },
      { date: '2025-07-05', value: 26.5, week: 'Sem 1' },
      { date: '2025-07-06', value: 27.2, week: 'Sem 2' },
      { date: '2025-07-07', value: 26.9, week: 'Sem 2' },
      { date: '2025-07-08', value: 27.5, week: 'Sem 2' },
      { date: '2025-07-09', value: 28.1, week: 'Sem 2' },
      { date: '2025-07-10', value: 27.8, week: 'Sem 2' },
      { date: '2025-07-11', value: 28.3, week: 'Sem 3' },
      { date: '2025-07-12', value: 29.0, week: 'Sem 3' },
      { date: '2025-07-13', value: 28.7, week: 'Sem 3' },
      { date: '2025-07-14', value: 29.2, week: 'Sem 3' },
      { date: '2025-07-15', value: 29.5, week: 'Sem 3' },
    ],
    turbidity: {
      clear: 65,
      slightlyTurbid: 25,
      turbid: 10,
      total: 100,
      trend: -8.5,
    },
    volume: [
      { area: 'Estanque Principal', percentage: 85, capacity: 1200 },
      { area: 'Estanque Secundario', percentage: 72, capacity: 800 },
      { area: 'Estanque de Cría', percentage: 90, capacity: 600 },
      { area: 'Estanque de Engorde', percentage: 68, capacity: 1000 },
    ],
    weight: [
      { pigua: 'Lote A', count: 120, growth: 15.5, avgWeight: 245 },
      { pigua: 'Lote B', count: 135, growth: 18.2, avgWeight: 268 },
      { pigua: 'Lote C', count: 128, growth: 16.8, avgWeight: 252 },
      { pigua: 'Lote D', count: 142, growth: 19.1, avgWeight: 275 },
    ],
    population: [
      { date: '2024-06-01', count: 95, week: 'Semana 1', survival: 95.0 },
      { date: '2024-06-08', count: 98, week: 'Semana 2', survival: 97.5 },
      { date: '2024-06-15', count: 105, week: 'Semana 3', survival: 98.1 },
      { date: '2024-06-22', count: 115, week: 'Semana 4', survival: 97.8 },
      { date: '2024-06-29', count: 125, week: 'Semana 5', survival: 98.4 },
      { date: '2024-07-06', count: 138, week: 'Semana 6', survival: 98.9 },
      { date: '2024-07-13', count: 152, week: 'Semana 7', survival: 99.2 },
      { date: '2024-07-20', count: 168, week: 'Semana 8', survival: 98.7 },
    ],
  };

  public metrics = {
    temperature: {
      current: 29.5,
      trend: '+2.1',
      change: '+7.8%',
      status: 'optimal',
    },
    turbidity: {
      clarity: 65,
      trend: '-8.5',
      change: '-8.5%',
      status: 'improving',
    },
    volume: {
      average: 78.75,
      trend: '+5.2',
      change: '+5.2%',
      status: 'stable',
    },
    weight: {
      average: 260,
      growth: 17.4,
      trend: '+15.2',
      change: '+15.2%',
      status: 'excellent',
    },
    population: {
      current: 168,
      growth: 76.8,
      survival: 98.7,
      trend: '+12.5',
      change: '+12.5%',
      status: 'healthy',
    },
  };

  public tempChartOptions!: any;
  public turbidityChartOptions!: any;
  public volumeChartOptions!: any;
  public weightChartOptions!: any;
  public populationChartOptions!: any;

  constructor() {}

  ngOnInit(): void {
    this.initializeCharts();
  }

  private initializeCharts(): void {
    this.initializeTempChart();
    this.initializeTurbidityChart();
    this.initializeVolumeChart();
    this.initializeWeightChart();
    this.initializePopulationChart();
  }

  private initializeTempChart(): void {
    this.tempChartOptions = {
      series: [
        {
          name: 'Temperatura (°C)',
          data: this.data.temperature.map((d) => ({
            x: d.date,
            y: d.value,
          })),
        },
      ],
      chart: {
        type: 'area',
        height: 120,
        sparkline: { enabled: true },
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800,
        },
      },
      stroke: {
        curve: 'smooth',
        width: 6,
        colors: ['#a0a0a0', '#d0d0d0'],
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          gradientToColors: ['#a0a0a0', '#d0d0d0'],
          shadeIntensity: 1,
          type: 'horizontal',
          opacityFrom: 0.4,
          opacityTo: 0.1,
          stops: [0, 100],
        },
      },
      tooltip: {
        theme: 'dark',
        style: {
          fontSize: '12px',
          fontFamily: 'Inter, sans-serif',
        },
      },
      grid: {
        show: false,
      },
    };
  }

  private initializeTurbidityChart(): void {
    const turbidity = this.data.turbidity;
    this.turbidityChartOptions = {
      series: [turbidity.clear, turbidity.slightlyTurbid, turbidity.turbid],
      chart: {
        type: 'donut',
        height: 140,
        sparkline: { enabled: true },
      },
      colors: ['#10b981', '#f59e0b', '#ef4444'],
      labels: ['Clara', 'Ligeramente Turbia', 'Turbia'],
      plotOptions: {
        pie: {
          donut: {
            size: '70%',
            labels: {
              show: true,
              total: {
                show: true,
                label: 'Total',
                fontSize: '12px',
                color: '#ffffffff',
                formatter: () => `${turbidity.total}%`,
              },
            },
          },
        },
      },
      legend: {
        show: false,
      },
      tooltip: {
        theme: 'dark',
        y: {
          formatter: (val: number) => `${val}%`,
        },
      },
    };
  }

  private initializeVolumeChart(): void {
    const volume = this.data.volume;
    this.volumeChartOptions = {
      series: [
        {
          name: 'Porcentaje volumen del agua',
          data: volume.map((v) => v.percentage),
        },
      ],
      chart: {
        type: 'bar',
        height: 180,
        sparkline: { enabled: true },
      },
      plotOptions: {
        bar: {
          horizontal: true,
          barHeight: '60%',
          distributed: true,
          borderRadius: 6,
        },
      },
      colors: ['#EA7F3D', '#d0d0d0'],
      xaxis: {
        categories: volume.map((v) => v.area.split(' ')[1] || v.area),
      },
      tooltip: {
        theme: 'dark',
        y: {
          formatter: (val: number, opts: any) => {
            const capacity = volume[opts.dataPointIndex].capacity;
            return `${val}% (${capacity}L)`;
          },
        },
      },
    };
  }

  private initializeWeightChart(): void {
    const weight = this.data.weight;
    this.weightChartOptions = {
      series: [
        {
          name: 'Crecimiento (%)',
          data: weight.map((p) => p.growth),
        },
        {
          name: 'Peso Promedio (g)',
          data: weight.map((p) => p.avgWeight),
        },
      ],
      chart: {
        type: 'bar',
        height: 140,
        sparkline: { enabled: true },
      },
      plotOptions: {
        bar: {
          columnWidth: '70%',
          distributed: false,
          borderRadius: 4,
        },
      },
      colors: ['#EA7F3D', '#f7f7f7ff'],
      xaxis: {
        categories: weight.map((p) => p.pigua),
      },
      legend: {
        show: false,
      },
      tooltip: {
        theme: 'dark',
        shared: true,
        intersect: false,
      },
    };
  }

  private initializePopulationChart(): void {
    this.populationChartOptions = {
      series: [
        {
          name: 'Población',
          data: this.data.population.map((p) => ({
            x: p.date,
            y: p.count,
          })),
        },
        {
          name: 'Supervivencia (%)',
          data: this.data.population.map((p) => ({
            x: p.date,
            y: p.survival,
          })),
        },
      ],
      chart: {
        type: 'area',
        height: 140,
        sparkline: { enabled: true },
        stacked: false,
      },
      stroke: {
        curve: 'smooth',
        width: [5, 3],
        colors: ['#EA7F3D', '#f1f1f1ff'],
      },
      fill: {
        type: 'gradient',
        gradient: {
          gradientToColors: ['#a0a0a0', '#d0d0d0'],
          opacityFrom: [0.4, 0.2],
          opacityTo: [0.1, 0.05],
          stops: [0, 100],
        },
      },
      colors: ['#a0a0a0', '#d0d0d0'],
      tooltip: {
        theme: 'dark',
        shared: true,
        intersect: false,
      },
    };
  }

  public getStatusClass(status: string): string {
    const statusClasses = {
      optimal: 'card__status--success',
      improving: 'card__status--success',
      stable: 'card__status--info',
      excellent: 'card__status--success',
      healthy: 'card__status--success',
      warning: 'card__status--warning',
      critical: 'card__status--danger',
    };
    return (
      statusClasses[status as keyof typeof statusClasses] ||
      'card__status--info'
    );
  }

  public getTrendClass(trend: string): string {
    const isPositive = trend.startsWith('+');
    return isPositive ? 'card__trend--positive' : 'card__trend--negative';
  }
}

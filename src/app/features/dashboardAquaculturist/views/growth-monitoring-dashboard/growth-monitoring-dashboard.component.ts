import {
  AfterViewInit,
  Component,
  ChangeDetectorRef,
  ViewChild,
  OnInit,
} from '@angular/core';
import {
  ChartComponent,
  ApexChart,
  ApexAxisChartSeries,
  ApexXAxis,
  ApexStroke,
  ApexFill,
  ApexTooltip,
  ApexDataLabels,
} from 'ng-apexcharts';

interface TimeRangeOption {
  id: '7d' | '30d' | '90d';
  label: string;
}

interface GrowthKpi {
  value: number;
  unit: string;
  trend: number;
  period: string;
}

interface KeyMetric {
  label: string;
  value: string;
}

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  fill: ApexFill;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
};
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-growth-monitoring-dashboard',
  standalone: false,
  templateUrl: './growth-monitoring-dashboard.component.html',
  styleUrl: './growth-monitoring-dashboard.component.scss',
})


export class GrowthMonitoringDashboardComponent implements OnInit, AfterViewInit {

export class GrowthMonitoringDashboardComponent
  implements OnInit, AfterViewInit
{

  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions> = {};

  public timeRangeOptions: TimeRangeOption[] = [
    { id: '7d', label: 'Últimos 7 Días' },
    { id: '30d', label: 'Últimos 30 Días' },
    { id: '90d', label: 'Últimos 90 Días' }
  ];
  public activeTimeRange: TimeRangeOption = this.timeRangeOptions[1];

  public kpiData: GrowthKpi = {
    value: 3.8,
    unit: 'kg',
    trend: 2.5,
    period: 'Últimos 30 Días'
  };

  public keyMetrics: KeyMetric[] = [
    { label: 'Total de Piguas', value: '3' },
    { label: 'Tasa de Crecimiento Actual', value: '3.2%' },
    { label: 'Tasa de Crecimiento vs. Periodo Anterior', value: '2.8% vs. 2.5%' }
  ];


  // Datos hardcodeados para cada rango de tiempo
  private hardcodedData = {
    '7d': {
      series: [2.8, 3.75, 3.72, 3.81, 3.78, 3.8, 3.82],
      categories: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
      kpi: {
        value: 3.8,
        unit: 'kg',
        trend: 0.5,
        period: 'Últimos 7 Días'
      }
    },
    '30d': {
      series: [2.3, 3.5, 3.4, 3.6, 3.9, 3.7, 3.8],
      categories: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7'],
      kpi: {
        value: 3.8,
        unit: 'kg',
        trend: 2.5,
        period: 'Últimos 30 Días'
      }
    },
    '90d': {
      series: [2.9, 3.1, 3.0, 3.2, 3.5, 3.3, 3.6, 3.8],
      categories: ['Mes 1', 'Mes 2', 'Mes 3', 'Mes 4', 'Mes 5', 'Mes 6', 'Mes 7', 'Mes 8'],
      kpi: {
        value: 3.8,
        unit: 'kg',
        trend: 8.1,
        period: 'Últimos 90 Días'
      }
    }
  };

  constructor(private cdr: ChangeDetectorRef) {}

  constructor(
    private crd: ChangeDetectorRef,
    private notificationService: NotificationService
  ) {}


  ngOnInit(): void {
    this.initializeChart();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.updateViewForTimeRange(this.activeTimeRange.id);
    }, 100);
  }

  selectTimeRange(option: TimeRangeOption): void {
    this.activeTimeRange = option;
    this.updateViewForTimeRange(option.id);
  }

  initializeChart(): void {
    this.chartOptions = {
      series: [{ name: 'Peso Promedio', data: [] }],
      chart: {
        type: 'area',
        height: 300,
        toolbar: { show: false },
        zoom: { enabled: false },
        background: 'transparent',
        sparkline: { enabled: false },
      },

      stroke: { 
        curve: 'smooth', 
        width: 2, 
        colors: ['#4CAF50'] 

      stroke: {
        curve: 'smooth',
        width: 9,
        colors: ['#FFFFFF'],

      },
      xaxis: {
        categories: [],
        labels: {

          show: true,
          style: {
            colors: '#666',
            fontSize: '12px'
          }
        },
        axisBorder: {
          show: true,
          color: '#e0e0e0'
        },
        axisTicks: {
          show: true,
          color: '#e0e0e0'
        }

          show: false,
        },

      },
      fill: {
        type: 'gradient',
        colors: ['#4CAF50'],
        gradient: {
          shade: 'light',
          type: 'vertical',
          shadeIntensity: 0.5,
          opacityFrom: 0.7,
          opacityTo: 0.3,
          stops: [0, 90, 100],
        },
      },
      dataLabels: { enabled: false },
      tooltip: {
        enabled: true,
        theme: 'light',
        shared: true,
        fillSeriesColor: false,

        style: {
          fontSize: '14px'
        },
        y: {
          formatter: (val: number) => `${val.toFixed(2)} kg`
        }

      },
    };
  }

  private checkForAnomalies(): void {
    // Si kpiData no está definido, no hacemos nada.
    if (!this.kpiData) {
      return;
    }

    // REGLA DE NEGOCIO: Si la tendencia de crecimiento es negativa, es una anomalía.
    if (this.kpiData.trend < 0) {
      const message = `Alerta de crecimiento: La tendencia en los ${this.kpiData.period.toLowerCase()} es negativa (${
        this.kpiData.trend
      }%).`;

      // Llamamos a nuestro servicio para mostrar el toast.
      this.notificationService.showSensorAnomaly('warning', message);
    }
  }

  updateViewForTimeRange(rangeId: '7d' | '30d' | '90d'): void {

    const data = this.hardcodedData[rangeId];
    
    this.kpiData = data.kpi;
    this.keyMetrics = this.getUpdatedKeyMetrics(rangeId);

    this.chartOptions = {
      ...this.chartOptions,
      series: [{ name: 'Peso Promedio', data: data.series }],
      xaxis: { 
        ...this.chartOptions.xaxis, 
        categories: data.categories
      }

    let seriesData: number[] = [];
    let categories: string[] = [];

    if (rangeId === '30d') {
      this.kpiData = {
        value: 3.8,
        unit: 'kg',
        trend: 2.5,
        period: 'Últimos 30 Días',
      };
      seriesData = [2.3, 3.5, 3.4, 3.6, 3.9, 3.7, 3.8];
      categories = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul'];
    } else if (rangeId === '7d') {
      this.kpiData = {
        value: 3.8,
        unit: 'kg',
        trend: -0.5,
        period: 'Últimos 7 Días',
      }; 
      seriesData = [3.8, 3.75, 3.72, 3.81, 3.78, 3.8, 3.72];
      categories = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    } else {
      // 90d
      this.kpiData = {
        value: 3.8,
        unit: 'kg',
        trend: 8.1,
        period: 'Últimos 90 Días',
      };
      seriesData = [2.9, 3.1, 3.0, 3.2, 3.5, 3.3, 3.6, 3.8];
      categories = ['Oct', 'Nov', 'Dic', 'Ene', 'Feb', 'Mar', 'Abr', 'May'];
    }
    this.chartOptions = {
      ...this.chartOptions,
      series: [{ name: 'Peso Promedio', data: seriesData }],
      xaxis: {
        ...this.chartOptions.xaxis,
        categories: categories,
        labels: {
          show: false,
        },
      },

    };
    if (this.chart) {
      this.chart.updateSeries([{ data: seriesData }]);
      this.chart.updateOptions({ xaxis: { categories: categories } });
    }
    this.checkForAnomalies();

    this.cdr.detectChanges();
  }


  private getUpdatedKeyMetrics(rangeId: string): KeyMetric[] {
    // Datos simulados para las métricas clave según el rango
    const metricsData = {
      '7d': {
        total: '3',
        currentRate: '3.2%',
        comparison: '2.8% vs. 2.5%'
      },
      '30d': {
        total: '3,750',
        currentRate: '3.5%',
        comparison: '3.2% vs. 2.9%'
      },
      '90d': {
        total: '11,250',
        currentRate: '3.8%',
        comparison: '3.5% vs. 3.0%'
      }
    };

    const data = metricsData[rangeId as keyof typeof metricsData] || metricsData['30d'];

    return [
      { label: 'Total de Piguas', value: data.total },
      { label: 'Tasa de Crecimiento Actual', value: data.currentRate },
      { label: 'Tasa de Crecimiento vs. Periodo Anterior', value: data.comparison }
    ];
  }
}


}


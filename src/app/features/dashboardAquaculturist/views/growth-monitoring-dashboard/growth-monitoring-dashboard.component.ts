import {
  AfterViewInit,
  Component,
  ChangeDetectorRef,
  ViewChild,
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

@Component({
  selector: 'app-growth-monitoring-dashboard',
  standalone: false,
  templateUrl: './growth-monitoring-dashboard.component.html',
  styleUrl: './growth-monitoring-dashboard.component.scss',
})
export class GrowthMonitoringDashboardComponent implements AfterViewInit {
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions> = {
    series: [],
    chart: {
      height: 380,
      type: 'area',
    },
  };

  public timeRangeOptions: TimeRangeOption[] = [
    { id: '7d', label: 'Últimos 7 Días' },
    { id: '30d', label: 'Últimos 30 Días' },
    { id: '90d', label: 'Últimos 90 Días' },
  ];
  public activeTimeRange: TimeRangeOption = this.timeRangeOptions[1];

  public kpiData!: GrowthKpi;
  public keyMetrics: KeyMetric[] = [
    { label: 'Total de Piguas', value: '1,250' },
    { label: 'Tasa de Crecimiento Actual', value: '3.2%' },
    {
      label: 'Tasa de Crecimiento vs. Periodo Anterior',
      value: '2.8% vs. 2.5%',
    },
  ];

  constructor(private crd: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.updateViewForTimeRange(this.activeTimeRange.id);
    });
  }

  selectTimeRange(option: TimeRangeOption): void {
    this.activeTimeRange = option;
    this.updateViewForTimeRange(option.id);
  }

  initializeChart(): void {
    this.chartOptions = {
      series: [],
      chart: {
        type: 'area',
        toolbar: { show: false },
        zoom: { enabled: false },
        background: '#F0F0F0',
        sparkline: { enabled: true },
      },
      stroke: { curve: 'smooth', width: 3, colors: ['#FFFFFF'] },
      xaxis: {
        categories: [],
      },
      fill: {
        type: 'gradient',
        colors: ['#FFFFFF'],
        gradient: {
          shade: 'dark',
          type: 'vertical',
          shadeIntensity: 0.5,
          opacityFrom: 0.2,
          opacityTo: 0.05,
          stops: [0, 90, 100],
        },
      },
      dataLabels: { enabled: false },
      tooltip: { theme: 'light' },
    };
  }

  updateViewForTimeRange(rangeId: '7d' | '30d' | '90d'): void {
    let seriesData: any[] = [];
    let categories: string[] = [];

    if (rangeId === '30d') {
      this.kpiData = {
        value: 3.8,
        unit: 'kg',
        trend: 2.5,
        period: 'Últimos 30 Días',
      };
      seriesData = [3.2, 3.5, 3.4, 3.6, 3.9, 3.7, 3.8];
      categories = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul'];
    } else if (rangeId === '7d') {
      this.kpiData = {
        value: 3.8,
        unit: 'kg',
        trend: 0.5,
        period: 'Últimos 7 Días',
      };
      seriesData = [3.7, 3.75, 3.72, 3.81, 3.78, 3.8, 3.82];
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

    if (this.chart) {
      this.chart.updateSeries([{ data: seriesData }]);
      this.chart.updateOptions({ xaxis: { categories: categories } });
    } else {
      this.chartOptions.series = [{ data: seriesData }];
      this.chartOptions.xaxis = { categories: categories };
    }

    this.crd.detectChanges();
  }
}

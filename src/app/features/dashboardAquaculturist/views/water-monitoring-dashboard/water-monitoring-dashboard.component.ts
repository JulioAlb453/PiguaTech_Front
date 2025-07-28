import { Component, OnInit, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';

import {
  ChartComponent,
  ApexChart,
  ApexAxisChartSeries,
  ApexXAxis,
  ApexStroke,
  ApexFill,
  ApexTooltip,
  ApexDataLabels,
  ApexYAxis,
  ApexLegend,
  ApexPlotOptions,
  ApexGrid 

} from 'ng-apexcharts';
import { NotificationService } from '../../../../core/services/notification.service';

export type AreaChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  fill: ApexFill;
  tooltip: ApexTooltip;
  grid: ApexGrid; 
};


export type BarChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  plotOptions: ApexPlotOptions;
  dataLabels: ApexDataLabels;
  tooltip: ApexTooltip;
  grid: ApexGrid;

};

interface VolumeDataPoint {
  x: string;
  y: number;
}

@Component({
  selector: 'app-water-monitoring-dashboard',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './water-monitoring-dashboard.component.html',
  styleUrls: ['./water-monitoring-dashboard.component.scss'],
})
export class WaterMonitoringDashboardComponent implements OnInit, OnDestroy {
  @ViewChild('chart') chart!: ChartComponent;

  public turbidityChartOptions!: Partial<AreaChartOptions>;
  public volumeChartOptions!: Partial<BarChartOptions>;
  public isLoading = true;
  private dataInterval!: any;

  // Umbrales turbidez
  private lowTurbidityWarning = 9.5;
  private lowTurbidityCritical = 8.0;

  public turbidityMetric = {
    title: 'Turbidez',
    value: 12.5,
    unit: 'NTU',
    trend: 1.0,
  };

  public volumeMetric = {
    title: 'Volumen',
    value: 5000,
    unit: 'L',
    trend: -5,
  };

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeCharts();
      this.loadTurbidityData();
      this.startDataSimulation();
    }
  }

  ngOnDestroy(): void {
    if (this.dataInterval) clearInterval(this.dataInterval);
  }

  initializeCharts(): void {
    this.initializeTurbidityChart();
    this.initializeVolumeChart();
  }

  initializeTurbidityChart(): void {
    this.turbidityChartOptions = {
      series: [{
        name: 'Turbidez (Gramos/Litros)',
        data: [100, 105, 110, 120, 115, 118, 122]
      }],
      chart: {
        type: 'line',
        height: 350,
        toolbar: { show: false },
        foreColor: '#ffffff'
      },
      stroke: {
        curve: 'smooth',
        width: 3,
        colors: ['#00E396']
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          shadeIntensity: 0.5,
          opacityFrom: 0.7,
          opacityTo: 0.3,
          stops: [0, 90, 100],
          colorStops: [
            {
              offset: 0,
              color: '#00E396',
              opacity: 0.8
            },
            {
              offset: 100,
              color: '#008FFB',
              opacity: 0.2
            }
          ]
        }
      },
      xaxis: {
        categories: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
        axisBorder: {
          show: true,
          color: '#FFFFFF',
        },
        axisTicks: {
          show: true,
          color: '#FFFFFF',
        },
        labels: {
          style: {
            colors: '#FFFFFF',
            fontSize: '14px',
            fontWeight: 'bold',
            fontFamily: 'Arial, sans-serif'
          }
        }
      },
      yaxis: {
        min: 90,
        max: 130,
        tickAmount: 5,
        axisBorder: {
          show: true,
          color: '#FFFFFF',
          width: 2
        },
        labels: {
          style: {
            colors: ['#FFFFFF'], 
            fontSize: '14px',
            fontWeight: 'bold',
            fontFamily: 'Arial, sans-serif'
          },
          formatter: (val: number) => `${val} g/L`
        }
      },
      grid: {
        borderColor: '#555555',
        strokeDashArray: 3,
        position: 'back',
        yaxis: {
          lines: {
            show: true
          }
        },
        xaxis: {
          lines: {
            show: false
          }
        }
      },
      tooltip: {
        theme: 'dark',
        style: {
          fontSize: '14px'
        },
        y: {
          formatter: (val: number) => `${val} g/L`
        }
      }
    };
  }

  initializeVolumeChart(): void {
    const rawData = [4950, 4980, 5010, 5000, 4990, 4970, 5020];
    const tresholdLow = 4980;

    const lowLevelsSeries = rawData.map(value => (value <= tresholdLow ? value : null));
    const optimalLevelsSeries = rawData.map(value => (value > tresholdLow ? value : null));

    this.volumeChartOptions = {
      series: [
        {
          name: 'Volumen de agua',
          data: seriesData,
        },
      ],
      chart: {
        height: 340,
        type: 'bar',
        toolbar: { show: false },
        background: 'transparent',
      },
      plotOptions: {
        bar: {
          colors: {
            ranges: [
              { from: 0, to: 11, color: '#E74C3C' }, // 🔴 Rojo
              { from: 11.01, to: 12, color: '#F1C40F' }, // 🟡 Amarillo
              { from: 12.01, to: 100, color: '#3498DB' }, // 🔵 Azul
            ],
          },
        },
      },
      dataLabels: { enabled: false },
      xaxis: {
        categories: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
      },
      tooltip: { theme: 'dark' },
    };
  }

  loadTurbidityData(): void {
    this.isLoading = true;

    const dummySeries = [98, 102, 108, 120, 117, 115, 119];
    const dummyCategories = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

    this.turbidityMetric = {
      title: 'Turbidez',
      value: dummySeries[dummySeries.length - 1],
      unit: 'Gramos/Litros',
      trend: 7
    };


    this.turbidityChartOptions = {
      ...this.turbidityChartOptions,
      series: [{
        name: 'Turbidez (Gramos/Litros)',
        data: dummySeries
      }],
      xaxis: {
        ...this.turbidityChartOptions.xaxis,
        categories: dummyCategories
      },
      yaxis: this.turbidityChartOptions.yaxis 
    };

    this.isLoading = false;
  }
}

import { Component, OnInit, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DataWaterTurbidityReposotoryService } from '../../waterMeasurement/WaterTurbidity/infraestructure/data-water-turbidity-reposotory.service';
import { WaterTurbidity } from '../../waterMeasurement/WaterTurbidity/domain/models/water-turbity';
import { CommonModule } from '@angular/common';
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
  ApexPlotOptions
} from 'ng-apexcharts';

export type AreaChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  fill: ApexFill;
  plotOptions: ApexPlotOptions;
  tooltip: ApexTooltip;
};

export type BarChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  plotOptions: ApexPlotOptions;
  dataLabels: ApexDataLabels;
  tooltip: ApexTooltip;
};

@Component({
  selector: 'app-water-monitoring-dashboard',
  standalone: true, 
  imports: [CommonModule, NgApexchartsModule], 
  templateUrl: './water-monitoring-dashboard.component.html',
  styleUrls: ['./water-monitoring-dashboard.component.scss'],
})
export class WaterMonitoringDashboardComponent implements OnInit {
  @ViewChild('chart') chart!: ChartComponent;

  public turbidityChartOptions!: Partial<AreaChartOptions>;
  public volumeChartOptions!: Partial<BarChartOptions>;
  public isLoading = true;

  public turbidityMetric = {
    title: 'Turbidez',
    value: 120,
    unit: 'Gramos/Litros',
    trend: 10,
  };

  public volumeMetric = { 
    title: 'Volumen', 
    value: 5000, 
    unit: 'L', 
    trend: -5 
  };

  constructor(
    private turbidityRepo: DataWaterTurbidityReposotoryService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.inicializarGraficoTurbidez();
      this.initializeVolumeChart();
      this.loadTurbidityData();
    }
  }

  inicializarGraficoTurbidez(): void {
    this.turbidityChartOptions = {
      series: [{
        name: 'Turbidez (Gramos/Litros)',
        data: [100, 105, 110, 120, 115, 118, 122] 
      }],
      chart: {
        type: 'line',
        height: 350,
        toolbar: { show: false }
      },
      stroke: {
        curve: 'smooth',
        width: 2
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.3,
        }
      },
      xaxis: {
        categories: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'] 
      },
      tooltip: {
        theme: 'dark'
      }
    };
  }


  initializeVolumeChart(): void {
    const rawData = [4950, 4980, 5010, 5000, 4990, 4970, 5020];
    const tresholdLow = 4980;

    const lowLevelsSeries = rawData.map(value => (value <= tresholdLow ? value : null));
    const optimalLevelsSeries = rawData.map(value => (value > tresholdLow ? value: null));

    this.volumeChartOptions = {
      series: [
        {
          name: 'Nivel normal del agua',
          data: optimalLevelsSeries,
        },
        {
          name: 'Nivel bajo del agua',
          data: lowLevelsSeries,
        }
      ],
      chart: {
        height: 340,
        type: 'bar',
        toolbar: { show: false },
        zoom: { enabled: false },
        background: 'transparent',
        sparkline: { enabled: true },
      },
      plotOptions: {
        bar: {
          columnWidth: '80%',
          borderRadius: 4,
          colors: {
            ranges: [
              {
                from: 0,
                to: 4980,
                color: '#e74c3c',
              },
              {
                from: 4981,
                to: 5020,
                color: '#3498db',
              },
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

  this.turbidityRepo.getTurbidityTrend().subscribe({
    next: (data: WaterTurbidity) => {
      this.turbidityMetric = {
        title: 'Turbidez',
        value: data.last_value,
        unit: 'Gramos/Litros',
        trend: data.trend
      };

      this.turbidityChartOptions = {
        ...this.turbidityChartOptions,
        series: [{
          name: 'Turbidez (Gramos/Litros)',
          data: data.series && data.series.length > 0 
            ? data.series 
            : [100, 105, 110, 120, 115, 118, 122] // fallback dummy
        }],
        xaxis: {
          ...this.turbidityChartOptions?.xaxis,
          categories: data.categories && data.categories.length > 0 
            ? data.categories 
            : ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'] 
        }
      };

       this.isLoading = false;
    },
    error: () => {
      this.isLoading = false;
    }
  });
}
}

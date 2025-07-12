import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ChartComponent, ApexChart, ApexAxisChartSeries, ApexXAxis, ApexStroke,
  ApexFill, ApexTooltip, ApexDataLabels, ApexYAxis, ApexLegend
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
  standalone: false,
  templateUrl: './water-monitoring-dashboard.component.html',
  styleUrls: ['./water-monitoring-dashboard.component.scss']
})

export class WaterMonitoringDashboardComponent implements OnInit {
  @ViewChild("chart") chart!: ChartComponent;
  


 public turbidityChartOptions!: any;
  public volumeChartOptions!: any;

  public turbidityMetric = { title: 'Turbidez', value: 120, unit: 'NTU', trend: 10 };
  public volumeMetric = { title: 'Volumen', value: 5000, unit: 'L', trend: -5 };

  constructor() { }

  ngOnInit(): void {
    this.initializeTurbidityChart();
    this.initializeVolumeChart();
  }

  initializeTurbidityChart(): void {
    this.turbidityChartOptions = {
      series: [{
        name: 'Turbidez (NTU)',
        data: [110, 115, 120, 118, 122, 130, 125]
      }],
      chart: {
        height: 150,
        type: 'area',
        toolbar: { show: false },
        zoom: { enabled: false },
        background: 'transparent',
        sparkline: { enabled: true }
      },
      stroke: { curve: 'smooth', width: 3, colors: ['#FFFFFF'] },
      fill: {
        type: 'gradient',
        colors: ['#FFFFFF'],
        gradient: {
          shade: 'dark',
          type: "vertical",
          shadeIntensity: 0.5,
          opacityFrom: 0.3,
          opacityTo: 0.05,
          stops: [0, 90, 100]
        }
      },
      xaxis: { categories: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'] },
      tooltip: { theme: 'dark' }
    };
  }

  initializeVolumeChart(): void {
    this.volumeChartOptions = {
      series: [{
        name: 'Volumen (L)',
        data: [4950, 4980, 5010, 5000, 4990, 4970, 5020]
      }],
      chart: {
        height: 150,
        type: 'bar',
        toolbar: { show: false },
        zoom: { enabled: false },
        background: 'transparent',
        sparkline: { enabled: true }
      },
      plotOptions: {
        bar: {
          columnWidth: '60%',
          borderRadius: 4,
          colors: {
            ranges: [{
              from: 0,
              to: 4980,
              color: '#e74c3c' // Color para nivel bajo
            }, {
              from: 4981,
              to: 5020,
              color: '#3498db' // Color para nivel óptimo
            }]
          }
        }
      },
      dataLabels: { enabled: false },
      xaxis: { categories: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'] },
      tooltip: { theme: 'dark' }
    };
  }
}

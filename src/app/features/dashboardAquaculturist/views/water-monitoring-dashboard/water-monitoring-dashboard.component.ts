import { Component, OnInit, ViewChild } from '@angular/core';
import { Legend } from 'chart.js';
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
  styleUrls: ['./water-monitoring-dashboard.component.scss'],
})
export class WaterMonitoringDashboardComponent implements OnInit {
  @ViewChild('chart') chart!: ChartComponent;

  public turbidityChartOptions!: any;
  public volumeChartOptions!: any;

  public turbidityMetric = {
    title: 'Turbidez',
    value: 120,
    unit: 'Gramos/Litros',
    trend: 10,
  };
  public volumeMetric = { title: 'Volumen', value: 5000, unit: 'L', trend: -5 };

  constructor() {}


  ngOnInit(): void {
    this.initializeTurbidityChart();
    this.initializeVolumeChart();
  }

  initializeTurbidityChart(): void {
    this.turbidityChartOptions = {
      series: [
        {
          name: 'Turbidez (Gramos/Litros)',
          data: [110, 115, 120, 118, 122, 130, 125],
        },
      ],
      chart: {
        height: 340,
        type: 'area',
        foreColor: '#f39c12',

        toolbar: { show: false },
        zoom: { enabled: false },
        background: 'transparent',
        sparkline: { enabled: false },
      },
      stroke: { curve: 'smooth', width: 4, colors: ['#f39c12'] },
      fill: {
        type: 'gradient',
        colors: ['#919191ff'],
        gradient: {
          shade: 'dark',
          type: 'vertical',
          shadeIntensity: 0.5,
          opacityFrom: 0.3,
          opacityTo: 0.05,
          stops: [0, 90, 100],
        },
      },
      dataLabels: {
        enabled: true,
        style: {
          fontSize: '30px',
          colors: ['#333'],
        },
        background: {
          enabled: true,
          foreColor: '#333333',
          padding: 2,
          borderRadius: 4,
          borderWidth: 1,
          borderColor: '#f0f0f0',
          opacity: 0.9,
        },
      },
      xaxis: {
        categories: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
        labels: { show: false },
        axisBordeer: { color: '#a0a0a0' },
        axisTicks: { show: false },
      },
      yaxis: {
        title: {
          text: 'Turbidez (Gramos/Litros)',
          style: {
            color: '#f39c12',
            fontSize: '40px',
            fontWeight: 400,
          },
        },
      },

      tooltip: {
        theme: 'dark',
        x: { format: 'ddd' },
      },
      legend: {
        show: true,
        position: 'top',
        horizontalAlign: 'left',
        fontZise: '40px',
        labels: {
          colors: '#a0a0a0',
        },
        markers: {
          width: 10,
          height: 10,
          radius: 12,
        },
        itemMargin: {
          horizontal: 5,
        },
      },
    };
  }

  initializeVolumeChart(): void {
    const rawData = [4950, 4980, 5010, 5000, 4990, 4970, 5020];
    const categories = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
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
          columnWidth: '60%',
          borderRadius: 4,
          colors: {
            ranges: [
              {
                from: 0,
                to: 4980,
                color: '#e74c3c', // Color para nivel bajo
              },
              {
                from: 4981,
                to: 5020,
                color: '#3498db', // Color para nivel óptimo
              },
            ],
          },
        },
      },
      dataLabels: { enabled: false },
      xaxis: { categories: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'] },
      tooltip: { theme: 'dark' },
    };
  }
}

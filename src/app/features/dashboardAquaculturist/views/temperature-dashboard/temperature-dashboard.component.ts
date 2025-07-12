import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ApexAxisChartSeries, ApexChart, ApexXAxis, ApexYAxis, 
  ApexDataLabels, ApexTitleSubtitle, ApexStroke, ApexGrid,
  ApexTheme, ChartComponent, ApexLegend
} from "ng-apexcharts";
import { TimeRange } from '../../temperature/domain/models/time-range.enum';

type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  theme: ApexTheme;
  legend: ApexLegend;
  colors: string[];
  tooltip: any; 
};

@Component({
  selector: 'app-temperature-dashboard',
  standalone: false,
  templateUrl: './temperature-dashboard.component.html',
  styleUrls: ['./temperature-dashboard.component.scss']
})
export class TemperatureDashboardComponent implements OnInit {

  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions!: Partial<ChartOptions>;
  public TimeRange = TimeRange;
  public activeRange: TimeRange = TimeRange.Daily;
  
  constructor() { }

  ngOnInit(): void {
    this.initializeChartOptions();
    this.fetchData(this.activeRange);
  }

  initializeChartOptions(): void {
    this.chartOptions = {
      chart: {
        height: 380,
        type: 'line',
        foreColor: '#e0e0e0',
        toolbar: { show: true, tools: { download: true, selection: false, zoom: false, zoomin: false, zoomout: false, pan: false, reset: false } },
        background: 'transparent'
      },
      colors: ['#3498db', '#2ecc71', '#85c1e9', '#e67e22'],
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth', width: [3, 2, 2, 2], dashArray: [0, 5, 5, 3] },
      grid: { borderColor: '#444', strokeDashArray: 4 },
      xaxis: {
        type: 'category',
        labels: { style: { colors: '#a0a0a0' } },
        axisBorder: { color: '#444' },
        axisTicks: { color: '#444' }
      },
      yaxis: {
        title: {
          text: 'Temperatura del agua (°C)',
          style: { color: '#a0a0a0', fontWeight: 400 }
        },
        labels: { style: { colors: '#a0a0a0' } }
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        floating: true,
        offsetY: -5,
        labels: { useSeriesColors: true },
        markers: {}
      },
      // AÑADIDO: Importante para el estilo del tooltip al pasar el mouse.
      tooltip: {
        theme: 'dark',
        y: {
          formatter: function(val: string){
            return val + " °C";
          }
        }
      }
    };
  }

  setTimeRange(range: TimeRange): void {
    this.activeRange = range;
    this.fetchData(range);
  }

  fetchData(range: TimeRange): void {
    const mockData = this.getMockData(range);
    
    if (this.chart) {
      this.chart.updateSeries(mockData.series, true); // true para animar el cambio
      this.chart.updateOptions({ xaxis: { categories: mockData.categories } });
    } else {
      this.chartOptions.series = mockData.series;
      this.chartOptions.xaxis!.categories = mockData.categories;
    }
  }

  // CORRECCIÓN 3: Actualizamos getMockData para tener datos para Diario y Semanal.
  getMockData(range: TimeRange): { series: ApexAxisChartSeries, categories: string[] } {
    if (range === TimeRange.Daily) {
      return {
        series: [
          { name: 'Temp. Agua Actual', type: 'line', data: [18.5, 19.1, 19.4, 20.2, 21.0, 22.5, 23.1, 22.8, 22.5, 22.6, 22.2] },
          { name: 'Temp. Ideal Máxima', type: 'line', data: [20, 20, 20.5, 20.5, 21, 21, 21.5, 21.5, 22, 22, 22] },
          { name: 'Temp. Ideal Mínima', type: 'line', data: [17, 17, 17, 17.5, 17.5, 18, 18, 18.5, 18.5, 18.5, 18] },
          { name: 'Temp. Crítica', type: 'line', data: [25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25] }
        ],
        categories: ['8:00', '8:30', '9:00', '9:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00']
      };
    }
    
    if (range === TimeRange.Weekly) {
      return {
        series: [
          { name: 'Temp. Agua Prom.', data: [18, 19, 21, 20, 22, 19, 18.5] },
          { name: 'Temp. Ideal Prom.', data: [20, 20, 20, 20, 20, 20, 20] },
          { name: 'Temp. Crítica Prom.', data: [25, 25, 25, 25, 25, 25, 25] }
        ],
        categories: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
      };
    }

    // Para Mensual, puedes agregar otra condición aquí.
    return { series: [], categories: [] };
  }
}
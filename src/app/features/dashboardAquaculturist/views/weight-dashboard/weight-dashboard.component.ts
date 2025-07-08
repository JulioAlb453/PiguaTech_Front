import { Component, viewChild, OnInit, ViewChild } from '@angular/core';
import {
  ApexChart,
  ApexAxisChartSeries,
  ApexXAxis,
  ApexPlotOptions,
  ApexDataLabels,
  ApexTitleSubtitle,
  ChartComponent,
} from 'ng-apexcharts';

export type ChartOption = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  plotOptions: ApexPlotOptions;
  dataLabels: ApexDataLabels;
  title: ApexTitleSubtitle;
  theme: ApexTheme;
  colors: string[];
}

interface GrowthMetric {
  label: string;
  value: string;
}

@Component({
  selector: 'app-weight-dashboard',
  standalone: false,
  templateUrl: './weight-dashboard.component.html',
  styleUrl: './weight-dashboard.component.scss',
})
export class WeightDashboardComponent implements OnInit {
  @ViewChild("chart") chart!: ChartComponent;
  
  public chartOptions!: Partial<ChartOption>

  public isMeasuring = false
  private measuringInterval: any;
  public currentWeight = 0;

  public keyMetrics: GrowthMetric[] = [
    { label: 'Total de Piguas', value: '1,250' },
    { label: 'Tasa de Crecimiento Actual', value: '3.2%' },
    { label: 'Tasa de Crecimiento vs. Periodo Anterior', value: '2.8% vs. 2.5%' }
  ];  
  
  constructor(){}

  ngOnInit(): void {
      this.initializeChart()
  }

    toggleMeasurement(): void {
    this.isMeasuring = !this.isMeasuring;

    if(this.isMeasuring){
      this.measuringInterval = setInterval(() =>{
        const randomWeight = Math.floor(Math.random() * (300 - 250 + 1)) + 250;
        this.currentWeight = randomWeight;
        this.updateChartData(randomWeight);
      }, 2000)
    } else{
      clearInterval(this.measuringInterval);
    }
  }
  initializeChart(): void{
    this.chartOptions = {
      series: [{
        name: 'Peso de la Pigua (g)',
        data: [] 
      }],
      chart: {
        type: 'bar',
        height: 350,
        toolbar: { show: false },
        background: 'transparent',
        foreColor: '#e0e0e0'
      },
      colors: ['#3498db'], 
      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: 4,
          columnWidth: '45%',
        }
      },
      dataLabels: {
        enabled: true,
        style: {
          fontSize: '12px',
          colors: ["#fff"]
        },
        offsetY: -20 // Posiciona la etiqueta dentro de la barra
      },
      xaxis: {
        categories: ['Medición 1', 'Medición 2', 'Medición 3', 'Medición 4', 'Medición 5'],
        labels: {
          style: { colors: '#a0a0a0' }
        },
        axisBorder: { show: false },
        axisTicks: { show: false }
      },
      yaxis: {
        labels: {
          show: true,
          style: { colors: '#a0a0a0' }
        }
      },
      title: {
        text: 'Últimas 5 Mediciones',
        align: 'left',
        style: {
          fontSize: '16px',
          color: '#e0e0e0'
        }
      },
      theme: {
        mode: 'dark'
      }
    };
  }

  updateChartData(newWeight: number): void {
    if(!this.chartOptions || !this.chartOptions.series || !this.chartOptions.series[0]){
      console.error("grafico no inializado")
    }

    let currentData = this.chartOptions.series![0].data as  number[] || [];
    let currentCategories = this.chartOptions.xaxis!.categories! as string[] || []; 

      currentData.push(newWeight);
      currentCategories.push(new Date().toLocaleDateString());
      if (currentData.length > 5) {
        currentData.shift(); 
        currentCategories.shift(); 
      }

      this.chart.updateSeries([{data:currentData}])
      this.chart.updateOptions([{xaxis: { categories: currentCategories }}]);
  }

  ngDestroy() {
    if (this.measuringInterval) {
      clearInterval(this.measuringInterval);
    }
  }
  
}


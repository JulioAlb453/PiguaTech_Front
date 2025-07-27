import {
  Component,
  OnInit,
  ViewChild,
  Inject,
  PLATFORM_ID,
  OnDestroy,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DataWaterTurbidityReposotoryService } from '../../waterMeasurement/WaterTurbidity/infraestructure/data-water-turbidity-reposotory.service';
import { WaterTurbidity } from '../../waterMeasurement/WaterTurbidity/domain/models/water-turbity';
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
  ApexPlotOptions,
  ApexMarkers,
} from 'ng-apexcharts';
import { NotificationService } from '../../../../core/services/notification.service';

export type AreaChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  fill: ApexFill;
  tooltip: ApexTooltip;
  markers: ApexMarkers;
  colors: string[];
  yaxis: ApexYAxis;
};

export type BarChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  plotOptions: ApexPlotOptions;
  dataLabels: ApexDataLabels;
  tooltip: ApexTooltip;
  colors: string[];
  yaxis: ApexYAxis;
};

interface VolumeDataPoint {
  x: string;
  y: number;
}

@Component({
  selector: 'app-water-monitoring-dashboard',
  standalone: false,
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
  public volumeMetric = { title: 'Volumen', value: 15, unit: 'L', trend: -0.5 };

  // Datos iniciales
  private initialTurbidityData = [10.0, 10.5, 11.0, 12.0, 11.5, 11.8, 12.5];
  private initialVolumeData = [15, 14, 13, 12, 11, 10];

  constructor(
    private turbidityRepo: DataWaterTurbidityReposotoryService,
    private notificationService: NotificationService,
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
      series: [{ name: 'Turbidez (NTU)', data: this.initialTurbidityData }],
      chart: {
        type: 'line',
        height: 350,
        toolbar: { show: false },
        background: 'transparent',
      },
      colors: ['#FFFFFF'],
      stroke: { curve: 'smooth', width: 3, colors: ['#FFFFFF'] },
      fill: { type: 'solid', colors: ['#FFFFFF'] },
      markers: {
        size: 5,
        colors: ['#FFFFFF'],
        strokeColors: '#FFFFFF',
        strokeWidth: 2,
      },
      xaxis: {
        categories: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
        labels: { style: { colors: '#FFFFFF', fontSize: '12px' } },
      },
      yaxis: {
        min: 9,
        max: 13,
        tickAmount: 4,
        labels: {
          style: { colors: '#FFFFFF' },
          formatter: (val) => `${val.toFixed(1)} NTU`,
        },
      },
      tooltip: {
        theme: 'dark',
        y: { formatter: (val) => `${val.toFixed(2)} NTU` },
      },
    };
  }

  initializeVolumeChart(): void {
    const seriesData = this.initialVolumeData.map((value, index) => ({
      x: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'][index],
      y: value,
    }));

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

      dataLabels: {
        enabled: true,
        formatter: (val) => `${val} L`,
        style: {
          colors: ['#fff'],
          fontSize: '12px',
        },
      },
      xaxis: {
        categories: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
        labels: {
          style: {
            colors: '#000000ff',
          },
        },
      },
      yaxis: {
        min: 10,
        max: 16,
        tickAmount: 4,
        labels: {
          style: {
            colors: '#ffffff',
          },
          formatter: (val) => `${val} L`,
        },
      },
      tooltip: {
        theme: 'dark',
        y: {
          formatter: (val) => `${val} Litros`,
        },
      },
      colors: this.getVolumeColors(this.initialVolumeData), // ✅ Colores dinámicos
    };
  }

  startDataSimulation(): void {
    this.dataInterval = setInterval(() => this.simulateNewData(), 5000);
  }
  private getVolumeColors(values: number[]): string[] {
    return values.map((val) => {
      if (val <= 11) return '#E74C3C'; // 🔴 Crítico
      if (val <= 12) return '#F1C40F'; // 🟡 Advertencia
      return '#3498DB'; // 🔵 Normal
    });
  }

  simulateNewData(): void {
    const currentTurbidityData =
      (this.turbidityChartOptions.series?.[0].data as number[]) ||
      this.initialTurbidityData;
    const currentVolumeData =
      (this.volumeChartOptions.series?.[0].data as VolumeDataPoint[]) ||
      this.initialVolumeData.map((val, idx) => ({
        x: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'][idx],
        y: val,
      }));

    // Turbidez
    const newTurbidityData = currentTurbidityData.map((val) =>
      Math.max(
        9.5,
        Math.min(
          13.5,
          parseFloat((val + (Math.random() * 0.4 - 0.2)).toFixed(2))
        )
      )
    );

    // Volumen entre 10 y 15 L
    const newVolumeData = currentVolumeData.map((item) => {
      const newValue = Math.max(
        10,
        Math.min(
          15,
          parseFloat((item.y + (Math.random() * 0.6 - 0.3)).toFixed(2))
        )
      );
      return { ...item, y: newValue };
    });

    // Actualiza gráficos y métricas
    this.updateTurbidityChart(newTurbidityData);
    this.updateVolumeChart(newVolumeData);
    this.updateMetrics(
      newTurbidityData,
      newVolumeData.map((i) => i.y)
    );

    // ALERTAS Turbidez
    const lastTurbidity = newTurbidityData[newTurbidityData.length - 1];
    if (lastTurbidity < this.lowTurbidityCritical) {
      this.notificationService.showSensorAnomaly(
        'error',
        `❗ Turbidez crítica: ${lastTurbidity} NTU`
      );
    } else if (lastTurbidity < this.lowTurbidityWarning) {
      this.notificationService.showSensorAnomaly(
        'warning',
        `⚠️ Turbidez baja: ${lastTurbidity} NTU`
      );
    }

    // ALERTAS Volumen
    const lastVolume = newVolumeData[newVolumeData.length - 1].y;
    if (lastVolume <= 11) {
      this.notificationService.showSensorAnomaly(
        'error',
        `❗ Nivel crítico: ${lastVolume} L`
      );
    } else if (lastVolume <= 12) {
      this.notificationService.showSensorAnomaly(
        'warning',
        `⚠️ Nivel bajo: ${lastVolume} L`
      );
    }
  }

  updateTurbidityChart(data: number[]): void {
    this.turbidityChartOptions = {
      ...this.turbidityChartOptions,
      series: [{ name: 'Turbidez', data }],
    };
  }

  updateVolumeChart(data: VolumeDataPoint[]): void {
    this.volumeChartOptions = {
      ...this.volumeChartOptions,
      series: [
        {
          name: 'Volumen de agua',
          data: data,
        },
      ],
      colors: this.getVolumeColors(data.map((item) => item.y)), // ✅ Colores actualizados
    };
  }

  updateMetrics(turbidityData: number[], volumeData: number[]): void {
    const lastTurbidity = turbidityData[turbidityData.length - 1];
    const lastVolume = volumeData[volumeData.length - 1];

    this.turbidityMetric.value = parseFloat(lastTurbidity.toFixed(2));
    this.volumeMetric.value = parseFloat(lastVolume.toFixed(2));

    this.turbidityMetric.trend = parseFloat(
      (((lastTurbidity - turbidityData[0]) / turbidityData[0]) * 100).toFixed(1)
    );
    this.volumeMetric.trend = parseFloat(
      (((lastVolume - volumeData[0]) / volumeData[0]) * 100).toFixed(1)
    );
  }

  loadTurbidityData(): void {
    this.isLoading = true;
    this.turbidityRepo.getTurbidityTrend().subscribe({
      next: (data: WaterTurbidity) => {
        if (data.series) {
          const convertedSeries = data.series.map((val) =>
            parseFloat((val / 1000).toFixed(2))
          );
          this.updateTurbidityChart(convertedSeries);
        }
        this.turbidityMetric = {
          title: 'Turbidez',
          value: data.last_value
            ? parseFloat((data.last_value / 1000).toFixed(2))
            : 12.5,
          unit: 'NTU',
          trend: data.trend || 1.0,
        };
        this.isLoading = false;
      },
      error: () => (this.isLoading = false),
    });
  }
}

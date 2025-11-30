import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  Inject,
  PLATFORM_ID,
  NgZone,
  ChangeDetectorRef,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { Observable, Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NotificationService } from '../../../../core/services/notification.service';
import { AlertsService, Alert } from '../../../../core/services/alerts/alerts.service';
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
  ApexGrid,
} from 'ng-apexcharts';

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

export type StateBarChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  plotOptions: ApexPlotOptions;
  dataLabels: ApexDataLabels;
  tooltip: ApexTooltip;
  grid: ApexGrid;
  legend: ApexLegend;
};

@Component({
  selector: 'app-water-monitoring-dashboard',
  standalone: false,
  templateUrl: './water-monitoring-dashboard.component.html',
  styleUrls: ['./water-monitoring-dashboard.component.scss'],
})
export class WaterMonitoringDashboardComponent implements OnInit, OnDestroy {
  @ViewChild('turbidityChart') turbidityChart!: ChartComponent;
  @ViewChild('levelChart') levelChart!: ChartComponent;

  public turbidityChartOptions!: Partial<AreaChartOptions>;
  public levelBarChartOptions!: Partial<StateBarChartOptions>;

  public showAlertModal = false;
  public modalAlerts$: Observable<Alert[]>;

  public turbidityAlert = { high: 125, low: 95, enabled: true };
  public volumeAlert = { enabled: true };

  public tempTurbidityHigh = this.turbidityAlert.high;
  public tempTurbidityLow = this.turbidityAlert.low;

  private isTurbidityHighAlertActive = false;
  private isTurbidityLowAlertActive = false;
  private isVolumeLowAlertActive = false;
  private waterLevelWasLow = false;

  public isLoading = true;
  public turbidityMetric = {
    title: 'Turbidez',
    value: 0,
    unit: 'Gramos/Litros',
    trend: 0,
  };
  public volumeMetric = {
    title: 'Nivel del Agua',
    isLow: false,
    statusText: 'Cargando...',
  };

  private simulationSubscription!: Subscription;
  private alertsSubscription!: Subscription;
  private readonly UPDATE_INTERVAL = 3000;
  private readonly MAX_DATA_POINTS = 3;
  private destroy$ = new Subject<void>();

  private realtimeCategories: string[] = [];
  private realtimeTurbidityData: number[] = [];
  private realtimeLevelData: number[] = [];

  showNotificationModal = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private notificationService: NotificationService,
    private alertsService: AlertsService,
    public router: Router,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {
    this.modalAlerts$ = this.alertsService.getRecentAlerts(5);
  }

  ngOnInit(): void {
    this.subscribeToAlerts();
    this.modalAlerts$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.cdr.detectChanges();
    });

    if (isPlatformBrowser(this.platformId)) {
      this.initializeTurbidityChart();
      this.initializeLevelBarChart();
      this.startRealtimeSimulation();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.simulationSubscription) {
      this.simulationSubscription.unsubscribe();
    }
    if (this.alertsSubscription) {
      this.alertsSubscription.unsubscribe();
    }
  }

  private subscribeToAlerts(): void {
    this.alertsSubscription = this.alertsService.alerts$.subscribe(alerts => {
      this.cdr.detectChanges();
    });
  }


  markAllAsRead(): void {
    // Este método se implementará cuando el servicio tenga la funcionalidad
    console.log('Marcar todas como leídas - funcionalidad pendiente');
  }


  startRealtimeSimulation(): void {
    let time = 0;
    let iterationCount = 0;

    const intervalId = setInterval(() => {
      this.ngZone.run(() => {
        const baseTurbidity = 110 + Math.sin(time) * 15;
        const turbidityNoise = Math.random() * 4 - 2;
        const newTurbidityValue = parseFloat(
          (baseTurbidity + turbidityNoise).toFixed(1)
        );

        let newLevelIsNormal: boolean;
        if (iterationCount < 3) {
          newLevelIsNormal = true;
        } else {
          newLevelIsNormal = Math.random() > 0.3;
        }

        if (!newLevelIsNormal) {
          this.waterLevelWasLow = true;
        }

        const newTimeLabel = new Date().toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });

        this.appendRealtimeData(
          newTurbidityValue,
          newLevelIsNormal,
          newTimeLabel
        );
        time += 0.2;
        iterationCount++;
      });
    }, this.UPDATE_INTERVAL);

    this.simulationSubscription = new Subscription(() =>
      clearInterval(intervalId)
    );
  }

  appendRealtimeData(
    turbidityValue: number,
    levelIsNormal: boolean,
    timeLabel: string
  ): void {
    this.realtimeCategories.push(timeLabel);
    this.realtimeTurbidityData.push(turbidityValue);
    this.realtimeLevelData.push(levelIsNormal ? 1 : 0);

    if (this.realtimeCategories.length > this.MAX_DATA_POINTS) {
      this.realtimeCategories.shift();
      this.realtimeTurbidityData.shift();
      this.realtimeLevelData.shift();
    }

    let displayLevelData = [...this.realtimeLevelData];

    if (this.waterLevelWasLow) {
      if (!displayLevelData.includes(0)) {
        this.waterLevelWasLow = false;
      }
    }

    this.turbidityMetric.value = turbidityValue;
    this.volumeMetric.isLow = !levelIsNormal;
    this.volumeMetric.statusText = levelIsNormal ? 'Normal' : 'Bajo';

    this.checkForAlerts();

    if (this.turbidityChart && this.levelChart) {
      this.turbidityChart.updateOptions({
        series: [
          {
            name: 'Turbidez (Gramos/Litros)',
            data: this.realtimeTurbidityData,
          },
        ],
        xaxis: { categories: this.realtimeCategories },
      });

      this.levelChart.updateOptions({
        series: [{ name: 'Estado del Nivel', data: displayLevelData }],
        xaxis: { categories: this.realtimeCategories },
      });
    }
  }

  initializeTurbidityChart(): void {
    if (!this.turbidityChartOptions) {
      this.turbidityChartOptions = {};
    }
    this.turbidityChartOptions = {
      ...this.turbidityChartOptions,
      series: [{ name: 'Turbidez (Gramos/Litros)', data: [] }],
      chart: { type: 'line', height: 350, toolbar: { show: false } },
      stroke: { curve: 'smooth', width: 3, colors: ['#00E396'] },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          shadeIntensity: 0.5,
          opacityFrom: 0.7,
          opacityTo: 0.3,
          stops: [0, 90, 100],
          colorStops: [
            { offset: 0, color: '#00E396', opacity: 0.8 },
            { offset: 100, color: '#008FFB', opacity: 0.2 },
          ],
        },
      },
      xaxis: {
        categories: [],
        axisBorder: { show: true, color: '#FFFFFF' },
        axisTicks: { show: true, color: '#FFFFFF' },
        labels: {
          style: {
            colors: '#FFFFFF',
            fontSize: '14px',
            fontWeight: 'bold',
            fontFamily: 'Arial, sans-serif',
          },
        },
      },
      yaxis: {
        min: 90,
        max: 130,
        tickAmount: 5,
        axisBorder: { show: true, color: '#FFFFFF', width: 2 },
        labels: {
          style: {
            colors: ['#FFFFFF'],
            fontSize: '14px',
            fontWeight: 'bold',
            fontFamily: 'Arial, sans-serif',
          },
          formatter: (val: number) => `${val} g/L`,
        },
      },
      grid: {
        borderColor: '#555555',
        strokeDashArray: 3,
        position: 'back',
        yaxis: { lines: { show: true } },
        xaxis: { lines: { show: false } },
      },
      tooltip: {
        theme: 'dark',
        style: { fontSize: '14px' },
        y: { formatter: (val: number) => `${val} g/L` },
      },
    };
  }

  initializeLevelBarChart(): void {
    this.levelBarChartOptions = {
      series: [{ name: 'Estado del Nivel', data: [] }],
      chart: { type: 'bar', height: 350, toolbar: { show: false } },
      plotOptions: {
        bar: {
          borderRadius: 4,
          colors: {
            ranges: [
              { from: 0, to: 0, color: '#ef4444' },
              { from: 1, to: 1, color: '#3498db' },
            ],
          },
          columnWidth: '80%',
        },
      },
      dataLabels: {
        enabled: true,
        formatter: (val: number) => (val === 1 ? 'NORMAL' : 'BAJO'),
        style: { colors: ['#fff'], fontSize: '12px', fontWeight: 'bold' },
      },
      xaxis: {
        categories: [],
        labels: { show: true, style: { colors: '#94a3b8' } },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: { show: false },
      tooltip: { enabled: false },
      grid: { show: false },
      legend: { show: false },
    };
  }

  saveAlertSettings(): void {
    if (!this.validateLimits()) return;

    this.turbidityAlert.high = this.tempTurbidityHigh;
    this.turbidityAlert.low = this.tempTurbidityLow;

    this.showAlertModal = false;
    this.notificationService.showSuccess(
      'Configuración guardada',
      'Los valores de alerta se han actualizado.'
    );
    this.checkForAlerts();
  }

  validateLimits(): boolean {
    if (this.tempTurbidityHigh <= this.tempTurbidityLow) {
      this.notificationService.showError(
        'Valores inválidos',
        'El límite alto debe ser mayor que el límite bajo'
      );
      return false;
    }
    return true;
  }

  checkForAlerts(): void {
    if (this.turbidityAlert.enabled) {
      if (this.turbidityMetric.value > this.turbidityAlert.high) {
        if (!this.isTurbidityHighAlertActive) {
          this.isTurbidityHighAlertActive = true;
          this.isTurbidityLowAlertActive = false;
          const message = `Turbidez alta: ${this.turbidityMetric.value} g/L (Límite: ${this.turbidityAlert.high} g/L)`;
          this.notificationService.showSensorAnomaly(
            'warning',
            `⚠️ ${message}`
          );
          this.alertsService.addAlert({
            type: 'warning',
            title: 'Alta Turbidez',
            priority: 'Media',
            description: message,
            timestamp: new Date(),
          });
        }
      } else if (this.turbidityMetric.value < this.turbidityAlert.low) {
        if (!this.isTurbidityLowAlertActive) {
          this.isTurbidityLowAlertActive = true;
          this.isTurbidityHighAlertActive = false;
          const message = `Turbidez baja: ${this.turbidityMetric.value} g/L (Límite: ${this.turbidityAlert.low} g/L)`;
          this.notificationService.showSensorAnomaly(
            'warning',
            `⚠️ ${message}`
          );
          this.alertsService.addAlert({
            type: 'warning',
            title: 'Baja Turbidez',
            priority: 'Baja',
            description: message,
            timestamp: new Date(),
          });
        }
      } else {
        this.isTurbidityHighAlertActive = false;
        this.isTurbidityLowAlertActive = false;
      }
    }

    if (this.volumeAlert.enabled && this.volumeMetric.isLow) {
      if (!this.isVolumeLowAlertActive) {
        this.isVolumeLowAlertActive = true;
        const message = `El nivel del agua es bajo. Se requiere atención.`;
        this.notificationService.showSensorAnomaly('error', `💧 ${message}`);
        this.alertsService.addAlert({
          type: 'error',
          title: 'Bajo Nivel de Agua',
          priority: 'Alta',
          description: message,
          timestamp: new Date(),
        });
      }
    } else {
      this.isVolumeLowAlertActive = false;
    }
  }
}
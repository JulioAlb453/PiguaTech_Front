import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  NgZone,
  PLATFORM_ID,
  Inject,
} from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexStroke,
  ApexGrid,
  ApexDataLabels,
  ApexLegend,
  ApexTooltip,
  ChartComponent,
} from 'ng-apexcharts';

import { TimeRange } from '../../temperature/domain/input/i-monitoring.service';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { NotificationService } from '../../../../core/services/notification.service';
import {
  AlertsService,
  Alert,
} from '../../../../core/services/alerts/alerts.service';
import { isPlatformBrowser } from '@angular/common';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  grid: ApexGrid;
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  colors: string[];
  tooltip: ApexTooltip;
};

@Component({
  selector: 'app-temperature-dashboard',
  standalone: false,
  templateUrl: './temperature-dashboard.component.html',
  styleUrls: ['./temperature-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class TemperatureDashboardComponent implements OnInit, OnDestroy {
  public TimeRange = TimeRange;

  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions: ChartOptions | null = null;

  private dataSubscription!: Subscription;
  private readonly MAX_DATA_POINTS = 20;
  private readonly UPDATE_INTERVAL = 3000;
  public currentTemperature: number = 26;

  hasNewNotifications = false;
  showNotificationModal = false; 
  private alertsSubscription!: Subscription;

  alertConfig = {
    warningLow: 18,
    warningHigh: 28,
    criticalLow: 15,
    criticalHigh: 32
  };

  public averageHigh: number = 32;
  public averageLow: number = 24;
  public currentDisplayValue: number = 26;

  public showAlertModal: boolean = false;
  public tempAlertHigh: number = 32;
  public tempAlertLow: number = 24.9;
  public alertsEnabled: boolean = false;
  public modalAlerts$!: Observable<Alert[]>;

  private destroy$ = new Subject<void>();

  private isHighAlertActive: boolean = false;
  private isLowAlertActive: boolean = false;

  public currentData: { temperature: number; date: string }[] = [];
  public selectedRange: TimeRange = TimeRange.Daily;
  public isBrowser: boolean;

  constructor(
    private router: Router,
    private ngZone: NgZone,
    private notificationService: NotificationService,
    private alertsService: AlertsService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.subscribeToAlerts();
    this.modalAlerts$ = this.alertsService.getRecentAlerts(5);
    this.modalAlerts$.pipe(takeUntil(this.destroy$)).subscribe((alerts) => {
      this.cdr.detectChanges();
    });

    if (isPlatformBrowser(this.platformId)) {
      this.initializeChartWithDefaults();
      this.selectedRange = TimeRange.Daily;
      this.loadHardcodedData(this.selectedRange);
      this.simulateRealtimeData();
    } else {
      this.selectedRange = TimeRange.Daily;
      this.loadBasicData();
    }
  }

  private subscribeToAlerts(): void {
    this.alertsSubscription = this.alertsService.alerts$.subscribe(alerts => {
      this.hasNewNotifications = alerts.length > 0;
      this.cdr.detectChanges();
    });
  }

  private loadBasicData(): void {
    const data = this.getBasicData();
    this.currentData = data;
    this.currentDisplayValue = data[data.length - 1].temperature;
    this.currentTemperature = this.currentDisplayValue;
  }

  private getBasicData(): { temperature: number; date: string }[] {
    return [
      { temperature: 26, date: '00:00' },
      { temperature: 25, date: '01:00' },
      { temperature: 26, date: '02:00' },
    ];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.alertsSubscription) {
      this.alertsSubscription.unsubscribe();
    }
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  get displayValue(): number {
    return this.currentDisplayValue;
  }

  getTemperatureStatusText(): string {
    if (this.currentTemperature > this.alertConfig.criticalHigh) {
      return 'Crítico - Muy Alto';
    } else if (this.currentTemperature > this.alertConfig.warningHigh) {
      return 'Advertencia - Alto';
    } else if (this.currentTemperature < this.alertConfig.criticalLow) {
      return 'Crítico - Muy Bajo';
    } else if (this.currentTemperature < this.alertConfig.warningLow) {
      return 'Advertencia - Bajo';
    } else {
      return 'Normal';
    }
  }

  public onBellClick(): void {
    this.hasNewNotifications = false; 
    this.showNotificationModal = true;
    this.cdr.detectChanges(); 
  }

  public openAlertModal(): void {
    this.tempAlertHigh = this.averageHigh;
    this.tempAlertLow = this.averageLow;
    this.showAlertModal = true;
  }

  public closeAlertModal(): void {
    this.showAlertModal = false;
  }

  public toggleAlerts(): void {
    this.alertsEnabled = !this.alertsEnabled;

    if (this.alertsEnabled) {
      this.notificationService.showSuccess(
        'Alertas Activadas',
        'El sistema monitoreará las temperaturas según los límites configurados'
      );
    } else {
      this.notificationService.showSuccess(
        'Alertas Desactivadas',
        'El monitoreo de alertas ha sido deshabilitado'
      );
    }
  }

  public saveAlertSettings(): void {
    if (this.tempAlertHigh <= this.tempAlertLow) {
      this.notificationService.showError(
        'Error de Configuración',
        'El límite máximo debe ser mayor que el límite mínimo'
      );
      return;
    }

    this.averageHigh = this.tempAlertHigh;
    this.averageLow = this.tempAlertLow;
    this.alertsEnabled = true;

    this.updateChartLimits();

    this.notificationService.showSuccess(
      'Alertas Configuradas',
      `Rango establecido: ${this.averageLow}°C - ${this.averageHigh}°C`
    );

    this.closeAlertModal();
  }

  public checkTemperatureAlert(temperature: number): void {
    if (!this.alertsEnabled) {
      return;
    }

    if (temperature >= this.averageHigh) {
      if (!this.isHighAlertActive) {
        this.isHighAlertActive = true;
        this.isLowAlertActive = false;
        this.hasNewNotifications = true;

        const alertTitle = 'Temperatura del Agua Alta';
        const alertDescription = `La temperatura ha alcanzado ${temperature.toFixed(
          1
        )}°C, superando el límite de ${this.averageHigh}°C.`;

        this.notificationService.showSensorAnomaly('error', `${alertTitle}`);
        this.alertsService.addAlert({
          type: 'error',
          title: alertTitle,
          priority: 'Media',
          description: alertDescription,
          timestamp: new Date(),
        });
      }
    }
    else if (temperature <= this.averageLow) {
      if (!this.isLowAlertActive) {
        this.isLowAlertActive = true;
        this.isHighAlertActive = false;
        this.hasNewNotifications = true;

        const alertTitle = 'Temperatura del Agua Baja';
        const alertDescription = `La temperatura ha bajado a ${temperature.toFixed(
          1
        )}°C, por debajo del límite de ${this.averageLow}°C.`;

        this.notificationService.showSensorAnomaly(
          'warning',
          ` ${alertTitle}`
        );
        this.alertsService.addAlert({
          type: 'warning',
          title: alertTitle,
          priority: 'Baja',
          description: alertDescription,
          timestamp: new Date(),
        });
      }
    }
    else {
      if (this.isHighAlertActive || this.isLowAlertActive) {
        this.notificationService.showSuccess(
          'Temperatura Normalizada',
          'El valor ha vuelto al rango seguro.'
        );
      }
      this.isHighAlertActive = false;
      this.isLowAlertActive = false;
    }
  }

  private updateChartLimits(): void {
    if (this.chartOptions && this.chartOptions.series) {
      const actualSeriesLength = this.chartOptions.series[1].data.length;

      this.chartOptions.series[0].data = Array(actualSeriesLength).fill(
        this.averageHigh
      );
      this.chartOptions.series[2].data = Array(actualSeriesLength).fill(
        this.averageLow
      );

      if (this.chart) {
        this.chart.updateOptions({
          series: this.chartOptions.series,
        });
      }
    }
  }

  onRangeChange(range: TimeRange): void {
    this.selectedRange = range;
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
    this.loadHardcodedData(range);
    if (range === TimeRange.Daily) {
      this.simulateRealtimeData();
    }
  }

  private initializeChartWithDefaults(): void {
    this.chartOptions = {
      series: [
        { name: 'Límite Máximo', data: [this.averageHigh] },
        { name: 'Temperatura Actual', data: [] },
        { name: 'Límite Mínimo', data: [this.averageLow] },
      ],
      chart: {
        height: 320,
        type: 'line',
        background: '#1a1a1a',
        foreColor: '#ffffff',
        toolbar: { show: false },
        zoom: { enabled: false },
      },
      colors: ['#FF4560', '#00E396', '#775DD0'],
      stroke: {
        curve: 'smooth',
        width: [2.5, 4, 2.5],
        dashArray: [5, 0, 5],
      },
      dataLabels: { enabled: false },
      grid: {
        borderColor: '#333333',
        strokeDashArray: 3,
        yaxis: { lines: { show: true } },
        xaxis: { lines: { show: false } },
      },
      xaxis: {
        categories: [],
        labels: {
          style: { colors: '#ffffff', fontSize: '14px' },
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        labels: {
          style: { colors: '#ffffff', fontSize: '14px' },
          formatter: (val) => `${val.toFixed(1)}°C`,
        },
      },
      legend: {
        show: true,
        position: 'top',
        horizontalAlign: 'right',
        fontSize: '14px',
        labels: { colors: '#ffffff' },
        markers: { strokeWidth: 4 },
      },
      tooltip: {
        enabled: true,
        shared: true,
        theme: 'dark',
        style: { fontSize: '14px' },
      },
    };
  }

  public goToAlertsHistory(): void {
    this.showNotificationModal = false; 
    this.router.navigate(['acuicultor/alertsDashboard']);
  }

  private loadHardcodedData(range: TimeRange): void {
    let data: { temperature: number; date: string }[] = [];
    let categories: string[] = [];

    switch (range) {
      case TimeRange.Daily:
        for (let i = 0; i < 24; i++) {
          const hour = i < 10 ? `0${i}:00` : `${i}:00`;
          const baseTemp = 24 + Math.sin(i / 6) * 4;
          const temp = baseTemp + (Math.random() * 1 - 0.5); 
          data.push({
            temperature: parseFloat(temp.toFixed(1)),
            date: hour,
          });
          categories.push(hour);
        }
        break;

      case TimeRange.Weekly:
        const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
        const weeklyBase = 24 + Math.random() * 2;

        days.forEach((day) => {
          const temp = weeklyBase + (Math.random() * 2 - 1);
          data.push({
            temperature: parseFloat(temp.toFixed(1)),
            date: day,
          });
          categories.push(day);
        });
        break;

      case TimeRange.Monthly:
        const monthlyBase = 24 + (Math.random() * 3 - 1.5);

        for (let i = 1; i <= 4; i++) {
          const temp = monthlyBase + (Math.random() * 1 - 0.5);
          data.push({
            temperature: parseFloat(temp.toFixed(1)),
            date: `Sem ${i}`,
          });
          categories.push(`Sem ${i}`);
        }
        break;
    }

    if (isPlatformBrowser(this.platformId)) {
      this.updateChartData(data, categories);
    }

    this.currentData = data;

    const newValue = data[data.length - 1].temperature;
    this.currentDisplayValue = newValue;

    this.updateChartData(data, categories);
  }

  private updateChartData(
    data: { temperature: number; date: string }[],
    categories: string[]
  ): void {
    const actualSeries = data.map((item) => item.temperature);

    this.currentDisplayValue = actualSeries[actualSeries.length - 1];

    if (this.chartOptions) {
      this.chartOptions.series = [
        {
          name: 'Límite Máximo',
          data: Array(actualSeries.length).fill(this.averageHigh),
        },
        { name: 'Temperatura Actual', data: actualSeries },
        {
          name: 'Límite Mínimo',
          data: Array(actualSeries.length).fill(this.averageLow),
        },
      ];

      this.chartOptions.xaxis.categories = categories;

      if (this.chart) {
        this.chart.updateOptions({
          series: this.chartOptions.series,
          xaxis: { categories },
        });
      }
    }
  }

  private simulateRealtimeData(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (this.dataSubscription && !this.dataSubscription.closed) {
      this.dataSubscription.unsubscribe();
    }

    this.dataSubscription = new Subscription();

    let time = 0;
    const intervalId = setInterval(() => {
      if (this.selectedRange === TimeRange.Daily) {
        const baseTemp = 28 + 6 * Math.sin(time);
        const noise = Math.random() * 1.0 - 0.5;
        const newTemp = baseTemp + noise;

        const newData = {
          value: parseFloat(newTemp.toFixed(1)),
          timestamp: new Date().toISOString(),
        };

        this.appendRealtimeData(newData);
        time += 0.1;
      }
    }, this.UPDATE_INTERVAL);

    this.dataSubscription.add({ unsubscribe: () => clearInterval(intervalId) });
  }

  private appendRealtimeData(data: { value: number; timestamp: string }): void {
    this.ngZone.run(() => {
      this.currentDisplayValue = data.value;
      this.currentTemperature = data.value;

      this.checkTemperatureAlert(data.value);

      const newDate = new Date(data.timestamp);
      const timeLabel = newDate.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

      this.currentData.push({
        temperature: data.value,
        date: timeLabel,
      });

      if (this.currentData.length > this.MAX_DATA_POINTS) {
        this.currentData.shift();
      }

      const categories = this.currentData.map((d) => d.date);
      const actualSeries = this.currentData.map((d) => d.temperature);

      if (this.chart && this.chartOptions) {
        this.chart.updateOptions({
          series: [
            {
              name: 'Límite Máximo',
              data: Array(actualSeries.length).fill(this.averageHigh),
            },
            {
              name: 'Temperatura Actual',
              data: actualSeries,
            },
            {
              name: 'Límite Mínimo',
              data: Array(actualSeries.length).fill(this.averageLow),
            },
          ],
          xaxis: {
            categories: categories,
          },
        });
      }
    });
  }
}
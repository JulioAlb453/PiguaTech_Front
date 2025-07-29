import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  NgZone,
} from '@angular/core';
import { CommonModule } from '@angular/common';
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
  NgApexchartsModule,
} from 'ng-apexcharts';

import { TimeRange } from '../../temperature/domain/input/i-monitoring.service';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { NotificationService } from '../../../../core/services/notification.service';
import { AlertsService, Alert } from '../../../../core/services/alerts.service';

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
  public chartOptions!: ChartOptions;

  private dataSubscription!: Subscription;
  private readonly MAX_DATA_POINTS = 20;
  private readonly UPDATE_INTERVAL = 3000;

  // Valores de referencia
  public averageHigh: number = 32;
  public averageLow: number = 24;
  public currentDisplayValue: number = 26;

  public showAlertModal: boolean = false;
  public tempAlertHigh: number = 32;
  public tempAlertLow: number = 24.9;
  public alertsEnabled: boolean = false;
  public showNotificationModal: boolean = false;
  public modalAlerts$!: Observable<Alert[]>;

  private destroy$ = new Subject<void>();

  private isHighAlertActive: boolean = false;
  private isLowAlertActive: boolean = false;
  public hasNewNotifications: boolean = false;

  public currentData: { temperature: number; date: string }[] = [];
  public selectedRange: TimeRange = TimeRange.Daily;

  constructor(
    private router: Router,
    private ngZone: NgZone,
    private notificationService: NotificationService,
    private alertsService: AlertsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.modalAlerts$ = this.alertsService.getRecentAlerts(5);
    this.modalAlerts$.pipe(takeUntil(this.destroy$)).subscribe((alerts) => {
      this.cdr.detectChanges();
    });

    this.initializeChartWithDefaults();
    this.selectedRange = TimeRange.Daily;
    this.loadHardcodedData(this.selectedRange);
    this.simulateRealtimeData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get displayValue(): number {
    return this.currentDisplayValue;
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

    // Actualizar los valores
    this.averageHigh = this.tempAlertHigh;
    this.averageLow = this.tempAlertLow;
    this.alertsEnabled = true;

    // Actualizar el gráfico con los nuevos límites
    this.updateChartLimits();

    this.notificationService.showSuccess(
      'Alertas Configuradas',
      `Rango establecido: ${this.averageLow}°C - ${this.averageHigh}°C`
    );

    this.closeAlertModal();
  }

  public checkTemperatureAlert(temperature: number): void {
    // Guarda de seguridad principal
    if (!this.alertsEnabled) {
      return;
    }

    // --- LÓGICA PARA ALERTA ALTA ---
    if (temperature >= this.averageHigh) {
      // La condición clave: solo entra si la alerta ALTA NO está ya activa
      if (!this.isHighAlertActive) {
        // 1. Marcar esta alerta como activa para no volver a entrar aquí
        this.isHighAlertActive = true;
        // 2. Desactivar la alerta baja por si acaso
        this.isLowAlertActive = false;
        // 3. Marcar que hay notificaciones nuevas sin leer
        this.hasNewNotifications = true;

        // 4. Preparar y enviar los datos
        const alertTitle = 'Temperatura del Agua Alta';
        const alertDescription = `La temperatura ha alcanzado ${temperature.toFixed(
          1
        )}°C, superando el límite de ${this.averageHigh}°C.`;

        // 5. Llamar a los servicios
        this.notificationService.showSensorAnomaly('error', `🚨 ${alertTitle}`);
        this.alertsService.addAlert({
          type: 'error',
          title: alertTitle,
          priority: 'Media',
          description: alertDescription,
          timestamp: new Date(),
        });
      }
    }
    // --- LÓGICA PARA ALERTA BAJA ---
    else if (temperature <= this.averageLow) {
      // La condición clave: solo entra si la alerta BAJA NO está ya activa
      if (!this.isLowAlertActive) {
        // 1. Marcar esta alerta como activa
        this.isLowAlertActive = true;
        // 2. Desactivar la alerta alta
        this.isHighAlertActive = false;
        // 3. Marcar que hay notificaciones nuevas
        this.hasNewNotifications = true;

        // 4. Preparar y enviar los datos
        const alertTitle = 'Temperatura del Agua Baja';
        const alertDescription = `La temperatura ha bajado a ${temperature.toFixed(
          1
        )}°C, por debajo del límite de ${this.averageLow}°C.`;

        // 5. Llamar a los servicios
        this.notificationService.showSensorAnomaly(
          'warning',
          `🧊 ${alertTitle}`
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
    // --- LÓGICA PARA VOLVER A LA NORMALIDAD ---
    else {
      // Si la temperatura está en el rango seguro, reseteamos AMBAS banderas.
      // Esto permite que futuras alertas puedan dispararse de nuevo.
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
  public onBellClick(): void {
    this.hasNewNotifications = false; // "Apaga" el punto rojo
    this.showNotificationModal = true; // "Enciende" el modal de notificaciones
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
    console.log('🔄 Cambiando rango a:', range); // Debug
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
    this.showNotificationModal = false; // Cierra el modal antes de navegar
    this.router.navigate(['/alerts-history']); // Navega a la vista de historial
  }

  private loadHardcodedData(range: TimeRange): void {
    let data: { temperature: number; date: string }[] = [];
    let categories: string[] = [];

    console.log('🔄 Cargando datos para rango:', range); // Debug

    switch (range) {
      case TimeRange.Daily:
        // Datos para 24 horas (cada hora) con variación normal
        for (let i = 0; i < 24; i++) {
          const hour = i < 10 ? `0${i}:00` : `${i}:00`;
          // Variación más suave durante el día
          const baseTemp = 24 + Math.sin(i / 6) * 4; // Oscilación entre 20-28°C
          const temp = baseTemp + (Math.random() * 1 - 0.5); // Pequeña variación aleatoria
          data.push({
            temperature: parseFloat(temp.toFixed(1)),
            date: hour,
          });
          categories.push(hour);
        }
        break;

      case TimeRange.Weekly:
        // Datos para 7 días con poca variación
        const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
        const weeklyBase = 24 + Math.random() * 2; // Temperatura base para la semana

        days.forEach((day) => {
          // Pequeña variación diaria (±1°C)
          const temp = weeklyBase + (Math.random() * 2 - 1);
          data.push({
            temperature: parseFloat(temp.toFixed(1)),
            date: day,
          });
          categories.push(day);
        });
        break;

      case TimeRange.Monthly:
        // Datos para 4 semanas con muy poca variación
        const monthlyBase = 24 + (Math.random() * 3 - 1.5); // Temperatura base para el mes

        for (let i = 1; i <= 4; i++) {
          // Mínima variación semanal (±0.5°C)
          const temp = monthlyBase + (Math.random() * 1 - 0.5);
          data.push({
            temperature: parseFloat(temp.toFixed(1)),
            date: `Sem ${i}`,
          });
          categories.push(`Sem ${i}`);
        }
        break;
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

  private simulateRealtimeData(): void {
    if (this.dataSubscription && !this.dataSubscription.closed) {
      this.dataSubscription.unsubscribe();
    }

    this.dataSubscription = new Subscription();

    // Usaremos una base de tiempo para la onda sinusoidal
    let time = 0;

    const intervalId = setInterval(() => {
      if (this.selectedRange === TimeRange.Daily) {
        const baseTemp = 28 + 6 * Math.sin(time);
        const noise = Math.random() * 1.0 - 0.5;
        const newTemp = baseTemp + noise;

        console.log(`⏰ [SIMULACIÓN] Valor generado: ${newTemp.toFixed(2)}`);

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
        this.currentData.shift(); // Elimina el elemento más antiguo (el primero).
      }

      const categories = this.currentData.map((d) => d.date);
      const actualSeries = this.currentData.map((d) => d.temperature);

      if (this.chart) {
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

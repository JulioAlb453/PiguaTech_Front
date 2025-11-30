import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Alert, AlertsService } from '../alerts.service';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-alerts',
  standalone: false,
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss'],
})
export class AlertsComponent implements OnInit, OnDestroy {
  @Input() showHeader: boolean = true;
  @Input() maxAlerts?: number;
  @Input() filterByPriority?: 'Alta' | 'Media' | 'Baja';
  @Input() filterByType?: string | string[];
  @Input() autoRefresh: boolean = true;
  @Input() showHistoryLink: boolean = true;
  @Input() isModal: boolean = false; // Nueva propiedad para modal
  @Output() modalClosed = new EventEmitter<void>(); // Evento para cerrar modal

  alerts: Alert[] = [];
  private alertsSubscription!: Subscription;

  constructor(
    public alertsService: AlertsService,
    private router: Router
  ) {}

  ngOnInit() {
    console.log('AlertsComponent iniciado - Modal:', this.isModal);
    this.subscribeToAlerts();
  }

  private subscribeToAlerts(): void {
    this.alertsSubscription = this.alertsService.alerts$
      .pipe(
        map((alerts) => {
          let filteredAlerts = [...alerts];

          // Filtro por tipo
          if (this.filterByType) {
            const filterType = this.filterByType;
            if (Array.isArray(filterType)) {
              filteredAlerts = filteredAlerts.filter((alert) =>
                filterType.includes(alert.type)
              );
            } else {
              filteredAlerts = filteredAlerts.filter(
                (alert) => alert.type === filterType
              );
            }
          }

          // Filtro por prioridad
          if (this.filterByPriority) {
            filteredAlerts = filteredAlerts.filter(
              (alert) => alert.priority === this.filterByPriority
            );
          }

          // Limitar cantidad
          if (this.maxAlerts) {
            filteredAlerts = filteredAlerts.slice(0, this.maxAlerts);
          }

          console.log('Alertas filtradas:', filteredAlerts);
          return filteredAlerts;
        })
      )
      .subscribe((filteredAlerts) => {
        this.alerts = filteredAlerts;
      });
  }

  getPriorityClass(priority: 'Alta' | 'Media' | 'Baja'): string {
    switch (priority) {
      case 'Alta':
        return 'priority-alta';
      case 'Media':
        return 'priority-media';
      case 'Baja':
        return 'priority-baja';
      default:
        return 'priority-media';
    }
  }

  getTypeIcon(type: string): string {
    switch (type) {
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '🔔';
    }
  }

  removeAlert(alertId: string): void {
    this.alertsService.removeAlert(alertId);
  }

  clearAllAlerts(): void {
    this.alertsService.clearAlerts();
  }

  goToAlertsHistory(): void {
    console.log('Navegando al historial de alertas');
    this.router.navigate(['/alertas/historial']);
  }

  // Método para cerrar el modal
  closeModal(): void {
    this.modalClosed.emit();
  }

  ngOnDestroy() {
    if (this.alertsSubscription) {
      this.alertsSubscription.unsubscribe();
    }
  }
}
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Alert, AlertsService } from '../alerts.service';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-alerts',
  standalone: false,
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss'],
})
export class AlertsComponent {
  @Input() showHeader: boolean = true;
  @Input() maxAlerts?: number;
  @Input() filterByPriority?: 'Alta' | 'Media' | 'Baja';
  @Input() filterByType?:
    | 'error'
    | 'warning'
    | 'info'
    | ('error' | 'warning' | 'info')[];
  @Input() autoRefresh: boolean = true;

  alerts: Alert[] = [];
  private alertsSubscription!: Subscription;

  constructor(public alertsService: AlertsService) {}
  private subscribeToAlerts(): void {
    this.alertsSubscription = this.alertsService.alerts$
      .pipe(
        map((alerts) => {
          let filteredAlerts = [...alerts];

          // Aplicar filtro por tipo (ahora soporta array)
          if (this.filterByType) {
            const filterType = this.filterByType;
            if (Array.isArray(filterType)) {
              // Si es array, filtrar por múltiples tipos
              filteredAlerts = filteredAlerts.filter((alert) =>
                filterType.includes(alert.type)
              );
            } else {
              // Si es string individual, filtrar por un tipo
              filteredAlerts = filteredAlerts.filter(
                (alert) => alert.type === filterType
              );
            }
          }

          // Aplicar filtro por prioridad
          if (this.filterByPriority) {
            filteredAlerts = filteredAlerts.filter(
              (alert) => alert.priority === this.filterByPriority
            );
          }

          // Aplicar límite
          if (this.maxAlerts) {
            filteredAlerts = filteredAlerts.slice(0, this.maxAlerts);
          }

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
    console.log('Eliminar alerta:', alertId);
  }

  clearAllAlerts(): void {
    console.log('Limpiar todas las alertas');
  }

  ngOnDestroy() {
    if (this.alertsSubscription) {
      this.alertsSubscription.unsubscribe();
    }
  }
}

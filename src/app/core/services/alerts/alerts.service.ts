import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Alert {
  id: string;
  type: 'error' | 'warning' | 'info';
  title: string;
  priority: 'Alta' | 'Media' | 'Baja';
  description: string;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root',
})
export class AlertsService {
  public readonly instanceId!: number;

  private readonly _alerts = new BehaviorSubject<Alert[]>([]);
  public readonly alerts$: Observable<Alert[]> = this._alerts.asObservable();

  // Getter para acceder al array actual de alertas
  private get alerts(): Alert[] {
    return this._alerts.getValue();
  }

  constructor() {
    // this.instanceId = Math.random();
  }

  public addAlert(newAlert: Omit<Alert, 'id'>): void {
    const currentAlerts = this._alerts.getValue();
    const alertWithId = { 
      ...newAlert, 
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` 
    };
    const newArray = [alertWithId, ...currentAlerts];

    console.log(`[ALERTS SERVICE] Alerta añadida. Nuevo array:`, newArray);

    this._alerts.next(newArray);
  }

  public getRecentAlerts(count: number): Observable<Alert[]> {
    return this.alerts$.pipe(map((alerts) => alerts.slice(0, count)));
  }

  removeAlert(alertId: string): void {
    const currentAlerts = this._alerts.getValue();
    const filteredAlerts = currentAlerts.filter((alert) => alert.id !== alertId);
    
    console.log(`[ALERTS SERVICE] Eliminando alerta ${alertId}`);
    this._alerts.next(filteredAlerts);
  }

  clearAlerts(): void {
    console.log(`[ALERTS SERVICE] Limpiando todas las alertas`);
    this._alerts.next([]);
  }

  // Método adicional para agregar alertas de ejemplo (para testing)
  addSampleAlerts(): void {
    this.addAlert({
      type: 'warning',
      title: 'Turbidez Alta',
      priority: 'Alta',
      description: 'La turbidez ha superado el límite permitido de 100 g/L',
      timestamp: new Date()
    });

    this.addAlert({
      type: 'info',
      title: 'Mantenimiento Programado',
      priority: 'Baja',
      description: 'Mantenimiento del sistema programado para el próximo viernes',
      timestamp: new Date()
    });
  }
}
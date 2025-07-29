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

  constructor() {
    this.instanceId = Math.random();
  }

  public addAlert(newAlert: Omit<Alert, 'id'>): void {
    const currentAlerts = this._alerts.getValue();
    const alertWithId = { ...newAlert, id: `alert-${Date.now()}` };
    const newArray = [alertWithId, ...currentAlerts];

    console.log(
      `✅ [ALERTS SERVICE - ID: ${this.instanceId}] Alerta añadida. Nuevo array:`,
      newArray
    );

    this._alerts.next(newArray);
  }

  public getRecentAlerts(count: number): Observable<Alert[]> {
  // this.alerts$ está garantizado que es un Observable, así que .pipe() siempre existirá.
  return this.alerts$.pipe(
    map(alerts => alerts.slice(0, count))
  );
}
}

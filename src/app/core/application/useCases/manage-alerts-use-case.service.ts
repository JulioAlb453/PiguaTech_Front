import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { IAlertService } from '../../domain/ports/inputs/i-alert.service';
import { Alert } from '../../domain/models/alert';
import { AlertLevel } from '../../domain/models/alert';
import { SweetAlertAdapter } from '../../infrastructure/adapters/output/sweet-alert.adapter.ts.service';
@Injectable({
  providedIn: 'root',
})
export class ManageAlertsUseCase implements IAlertService {
  private readonly _alerts = new BehaviorSubject<Alert[]>([]);

  public readonly alerts$: Observable<Alert[]> = this._alerts.asObservable();

  public readonly unreadAlertsCount$: Observable<number> = this.alerts$.pipe(
    map((alerts) => alerts.filter((alert) => !alert.isRead).length)
  );

  constructor(private sweetAlert: SweetAlertAdapter) {}

  public addAlert(alertData: Omit<Alert, 'id' | 'timestamp' | 'isRead'>): void {
    const newAlert: Alert = {
      ...alertData,
      id: crypto.randomUUID(), 
      timestamp: new Date(),
      isRead: false,
    };

    const currentAlerts = this._alerts.getValue();
    this._alerts.next([newAlert, ...currentAlerts]);

    this.showVisualAlert(newAlert);
  }

  private showVisualAlert(alert: Alert): void {
    const title = this.getAlertTitle(alert.level);

    this.sweetAlert.showAlert(title, alert.message, alert.level).then(() => {
      this.markAsRead(alert.id);
    });
  }

  private getAlertTitle(level: AlertLevel): string {
    const titles = {
      info: 'Información',
      warning: 'Advertencia',
      critical: 'Error Crítico',
    };
    return titles[level];
  }
  public markAsRead(alertId: string): void {
    const currentAlerts = this._alerts.getValue();
    const updatedAlerts = currentAlerts.map((alert) =>
      alert.id === alertId ? { ...alert, isRead: true } : alert
    );
    this._alerts.next(updatedAlerts);
  }
  public markAllAsRead(): void {
    const currentAlerts = this._alerts.getValue();
    const updatedAlerts = currentAlerts.map((alert) => ({
      ...alert,
      isRead: true,
    }));
    this._alerts.next(updatedAlerts);
  }

  public clearAlert(alertId: string): void {
    const currentAlerts = this._alerts.getValue();
    const updatedAlerts = currentAlerts.filter((alert) => alert.id !== alertId);
    this._alerts.next(updatedAlerts);
  }
}

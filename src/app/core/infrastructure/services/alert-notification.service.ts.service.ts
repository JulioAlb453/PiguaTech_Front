import { Injectable } from '@angular/core';
import { IAlertService } from '../../domain/ports/inputs/i-alert.service';
import { AlertLevel } from '../../domain/models/alert';
import { SweetAlertAdapter } from '../adapters/output/sweet-alert.adapter.ts.service';

@Injectable({ providedIn: 'root' })
export class AlertNotificationService {
  constructor(
    private alertService: IAlertService,
    private sweetAlert: SweetAlertAdapter
  ) {}

  showNotification(message: string, level: AlertLevel, source: string): void {
    this.alertService.addAlert({ message, level, source });
  }

  async confirmAction(
    message: string,
    level: AlertLevel = 'warning',
    source: string = 'user-confirmation'
  ): Promise<boolean> {
    const title = this.getTitleByLevel(level);
    const result = await this.sweetAlert.showConfirm(title, message, level);

    if (result.isConfirmed) {
      this.alertService.addAlert({
        message: `Usuario confirmó: ${message}`,
        level: 'info',
        source,
      });
    }

    return result.isConfirmed;
  }

  private getTitleByLevel(level: AlertLevel): string {
    const titles = {
      info: 'Confirmación',
      warning: 'Por favor confirme',
      critical: 'Acción requerida',
    };
    return titles[level];
  }
}

import { Observable } from 'rxjs';
import { Alert } from '../../models/alert';

export abstract class IAlertService {
  abstract readonly alerts$: Observable<Alert[]>;

  abstract readonly unreadAlertsCount$: Observable<number>;
  abstract addAlert(
    alertData: Omit<Alert, 'id' | 'timestamp' | 'isRead'>
  ): void;

  abstract markAsRead(alertId: string): void;

  abstract markAllAsRead(): void;

  abstract clearAlert(alertId: string): void;
}

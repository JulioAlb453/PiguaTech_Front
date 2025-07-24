import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon, SweetAlertResult } from 'sweetalert2';
import { AlertLevel } from '../../../domain/models/alert';

@Injectable({ providedIn: 'root' })
export class SweetAlertAdapter {
  private levelToIcon(level: AlertLevel): SweetAlertIcon {
    const map: Record<AlertLevel, SweetAlertIcon> = {
      'info': 'info',
      'warning': 'warning',
      'critical': 'error'
    };
    return map[level];
  }

  showAlert(title: string, message: string, level: AlertLevel): Promise<SweetAlertResult> {
    return Swal.fire({
      title,
      text: message,
      icon: this.levelToIcon(level),
      confirmButtonText: 'Aceptar',
      allowOutsideClick: false
    });
  }

  showConfirm(
    title: string,
    message: string,
    level: AlertLevel = 'warning'
  ): Promise<SweetAlertResult> {
    return Swal.fire({
      title,
      text: message,
      icon: this.levelToIcon(level),
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    });
  }
}
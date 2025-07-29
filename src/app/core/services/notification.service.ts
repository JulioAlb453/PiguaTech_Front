import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor() {}

  showSensorAnomaly(level: 'warning' | 'error', message: string): void {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: level,
      title: message,
      showConfirmButton: false,
      timer: 5000,
      timerProgressBar: true,
      background: '#2b2b2b',
      color: '#f0f0f0',
      customClass: {
        title: 'alertSweetAlert'
      },
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });
  }

  showSuccess(title: string, text: string): void {
    Swal.fire({
      title: title,
      text: text,
      icon: 'success',
      confirmButtonText: 'Aceptar',
      background: '#2b2b2b',
      color: '#f0f0f0',
      confirmButtonColor: '#f39c12',
    });
  }

  showError(title: string, text: string): void {
    Swal.fire({
      title: title,
      text: text,
      icon: 'error',
      confirmButtonText: 'Entendido',
      background: '#2b2b2b',
      color: '#f0f0f0',
      confirmButtonColor: '#e74c3c',
    });
  }
}
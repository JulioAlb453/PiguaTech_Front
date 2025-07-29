import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Alert } from '../../../../core/services/alerts.service';

@Component({
  selector: 'app-alerts-dashboard',
  standalone: false,
  templateUrl: './alerts-dashboard.component.html',
  styleUrl: './alerts-dashboard.component.scss',
})
export class AlertsDashboardComponent {
  alerts: Alert[] = [
    {
      id: '1',
      type: 'error',
      title: 'Turbidez Crítica',
      priority: 'Alta',
      description:
        'La turbidez del agua ha alcanzado niveles críticos, lo que podría afectar la búsqueda de alimento de los piguas. Se requiere acción inmediata.',
      timestamp: new Date(),
    },
    {
      id: '2',
      type: 'warning',
      title: 'Alta Temperatura del Agua',
      priority: 'Media',
      description:
        'La temperatura del agua ha superado el umbral seguro para los piguas. Monitoreo de cerca.',
      timestamp: new Date('2024-03-15T09:45:00'),
    },

    {
      id: '3',
      type: 'warning',
      title: 'Desviación de la Calidad del Agua',
      priority: 'Media',
      description:
        'Parámetros de calidad del agua ligeramente fuera del rango normal. Monitoreo continuo en su lugar.',
      timestamp: new Date('2024-03-13T08:00:00'),
    },
  ];
  _alerts: any;

  constructor() {}

  getPriorityClass(priority: 'Alta' | 'Media' | 'Baja'): string {
    switch (priority) {
      case 'Alta':
        return 'priority-alta';
      case 'Media':
        return 'priority-media';
      case 'Baja':
        return 'priority-baja';
    }
  }

}

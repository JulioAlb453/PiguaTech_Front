import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Alert {
  title: string;
  priority: 'Alta' | 'Media' | 'Baja';
  description: string;
  timestamp: string;
}

@Component({
  selector: 'app-alerts-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alerts-dashboard.component.html',
  styleUrl: './alerts-dashboard.component.css'
})
export class AlertsDashboardComponent {

  alerts: Alert[] = [
    {
      title: 'Turbidez Crítica',
      priority: 'Alta',
      description: 'La turbidez del agua ha alcanzado niveles críticos, lo que podría afectar la búsqueda de alimento de los pingüinos. Se requiere acción inmediata.',
      timestamp: '2024-03-15 10:30 AM'
    },
    {
      title: 'Alta Temperatura del Agua',
      priority: 'Media',
      description: 'La temperatura del agua ha superado el umbral seguro para los pingüinos. Monitoreo de cerca.',
      timestamp: '2024-03-15 09:45 AM'
    },
    {
      title: 'Anomalía de Migración',
      priority: 'Baja',
      description: 'Se detectó un patrón de migración inusual de pingüinos. Investigando las posibles causas.',
      timestamp: '2024-03-14 04:20 PM'
    },
    {
      title: 'Pico de Actividad de Depredadores',
      priority: 'Alta',
      description: 'Se observó un aumento significativo en la actividad de depredadores cerca de la colonia de pingüinos. Se aconseja mayor vigilancia.',
      timestamp: '2024-03-14 02:15 PM'
    },
    {
      title: 'Falla del Equipo',
      priority: 'Baja',
      description: 'Se detectó una falla menor en el equipo de la estación de monitoreo. Equipo de reparación enviado.',
      timestamp: '2024-03-13 11:50 AM'
    },
    {
      title: 'Desviación de la Calidad del Agua',
      priority: 'Media',
      description: 'Parámetros de calidad del agua ligeramente fuera del rango normal. Monitoreo continuo en su lugar.',
      timestamp: '2024-03-13 08:00 AM'
    }
  ];

  constructor() { }

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
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

type UserRole = 'supervisor' | 'acuitultor';

interface NavLink {
  label: string;
  path: string;
  children?: NavLink[];
}

@Component({
  selector: 'app-navbar',
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
  ],
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  @Input() userRole: UserRole = 'acuitultor';

  private supervisorLinks: NavLink[] = [
    {
      label: 'Resumen',
      path: '#',
      children: [
        { label: 'Estado del habitat', path: '/dasboard/habitat-status' },
        { label: 'Vista principal', path: '/dashboard/supervisor' },
      ],
    },
    { label: 'Reportes', path: '/reports' },
    { label: 'Alertas', path: '/alerts' },
  ];

  private acuicultorLinks: NavLink[] = [
    {
      label: 'Graficas',
      path: '#',
      children: [
        { label: 'Temperatura', path: '/dashboard/temperature' },
        { label: 'crecimiento', path: '/dasboard/grow' },
        { label: 'Habitat (Turbidez/volumen)', path: '/dashboard/habitat' },
      ],
    },
    
  ];
}

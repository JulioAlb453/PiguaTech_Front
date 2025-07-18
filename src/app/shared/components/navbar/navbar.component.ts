import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { NavbarService } from './navbar.service';

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
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  @Input() userRole: UserRole = 'acuitultor';

  showNavbar = true;
  constructor(private navbarService: NavbarService) {}

  ngOnInit(): void {
    this.navbarService.showNavbar$.subscribe((show) => {
      this.showNavbar = show;
    });
  }

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
    { label: 'Alert', path: '/alerts' },
  ];

  get navLinks(): NavLink[] {
    return this.userRole === 'supervisor'
      ? this.supervisorLinks
      : this.acuicultorLinks;
  }
}

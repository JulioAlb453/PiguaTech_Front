import { Component, Input, OnInit } from '@angular/core';

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
    RouterLink,
    RouterLinkActive,
    MatButtonModule,
    MatIconModule,
    MatMenuModule
],
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  @Input() userRole: UserRole = 'supervisor';

  showNavbar = true;
  public isMobileMenuOpen = false;
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
        { label: 'Estado del habitat', path: '/dashboardSupervisor/summary' },
        { label: 'Vista principal', path: '/dashboardSupervisor/home' },
      ],
    },
    { label: 'Reportes', path: '/dashboardSupervisor/reports' },
  ];

  private acuicultorLinks: NavLink[] = [
    {
      label: 'Graficas',
      path: '#',
      children: [
        { label: 'Temperatura', path: '/dashboardAquaculturist/temperature' },
        { label: 'crecimiento', path: '/dashboardAquaculturist/growth' },
        { label: 'Habitat (Turbidez/volumen)', path: '/dashboardAquaculturist/waterMonitoring' },
      ],
    },
    { label: 'Alert', path: '/dashboardAquaculturist/alertsDashboard' },
  ];

  get navLinks(): NavLink[] {
    return this.userRole === 'supervisor'
      ? this.supervisorLinks
      : this.acuicultorLinks;
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
  isMobile(): boolean{
    return window.innerHeight < 992
  }
}

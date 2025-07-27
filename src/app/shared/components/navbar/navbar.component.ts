import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { NavbarService } from './navbar.service';
import { AuthAPIService } from '../../../features/auth/infraestructure/authAPI.service';
import { UserRole } from '../../../features/auth/domain/models/user-role.enum';
import { Subscription } from 'rxjs';

interface NavLink {
  label: string;
  path: string;
  children?: NavLink[];
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  userRole: UserRole = UserRole.Acuicultor; // Fallback por defecto
  showNavbar = true;
  public isMobileMenuOpen = false;

  private subscriptions = new Subscription();

  constructor(
    private navbarService: NavbarService,
    private authService: AuthAPIService
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.navbarService.showNavbar$.subscribe((show) => {
        this.showNavbar = show;
      })
    );

    // Suscribirse al observable que emite el usuario actual
    this.subscriptions.add(
      this.authService.currentUser$.subscribe((user) => {
        if (user?.role) {
          const normalizedRole = user.role.trim().toLowerCase();
          if (normalizedRole === 'supervisor') {
            this.userRole = UserRole.Supervisor;
          } else {
            this.userRole = UserRole.Acuicultor;
          }
        } else {
          this.userRole = UserRole.Acuicultor; 
        }
        console.log('Rol actualizado en navbar:', this.userRole);
      })
    );
  }

  ngOnDestroy(): void {

    this.subscriptions.unsubscribe();
  }

  private supervisorLinks: NavLink[] = [
    {
      label: 'Resumen',
      path: '#',
      children: [
        { label: 'Estado del hábitat', path: '/supervisor/summary' },
        { label: 'Vista principal', path: '/supervisor/home' },
      ],
    },
    { label: 'Reportes', path: '/supervisor/reports' },
  ];

  private acuicultorLinks: NavLink[] = [
    {
      label: 'Gráficas',
      path: '#',
      children: [
        { label: 'Temperatura', path: '/acuicultor/temperature' },
        { label: 'crecimiento', path: '/acuicultor/growth' },
        { label: 'Turbidez', path: '/acuicultor/waterMonitoring' },
      ],
    },
    { label: 'Alertas', path: '/acuicultor/alertsDashboard' },
  ];

  get navLinks(): NavLink[] {
    return this.userRole === UserRole.Supervisor
      ? this.supervisorLinks
      : this.acuicultorLinks;
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  isMobile(): boolean {
    return window.innerHeight < 992;
  }
}

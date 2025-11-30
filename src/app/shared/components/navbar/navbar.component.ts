import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
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
    CommonModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  userRole: UserRole = UserRole.Acuicultor; 
  showNavbar = true;
  public isMobileMenuOpen = false;

  private subscriptions = new Subscription();

  constructor(
    private navbarService: NavbarService,
    private authService: AuthAPIService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.navbarService.showNavbar$.subscribe((show) => {
        this.showNavbar = show;
      })
    );

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

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Error durante el logout:', error);
        this.router.navigate(['/login']);
      },
    });
  }
}

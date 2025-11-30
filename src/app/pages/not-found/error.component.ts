import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthAPIService } from '../../features/auth/infraestructure/authAPI.service';
import { UserRole } from '../../features/auth/domain/models/user-role.enum';
interface ErrorConfig {
  code: string;
  title: string;
  message: string;
}

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
})
export class ErrorComponent implements OnInit {
  errorCode: string = '404';
  errorTitle: string = 'Página no encontrada';
  errorMessage: string = 'La página que buscas no existe o ha sido movida.';
  userRole: UserRole = UserRole.Acuicultor;
  homeRoute: string = '/acuicultor/temperature';
  roles = Object.values(UserRole);
  UserRole = UserRole;

  private errorConfigs: Map<string, ErrorConfig> = new Map([
    [
      '400',
      {
        code: '400',
        title: 'Solicitud incorrecta',
        message: 'La solicitud no pudo ser procesada por el servidor.',
      },
    ],
    [
      '401',
      {
        code: '401',
        title: 'No autorizado',
        message: 'Necesitas iniciar sesión para acceder a esta página.',
      },
    ],
    [
      '403',
      {
        code: '403',
        title: 'Acceso denegado',
        message: 'No tienes permisos para acceder a esta página.',
      },
    ],
    [
      '404',
      {
        code: '404',
        title: 'Página no encontrada',
        message: 'La página que buscas no existe o ha sido movida.',
      },
    ],
    [
      '500',
      {
        code: '500',
        title: 'Error del servidor',
        message: 'Ha ocurrido un error interno en el servidor.',
      },
    ],
    [
      '502',
      {
        code: '502',
        title: 'Bad Gateway',
        message: 'El servidor no pudo obtener una respuesta válida.',
      },
    ],
    [
      '503',
      {
        code: '503',
        title: 'Servicio no disponible',
        message: 'El servicio no está disponible temporalmente.',
      },
    ],
    [
      'default',
      {
        code: 'Error',
        title: 'Algo salió mal',
        message: 'Ha ocurrido un error inesperado.',
      },
    ],
  ]);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthAPIService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const code = params['code'] || '404';
      this.setErrorConfig(code);
    });

    this.detectUserRole();
  }

  private detectUserRole(): void {
    this.authService.currentUser$.subscribe((user) => {
      if (user?.role) {
        const normalizedRole = user.role.trim().toLowerCase();

        if (normalizedRole === 'supervisor') {
          this.userRole = UserRole.Supervisor;
        } else {
          this.userRole = UserRole.Acuicultor;
        }

        this.updateHomeRoute();
      } else {
        this.userRole = UserRole.Acuicultor;
        this.updateHomeRoute();
      }
    });
  }

  private updateHomeRoute(): void {
    this.homeRoute =
      this.userRole === UserRole.Supervisor
        ? '/supervisor/home'
        : '/acuicultor/temperature';
  }

  private setErrorConfig(code: string): void {
    const config =
      this.errorConfigs.get(code) || this.errorConfigs.get('default')!;

    this.errorCode = config.code;
    this.errorTitle = config.title;
    this.errorMessage = config.message;
  }

  goHome(): void {
    this.router.navigate([this.homeRoute]);
  }

  goBack(): void {
    window.history.back();
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  getNavigationLinks(): any[] {
    if (this.userRole === UserRole.Supervisor) {
      return [
        { label: 'Estado del hábitat', path: '/supervisor/summary' },
        { label: 'Vista principal', path: '/supervisor/home' },
        { label: 'Reportes', path: '/supervisor/reports' },
      ];
    }

    return [
      { label: 'Temperatura', path: '/acuicultor/temperature' },
      { label: 'Crecimiento', path: '/acuicultor/growth' },
      { label: 'Turbidez', path: '/acuicultor/waterMonitoring' },
      { label: 'Alertas', path: '/acuicultor/alertsDashboard' },
    ].slice(0, 3);
  }

  getRoleDisplayName(): string {
    switch (this.userRole) {
      case UserRole.Supervisor:
        return 'Supervisor';
      case UserRole.Acuicultor:
        return 'Acuicultor';
      default:
        return 'Usuario';
    }
  }

  isAuthenticated(): boolean {
    return this.authService.isLoggedIn();
  }
}

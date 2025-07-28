import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthAPIService } from '../authAPI.service';

@Injectable({ providedIn: 'root' })
export class AcuicultorGuard implements CanActivate {
  constructor(private auth: AuthAPIService, private router: Router) {}

  canActivate(): boolean {
    const user = this.auth.getLoggedUser();
    if (user?.role === 'acuicultor') {
      return true;
    }
    this.router.navigate(['/unauthorized']);
    return false;
  }
}

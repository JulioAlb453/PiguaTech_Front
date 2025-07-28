import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NavbarService {
 private showNavbarSubject = new BehaviorSubject<boolean>(true);
  showNavbar$ = this.showNavbarSubject.asObservable();

  private hiddenRoutes: string[] = [
    '/login',
    '/register',
  ];

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const shouldShow = !this.hiddenRoutes.some(route => 
          event.urlAfterRedirects.startsWith(route)
        );
        this.showNavbarSubject.next(shouldShow);
      }
    });
  }
}

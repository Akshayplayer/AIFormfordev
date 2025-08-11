import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: any): boolean {
    const expectedRole = route.data['role'];
    const userRole = this.auth.getUserRole();
    if (expectedRole.includes(userRole)) {
      return true;
    }
    this.router.navigate(['/landing']);
    return false;
  }
}

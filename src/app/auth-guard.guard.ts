import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: any): boolean {
    const expectedRoles = route.data['role'];
    const userRole = this.auth.getUserRole();
    // Allow SuperAdmin everywhere Admin is allowed
    if (
      Array.isArray(expectedRoles) &&
      (expectedRoles.includes(userRole) ||
        (userRole === 'SuperAdmin' && expectedRoles.includes('Admin')))
    ) {
      return true;
    }
    this.router.navigate(['/landing']);
    return false;
  }
}

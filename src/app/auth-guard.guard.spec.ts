import { TestBed } from '@angular/core/testing';
import { RoleGuard } from './auth-guard.guard';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

describe('RoleGuard', () => {
  let guard: RoleGuard;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getUserRole']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        RoleGuard,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    guard = TestBed.inject(RoleGuard);
  });

  it('should allow admin', () => {
    authServiceSpy.getUserRole.and.returnValue('Admin');
    const route = { data: { role: ['Admin', 'Manager'] } };
    expect(guard.canActivate(route)).toBeTrue();
  });

  it('should allow superadmin on admin route', () => {
    authServiceSpy.getUserRole.and.returnValue('SuperAdmin');
    const route = { data: { role: ['Admin', 'Manager'] } };
    expect(guard.canActivate(route)).toBeTrue();
  });

  it('should not allow user', () => {
    authServiceSpy.getUserRole.and.returnValue('User');
    const route = { data: { role: ['Admin', 'Manager'] } };
    expect(guard.canActivate(route)).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/landing']);
  });
});

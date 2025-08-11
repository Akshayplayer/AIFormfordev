import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AddDetailsComponent } from './add-details/add-details.component';
import { EmployeeDetailComponent } from './employee-detail/employee-detail.component';
import { LandingComponent } from './landing/landing.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { RoleGuard } from './auth-guard.guard';

export const routes: Routes = [
    { path: "Home", component: HomeComponent, canActivate: [RoleGuard], pathMatch: 'full',data: { role: ['Admin','Manager','Employee'] } },
    { path: "Add", component: AddDetailsComponent, canActivate: [RoleGuard], pathMatch: 'full',data: { role: ['Admin', 'Manager'] } },
    { path: "Add/:empId", component: AddDetailsComponent, canActivate: [RoleGuard], pathMatch: 'full',data: { role: ['Admin', 'Manager'] } },
    { path: "Employee/:empId", component: EmployeeDetailComponent, canActivate: [RoleGuard], pathMatch: 'full',data: { role: ['Admin', 'Manager','Employee'] } },
    { path: "dashboard", component: DashboardComponent, canActivate: [RoleGuard], pathMatch: 'full',data: { role: ['Admin', 'Manager','Employee'] } },
    { path: "", component: LandingComponent, pathMatch: 'full',  },
    { path: "landing", component: LandingComponent, pathMatch: 'full' },
    // { path: "", component: SignupComponent, pathMatch: 'full' },
    // { path: "login", component: LoginComponent, pathMatch: 'full' },
];

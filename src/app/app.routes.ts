import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AddDetailsComponent } from './add-details/add-details.component';
import { EmployeeDetailComponent } from './employee-detail/employee-detail.component';
import { LandingComponent } from './landing/landing.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth-guard.guard';

export const routes: Routes = [
    { path: "Home", component: HomeComponent, canActivate: [AuthGuard], pathMatch: 'full' },
    { path: "Add", component: AddDetailsComponent, canActivate: [AuthGuard], pathMatch: 'full' },
    { path: "Add/:empId", component: AddDetailsComponent, canActivate: [AuthGuard], pathMatch: 'full' },
    { path: "Employee/:empId", component: EmployeeDetailComponent, canActivate: [AuthGuard], pathMatch: 'full' },
    { path: "dashboard", component: DashboardComponent, canActivate: [AuthGuard], pathMatch: 'full' },
    { path: "", component: LandingComponent, pathMatch: 'full' },
    { path: "landing", component: LandingComponent, pathMatch: 'full' },
    // { path: "", component: SignupComponent, pathMatch: 'full' },
    // { path: "login", component: LoginComponent, pathMatch: 'full' }
];

import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AddDetailsComponent } from './add-details/add-details.component';
import { EmployeeDetailComponent } from './employee-detail/employee-detail.component';
import { LandingComponent } from './landing/landing.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
    {path:"Home",component:HomeComponent, pathMatch: 'full'},
    {path:"Add",component:AddDetailsComponent, pathMatch: 'full'},
    {path:"Add/:empId",component:AddDetailsComponent, pathMatch: 'full'},
    {path:"Employee/:empId",component:EmployeeDetailComponent, pathMatch: 'full'},
    {path:"dashboard",component:DashboardComponent, pathMatch: 'full'},
    {path:"Landing",component:LandingComponent, pathMatch: 'full'},
    {path:"",component:DashboardComponent, pathMatch: 'full'},
];

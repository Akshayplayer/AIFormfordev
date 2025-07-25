import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../src/environments/environment';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  private gridRefresh = new Subject<void>();
  gridRefresh$ = this.gridRefresh.asObservable();

  private baseUrl = environment.baseApiUrl;

  constructor(private myhttpclient: HttpClient) { }

  notifyGridRefresh() {
    this.gridRefresh.next();
  }

  // ✅ Employee CRUD
  GetAllEmployees() {
    return this.myhttpclient.get(`${this.baseUrl}/GetAllData`);
  }

  AddNewEmployees(data: any) {
    return this.myhttpclient.post(`${this.baseUrl}/Postdata`, data);
  }

  GetEmployee(empId: number) {
    return this.myhttpclient.get(`${this.baseUrl}/Getdata/${empId}`);
  }

  UpdateEmployee(empId: number, data: any) {
    return this.myhttpclient.put(`${this.baseUrl}/Putdata/${empId}`, data);
  }

  DeleteEmployee(empId: number) {
    return this.myhttpclient.delete(`${this.baseUrl}/Deletedata/${empId}`);
  }

  // ✅ Bulk Operations
  BulkInsertEmployees(data: any[]) {
    return this.myhttpclient.post(`${this.baseUrl}/BulkInsert`, data);
  }

  bulkUpdate(data: any) {
    return this.myhttpclient.post(`${this.baseUrl}/BulkUpdate`, data);
  }

  // ✅ Dropdown API calls
  GetSkills(): Observable<any[]> {
    return this.myhttpclient.get<any[]>(`${this.baseUrl}/GetSkills`);
  }

  GetDesignations(): Observable<any[]> {
    return this.myhttpclient.get<any[]>(`${this.baseUrl}/GetDesignations`);
  }

  GetLocations(): Observable<any[]> {
    return this.myhttpclient.get<any[]>(`${this.baseUrl}/GetLocations`);
  }

  GetProjects(): Observable<any[]> {
    return this.myhttpclient.get<any[]>(`${this.baseUrl}/GetProjects`);
  }

  GetManagers(): Observable<any[]> {
    return this.myhttpclient.get<any[]>(`${this.baseUrl}/GetManagers`);
  }
}

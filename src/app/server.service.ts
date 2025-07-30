import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../src/environments/environment';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  getReportingManagers() {
    throw new Error('Method not implemented.');
  }
  private gridRefresh = new Subject<void>();
  gridRefresh$ = this.gridRefresh.asObservable();

  private baseUrl = environment.baseApiUrl;

  constructor(private myhttpclient: HttpClient) { }

  notifyGridRefresh() {
    this.gridRefresh.next();
  }

  GetAllEmployees() {
    const endPoint = this.baseUrl + "/GetAllData";
    return this.myhttpclient.get(endPoint);
  }

  AddNewEmployees(data: any) {
    const endpoint = this.baseUrl + "/Postdata";
    return this.myhttpclient.post(endpoint, data);
  }

  GetEmployee(empId: number) {
    const endpoint = this.baseUrl + "/Getdata/" + empId;
    return this.myhttpclient.get(endpoint);
  }

  GetEmployeeByIdWithIds(empId:number){
    const endpoint = this.baseUrl + "/get-by-id-with-ids/" + empId;
    return this.myhttpclient.get(endpoint);
  }

  UpdateEmployee(empId: number, data: any) {
    const endpoint = this.baseUrl + "/Putdata/" + empId;
    return this.myhttpclient.put(endpoint, data);
  }

  DeleteEmployee(empId: number) {
    const endpoint = this.baseUrl + "/Deletedata/" + empId;
    return this.myhttpclient.delete(endpoint);
  }

  /** 🔄 Bulk insert multiple employee records */
  BulkInsertEmployees(data: any[]) {
    const endpoint = this.baseUrl + "/BulkInsert";
    return this.myhttpclient.post(endpoint, data);
  }

  bulkUpdate(data: any) {
    const endpoint = this.baseUrl + "/BulkUpdate";
    return this.myhttpclient.post(endpoint, data);
  }

  /** 🔽 NEW: Dropdown Data Fetch Methods */
  GetSkills(): Observable<any[]> {
    return this.myhttpclient.get<any[]>(this.baseUrl + '/GetSkills');
  }

  GetDesignations(): Observable<any[]> {
    return this.myhttpclient.get<any[]>(this.baseUrl + '/GetDesignations');
  }

  GetLocations(): Observable<any[]> {
    return this.myhttpclient.get<any[]>(this.baseUrl + '/GetLocations');
  }

  GetProjects(): Observable<any[]> {
    return this.myhttpclient.get<any[]>(this.baseUrl + '/GetProjects');
  }

  GetManagers(): Observable<any[]> {
    return this.myhttpclient.get<any[]>(this.baseUrl + '/GetManagers');
  }


}

import { Component } from '@angular/core';
import { KENDO_GRID, KENDO_GRID_PDF_EXPORT } from "@progress/kendo-angular-grid";
import { ServerService } from '../server.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SVGIcon, filePdfIcon } from "@progress/kendo-svg-icons";
import { KENDO_TOOLBAR } from "@progress/kendo-angular-toolbar";
import { ExcelExportData } from "@progress/kendo-angular-excel-export";
import { process } from "@progress/kendo-data-query";
import { NotificationUtilService } from '../Notificaiton';
import { DialogComponent } from "@progress/kendo-angular-dialog";
import { DialogModule } from '@progress/kendo-angular-dialog';
import { CommonModule } from '@angular/common';
import { ResourceGet } from '../ResourcesGet';
import { FormGroup, FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [KENDO_GRID, KENDO_GRID_PDF_EXPORT, KENDO_TOOLBAR, DialogComponent, DialogModule, CommonModule, ReactiveFormsModule, FormsModule, NgSelectModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  constructor(
    private Myservices: ServerService,
    private router: Router,
    route: ActivatedRoute,
    private notifier: NotificationUtilService,
    private sharedService: ServerService
  ) { }


  public filePdfIcon: SVGIcon = filePdfIcon;
  public details: any = [];

  // 👇 New variables for delete confirmation
  selectedKeys: number[] = [];
  selectedItems: any[] = [];
  showDeleteDialog = false;
  showBulkEditDialog = false;

  bulkEditForm = new FormGroup({
    locationId: new FormControl(''),
    designationId: new FormControl(''),
    reportingToId: new FormControl(''),
    technologySkill: new FormControl([]),
    projectAllocation: new FormControl([])
  });
  locations: any[] = [];
  designations: any[] = [];
  reportingManagers: any[] = [];
  skills: any[] = [];
  projects: any[] = [];
  ngOnInit() {
    this.getData();
    this.Myservices.GetLocations().subscribe(data => this.locations = data);
    this.Myservices.GetDesignations().subscribe(data => this.designations = data);
    this.Myservices.GetManagers().subscribe(data => this.reportingManagers = data);
    this.Myservices.GetSkills().subscribe(data => this.skills = data);
    this.Myservices.GetProjects().subscribe(data => this.projects = data);

    this.sharedService.gridRefresh$.subscribe(() => {
      this.notifier.showMessage("Data imported. Grid refreshed.");
      this.getData();
    });
  }

  openBulkEditDialog() {
    if (this.selectedKeys.length === 0) {
      this.notifier.showMessage("No items selected for bulk edit");
      return;
    }
    this.bulkEditForm.reset({
      locationId: '',
      designationId: '',
      reportingToId: '',
      technologySkill: [],
      projectAllocation: []
    });
    this.showBulkEditDialog = true;
  }

  closeBulkEditDialog() {
    this.showBulkEditDialog = false;
  }

  applyBulkEdit() {
    if (this.bulkEditForm.invalid) return;
    const values = this.bulkEditForm.value;
    const updates: any = {};
    if (values.locationId) updates.LocationId = values.locationId;
    if (values.designationId) updates.DesignationId = values.designationId;
    if (values.reportingToId) updates.ReportingId = values.reportingToId;
    if (values.technologySkill && values.technologySkill.length) updates.SkillIds = values.technologySkill;
    if (values.projectAllocation && values.projectAllocation.length) updates.ProjectIds = values.projectAllocation;

    if (Object.keys(updates).length === 0) {
      this.notifier.showMessage("No changes selected");
      return;
    }
    console.log(updates);
    console.log({
      EmployeeIds: this.selectedKeys,
      Updates: updates
    });

    // Use the new bulkUpdate API
    this.Myservices.bulkUpdate({
      EmployeeIds: this.selectedKeys,
      Updates: updates
    }).subscribe({
      next: () => {
        this.notifier.showMessage("Bulk update successful");
        this.showBulkEditDialog = false;
        this.getData();
      },
      error: () => {
        this.notifier.showMessage("Bulk update failed");
      }
    });
  }


  getData() {
    this.Myservices.GetAllEmployees().subscribe((data: any) => {
      this.details = data.map((emp: any) => ({
        empId: emp.empId,
        resourceName: emp.resourceName,
        designation: emp.designationName,
        reportingTo: emp.reportingTo,
        technologySkillNames: emp.skillNames?.join(', ') ?? '',  // Assuming skillNames is a string[]
        projectAllocationNames: emp.projectIdNames?.join(', ') ?? '',
        isBillable: emp.isBillableFlags?.join(', ') ?? '',
        location: emp.locationName,
        emailId: emp.emailId,
        cteDoj: emp.cteDoj,
        remarks: emp.remarks
      }));
    });
  }


  View(empId: number) {
    this.notifier.showMessage("View Data Successfully");
    this.router.navigate([`/Employee/${empId}`]);
  }

  Edit(empId: number) {
    this.notifier.showMessage("Edit the Data");
    this.router.navigate([`/Add/${empId}`]);
  }

  // ✅ Modified: open confirmation dialog
  Delete(empId: number) {
    const item = this.details.find((d: any) => d.empId === empId);
    if (item) {
      this.selectedItems = [item];
      this.showDeleteDialog = true;
    }
  }

  // ✅ Modified: confirm multiple deletion
  DeleteSelected() {
    if (this.selectedKeys.length > 0) {
      this.selectedItems = this.details.filter((item: any) => this.selectedKeys.includes(item.empId));
      this.showDeleteDialog = true;
    } else {
      this.notifier.showMessage("No items selected for deletion");
    }
  }

  // ✅ Called when user confirms deletion in dialog
  confirmDelete(): void {
    const deleteCalls = this.selectedItems.map(item =>
      this.Myservices.DeleteEmployee(item.empId).toPromise()
    );

    Promise.all(deleteCalls).then(() => {
      this.notifier.showMessage("Deleted successfully");
      this.showDeleteDialog = false;
      this.selectedItems = [];
      this.selectedKeys = [];
      this.getData(); // refresh grid
    }).catch(() => {
      this.notifier.showMessage("Error deleting records");
    });
  }

  // ✅ Called when user cancels
  onDialogClose(): void {
    this.showDeleteDialog = false;
    this.selectedItems = [];
  }

  exportToCSV(): void {
    const csvRows: string[] = [];
    const headers = [
      'Employee ID', 'Name', 'Designation', 'Reporting To', 'Billable',
      'Tech Skill', 'Project Allocation', 'Location', 'Email ID', 'CTE DOJ', 'Remarks'
    ];
    csvRows.push(headers.join(','));

    this.details.forEach((item: any) => {
      const row = [
        item.empId, item.resourceName, item.designation, item.reportingTo, item.isBillable,
        item.technologySkill, item.projectAllocation, item.location, item.emailId,
        item.cteDoj, item.remarks
      ].map(field => `"${String(field ?? '').replace(/"/g, '""')}"`);
      csvRows.push(row.join(','));
    });

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'EmployeeDetails.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  onSelectionChange(event: any): void {
    const newlySelectedIds = event.selectedRows.map((row: any) => row.dataItem.empId);
    const newlyDeselectedIds = event.deselectedRows.map((row: any) => row.dataItem.empId);

    this.selectedKeys = this.selectedKeys.filter(id => !newlyDeselectedIds.includes(id));
    for (const id of newlySelectedIds) {
      if (!this.selectedKeys.includes(id)) {
        this.selectedKeys.push(id);
      }
    }
  }

  allData(): ExcelExportData {
    return {
      data: process(this.details, {
        sort: [{ field: "empId", dir: "asc" }]
      }).data,
    };
  }



}

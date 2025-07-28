// add-details.component.ts
import { Component } from '@angular/core';
import {
  FormsModule, FormControl, FormGroup, Validators, ReactiveFormsModule
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ServerService } from '../server.service';
import { Resource } from '../Resources';
import { NotificationUtilService } from '../Notificaiton';
import * as XLSX from 'xlsx';                    // ❶ NEW – Excel/CSV parser
import { formatToYYYYMMDD } from './dateconvert';
import { observable } from 'rxjs';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-add-details',
  standalone: true,
  imports: [NgSelectModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-details.component.html',
  styleUrl: './add-details.component.scss'
})
export class AddDetailsComponent {

  constructor(
    private myService: ServerService,
    private router: Router,
    private route: ActivatedRoute,
    private notifier: NotificationUtilService
  ) { }

  /* -----------------------------------------------------------
   * Existing single‑row logic (untouched)
   * --------------------------------------------------------- */
  clickedform = 'Add';
  localStorageKey = 'partialFormData';
  empId!: number;
  onsubmit = false;
  obj!: Resource;
  designations: any[] = [];
  skills: any = [];
  locations: any[] = [];
  projects: any[] = [];
  reportingManagers: any[] = [];




  myForm: FormGroup = new FormGroup({
    resourceName: new FormControl('', [Validators.required]),
    designationId: new FormControl(null, [Validators.required]),
    reportingToId: new FormControl(null, [Validators.required]),
    // isBillable: new FormControl('', [Validators.required]),
    technologySkill: new FormControl([], [Validators.required]),  // Changed to array
    projectAllocation: new FormControl([], [Validators.required]), // Changed to array
    locationId: new FormControl(null, [Validators.required]),
    emailId: new FormControl('', [Validators.required, Validators.email]),
    cteDoj: new FormControl('', [Validators.required]),
    remarks: new FormControl('')
  });



  /* -----------------------------------------------------------
   * NEW – State for bulk import
   * --------------------------------------------------------- */
  importedRecords: Resource[] = [];

  ngOnInit() {
    this.empId = +this.route.snapshot.paramMap.get('empId')!;

    // Load dropdown data
    this.myService.GetDesignations().subscribe(data => {
      this.designations = data
      console.log("Designations", this.designations);
    });
    this.myService.GetSkills().subscribe(data => {
      this.skills = data
      console.log("Skills", this.skills);
    });
    this.myService.GetLocations().subscribe(data => {
      this.locations = data
      console.log("Locations", this.locations);
    });
    this.myService.GetProjects().subscribe(data => {
      this.projects = data
      console.log("Projects", this.projects);
    });
    this.myService.GetManagers().subscribe(data => {
      this.reportingManagers = data
      console.log("Reporting Managers", this.reportingManagers);
    });

    // Load data for edit mode
    if (this.empId) {
      this.myService.GetEmployee(this.empId).subscribe(data => this.myForm.patchValue(data));
    } else {
      const saved = localStorage.getItem(this.localStorageKey);
      if (saved) { this.myForm.patchValue(JSON.parse(saved)); }
    }

    // Autosave form data
    this.myForm.valueChanges.subscribe(v => {
      if (!this.empId) {
        localStorage.setItem(this.localStorageKey, JSON.stringify(v));
      }
    });
  }




  onFileChange(evt: Event): void {
    const input = evt.target as HTMLInputElement;
    if (!input.files?.length) {
      this.notifier.showMessage('No file selected');
      return;
    }

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = (e: any) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        const ws = workbook.Sheets[workbook.SheetNames[0]];
        const rawRows = XLSX.utils.sheet_to_json(ws, { defval: '' }) as any[];

        if (!rawRows.length) {
          this.notifier.showMessage('No rows found in the file');
          return;
        }
        console.log(rawRows)
        // Normalize header keys to lowercase with no spaces
        this.importedRecords = rawRows.map((row: any) => {
          const normalized = Object.fromEntries(
            Object.entries(row).map(([k, v]) => [k.trim().toLowerCase().replace(/\s+/g, ''), v])
          );

          const getId = (value: string, list: any[]) =>
            list.find((item) => item.name.toLowerCase() === value.toLowerCase())?.id || null;

          const getMultipleIds = (value: string, list: any[]) =>
            value
              .split(',')
              .map(v => v.trim())
              .map(name => getId(name, list))
              .filter(id => id !== null);
            ///
          
          const obj: Resource = {
            ResourceName: String(normalized['resourcename'] ?? ''),
            EmailId: String(normalized['emailid'] ?? ''),
            CteDoj: formatToYYYYMMDD(row?.CteDoj), // convert to YYYY-MM-DD
            LocationId: getId(String(normalized['location'] ?? ''), this.locations),
            DesignationId: getId(String(normalized['designation'] ?? ''), this.designations),
            ReportingId: getId(String(normalized['reportingto'] ?? ''), this.reportingManagers),
            SkillIds: getMultipleIds(String(normalized['technologyskill'] ?? ''), this.skills),
            ProjectIds: getMultipleIds(String(normalized['projectallocation'] ?? ''), this.projects),
            Remarks: String(normalized['remarks'] ?? '')
          };
          console.log("Parsed Record", obj);


          return obj;
        });

        if (!this.importedRecords.length) {
          this.notifier.showMessage('No valid data found');
          return;
        }

        // Optionally patch first record into form for preview
        // this.myForm.patchValue(this.importedRecords[0]);

        // Send to backend for bulk insert
        console.log('Bulk import data', this.importedRecords);
        this.myService.BulkInsertEmployees(this.importedRecords)
          .subscribe({
            next: (response: any) => {
              console.log('Response for bulk import', response);
              this.notifier.showMessage(
                `Imported ${this.importedRecords.length} employee(s)`
              );
              localStorage.removeItem(this.localStorageKey);
              this.router.navigate(['/Home']);
            },
            error: (error: any) => {
              console.error('Bulk import error', error);
              this.notifier.showMessage('Import failed');
            }
          });

      } catch (err) {
        this.notifier.showMessage('Failed to parse file');
      }
    };

    reader.readAsArrayBuffer(file);
    input.value = ''; // Reset input
  }

  /* -----------------------------------------------------------
   * Existing single‑row submit logic (untouched)
   * --------------------------------------------------------- */
  OnSubmit() {
    if (!this.myForm.valid) {
      this.myForm.markAllAsTouched();
      return;
    }

    this.obj = {
      ResourceName: this.myForm.get('resourceName')?.value,
      DesignationId: this.myForm.get('designationId')?.value,
      ReportingId: this.myForm.get('reportingToId')?.value,
      // isBillable: this.myForm.get('isBillable')?.value === 'true',
      LocationId: this.myForm.get('locationId')?.value,
      EmailId: this.myForm.get('emailId')?.value,
      CteDoj: this.myForm.get('cteDoj')?.value,
      Remarks: this.myForm.get('remarks')?.value,

      // ✅ NEW: handle multiple values
      SkillIds: this.myForm.get('technologySkill')?.value,
      ProjectIds: this.myForm.get('projectAllocation')?.value
    };
    console.log("SUBMIT OBJ", this.obj);

    this.onsubmit = true;

    if (this.empId) {
      this.obj.EmpId = this.empId;
      this.myService.UpdateEmployee(this.empId, this.obj).subscribe(() => {
        this.notifier.showMessage('Updated Successfully');
        this.resetAndReturnHome();
      });
    } else {
      this.myService.AddNewEmployees(this.obj).subscribe(() => {
        this.notifier.showMessage('Added Successfully');
        this.resetAndReturnHome();
      });
    }
  }

  /* -----------------------------------------------------------
   * Helpers
   * --------------------------------------------------------- */
  resetAndReturnHome() {
    this.myForm.reset();
    localStorage.removeItem(this.localStorageKey);
    this.router.navigate(['/Home']);
  }

  resetForm(): void {
    if (confirm('Are you sure you want to reset the form?')) {
      this.myForm.reset();
      localStorage.removeItem(this.localStorageKey);
    }
  }

  exportTemplate() {
    const headers = [
      'ResourceName', 'Designation', 'ReportingTo',
      'TechnologySkill', 'ProjectAllocation', 'Location',
      'EmailId', 'CteDoj', 'Remarks'
    ];
    const worksheet = XLSX.utils.aoa_to_sheet([headers]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');
    XLSX.writeFile(workbook, 'Employee_Import_Template.xlsx');
  }

}

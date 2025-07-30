import { Component } from '@angular/core';
import { ServerService } from '../server.service';
import { CommonModule } from '@angular/common';
import { ChartsModule } from '@progress/kendo-angular-charts';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ChartsModule,
    CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})

export class DashboardComponent {
  employeeData: any[] = [];
  projectCategories: string[] = [];
  projectValues: number[] = [];
  totalEmployees = 0;
  totalBillable = 0;
  totalNonBillable = 0;
  projectBillableCount = 0;
  projectNonBillableCount = 0;

  techSkillDistribution: { [key: string]: number } = {};
  projectDistribution: { [projectName: string]: number } = {};
  topLocations: { location: string; count: number }[] = [];

  constructor(private serverService: ServerService) { }

  ngOnInit(): void {
    this.serverService.GetAllEmployees().subscribe((data: any) => {
      this.employeeData = data;
      this.calculateStats();
      this.calculateProjectStats();
    });
  }

  calculateStats(): void {
    this.totalEmployees = this.employeeData.length;
    this.totalBillable = this.employeeData.filter(e => e.isBillable).length;
    this.totalNonBillable = this.totalEmployees - this.totalBillable;

    // Use skillNames (array of strings) for distribution
    this.techSkillDistribution = {};
    for (const emp of this.employeeData) {
      const skills: string[] = emp.skillNames ?? ['Unknown'];
      for (const skill of skills) {
        this.techSkillDistribution[skill] = (this.techSkillDistribution[skill] || 0) + 1;
      }
    }

    this.calculateTopLocations();
    this.calculateProjectStats();
  }

  calculateProjectStats(): void {
    this.projectDistribution = {};
    this.projectBillableCount = 0;
    this.projectNonBillableCount = 0;

    for (const emp of this.employeeData) {
      const projects: { name: string, isBillable: boolean }[] = emp.projectIdNames ?? [];
      for (const proj of projects) {
        const label = `${proj.name} (${proj.isBillable ? 'Billable' : 'Non-Billable'})`;
        this.projectDistribution[label] = (this.projectDistribution[label] || 0) + 1;

        // Count billable/non-billable projects
        if (proj.isBillable) {
          this.projectBillableCount++;
        } else {
          this.projectNonBillableCount++;
        }
      }
    }
    this.projectCategories = Object.keys(this.projectDistribution);
    this.projectValues = Object.values(this.projectDistribution);
  }

  get techSkillCategories(): string[] {
    return Object.keys(this.techSkillDistribution);
  }

  get techSkillValues(): number[] {
    return Object.values(this.techSkillDistribution);
  }

  private calculateTopLocations(): void {
    const locationMap: { [key: string]: number } = {};
    for (const emp of this.employeeData) {
      // Use locationName for display
      const loc = emp.locationName || 'Unknown';
      locationMap[loc] = (locationMap[loc] || 0) + 1;
    }
    this.topLocations = Object.entries(locationMap)
      .map(([location, count]) => ({ location, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // top 5
  }


}

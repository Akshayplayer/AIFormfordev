export interface Resource {
  EmpId?: number;
  ResourceName: string;

  DesignationId: number;         // Tied to Designations table (still a single value)
  ReportingId: number;         // Tied to Managers table (still a single value)
  // isBillable: boolean;

  SkillIds: number[];          // ✅ NEW: multiple skills by ID
  ProjectIds: number[];        // ✅ NEW: multiple projects by ID

  LocationId: number;            // Tied to Locations table (single value)
  EmailId: string;
  CteDoj: string;              // Stored as string (yyyy-MM-dd)
  Remarks: string;
}

export interface ResourceViewModel extends Resource {
  skillNames?: string[];
  projectNames?: string[];
}



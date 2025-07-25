export interface ResourceGet {
  empId?: number;
  resourceName: string;

  designation: string;         // Tied to Designations table (still a single value)
  reportingTo: string;         // Tied to Managers table (still a single value)
  // isBillable: boolean;

  skillIds: number[];          // ✅ NEW: multiple skills by ID
  projectIds: number[];       // ✅ NEW: multiple projects by ID

  location: string;            // Tied to Locations table (single value)
  emailId: string;
  cteDoj: string;              // Stored as string (yyyy-MM-dd)
  remarks: string;
}

export interface ResourceViewModel extends ResourceGet {
  skillNames?: string[];
  projectNames?: string[];
}

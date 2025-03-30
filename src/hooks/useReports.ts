export interface Report {
  id: string;
  title: string;
  reportType: string;
  startDate: Date; // Direct property, not nested
  endDate: Date;   // Direct property, not nested
  generatedBy: string | null;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
  summary: string | null;
  createdAt: Date;
  updatedAt: Date;
}
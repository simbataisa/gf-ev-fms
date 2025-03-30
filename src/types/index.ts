export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  phoneNumber?: string;
  address?: string;
}

export interface Vehicle {
  id: string;
  name: string;
  model: string;
  manufacturer: string;
  year: number;
  licensePlate: string;
  vin: string;
  batteryCapacity: number;
  range: number;
  status: string;
  currentCharge: number;
}

export interface ChargingSchedule {
  id: string;
  title: string;
  vehicle: Vehicle;
  scheduledStart: string;
  scheduledEnd: string;
  chargingStation: string;
  targetChargeLevel: number;
  status: string;
  notes?: string;
}

export interface MaintenanceRecord {
  id: string;
  title: string;
  vehicle: Vehicle;
  maintenanceType: string;
  scheduledDate: string;
  completedDate?: string;
  cost?: number;
  status: string;
  notes?: string;
}

export interface Report {
  id: string;
  title: string;
  reportType: string;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  createdAt: string;
  generatedBy?: {
    firstName: string;
    lastName: string;
  };
  summary?: string;
}
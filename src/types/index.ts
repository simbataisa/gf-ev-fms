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

// Update your Report interface to include the dateRange property
export interface Report {
  id: string;
  title: string;
  reportType: string;
  startDate: string | Date;
  endDate: string | Date;
  generatedBy: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  summary?: string | null;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string;
  licenseNumber: string;
  licenseExpiry: string;
  status: 'available' | 'on_duty' | 'on_leave' | 'inactive';
  rating: number;
  address: string;
  joinDate: string;
  currentVehicle: string | null;
  totalTrips: number;
  avatar?: string;
}
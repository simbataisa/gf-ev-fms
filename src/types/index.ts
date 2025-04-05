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
  batteryLevel: number;
  currentCharge: number;
  currentLocation: string;
  lastMaintenance: string;
  color: string;
  status: 'available' | 'assigned' | 'maintenance' | 'charging' | 'in_use';
  currentDriverId: string | null;
  lastMaintenanceDate: string;
  nextMaintenanceDate: string;
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

// Add or update these types

export type DriverType = 'permanent' | 'seasonal' | 'temporary';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type PaymentStatus = 'paid' | 'pending' | 'to_be_collected';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  orderId: string;
  driverId: string | null;
  dueDate: Date;
  completedDate?: Date;
  notes?: string;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  licenseNumber: string;
  licenseExpiry: string;
  status: 'available' | 'on_duty' | 'on_leave' | 'inactive';
  currentVehicle: string | null;
  totalTrips: number;
  rating: number;
  avatar?: string;
  driverType: DriverType;
  eKYCVerified: boolean;
  performanceScore: number;
  jobsCompleted: number;
  joinDate: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  address: string;
  orderType: 'delivery' | 'pickup' | 'chauffeur';
  scheduledTime: Date;
  carModel: string;
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  driverId: string | null;
  vehicleId: string | null;
  paymentStatus: PaymentStatus;
  paymentAmount: number;
  extraFees: ExtraFee[];
  tasks: Task[];
}

export interface ExtraFee {
  id: string;
  description: string;
  amount: number;
  status: PaymentStatus;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  createdAt: Date;
  relatedTo?: {
    type: 'order' | 'vehicle' | 'task';
    id: string;
  };
}
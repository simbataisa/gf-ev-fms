import { Driver } from '../types/index';

export const driversApi = {
  // Get all drivers
  getAllDrivers: async (): Promise<Driver[]> => {
    const response = await fetch('/api/drivers');
    if (!response.ok) {
      throw new Error('Failed to fetch drivers');
    }
    return response.json();
  },
  
  // Get available drivers (for order assignment)
  getAvailableDrivers: async (): Promise<Driver[]> => {
    const response = await fetch('/api/drivers?status=available');
    if (!response.ok) {
      throw new Error('Failed to fetch available drivers');
    }
    return response.json();
  },
  
  // Get a single driver by ID
  getDriverById: async (id: string): Promise<Driver> => {
    const response = await fetch(`/api/drivers/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch driver');
    }
    return response.json();
  },
  
  // Create a new driver
  createDriver: async (driverData: Omit<Driver, 'id'>): Promise<Driver> => {
    const response = await fetch('/api/drivers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(driverData),
    });
    if (!response.ok) {
      throw new Error('Failed to create driver');
    }
    return response.json();
  },
  
  // Update an existing driver
  updateDriver: async (id: string, driverData: Partial<Driver>): Promise<Driver> => {
    const response = await fetch(`/api/drivers/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(driverData),
    });
    if (!response.ok) {
      throw new Error('Failed to update driver');
    }
    return response.json();
  },
  
  // Delete a driver
  deleteDriver: async (id: string): Promise<boolean> => {
    const response = await fetch(`/api/drivers/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete driver');
    }
    return true;
  },
  
  // Assign a driver to a vehicle
  assignVehicle: async (driverId: string, vehicleInfo: string): Promise<Driver> => {
    return driversApi.updateDriver(driverId, {
      currentVehicle: vehicleInfo,
      status: 'on_duty'
    });
  },
  
  // Update driver status
  updateDriverStatus: async (driverId: string, status: Driver['status']): Promise<Driver> => {
    return driversApi.updateDriver(driverId, { status });
  }
};
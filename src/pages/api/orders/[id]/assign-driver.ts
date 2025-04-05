import type { NextApiRequest, NextApiResponse } from 'next';
import { Order, Driver, Vehicle } from '../../../../types';

// Mock data
let mockOrders: Order[] = []; // Assume this is populated
let mockDrivers: Driver[] = []; // Assume this is populated
let mockVehicles: Vehicle[] = []; // Assume this is populated

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const { driverId, orderType } = req.body;

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Find the order
    const orderIndex = mockOrders.findIndex(order => order.id === id);
    if (orderIndex === -1) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Find the driver
    const driverIndex = mockDrivers.findIndex(driver => driver.id === driverId);
    if (driverIndex === -1) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    // Get the vehicle ID from the order
    const vehicleId = mockOrders[orderIndex].vehicleId;
    if (!vehicleId) {
      return res.status(400).json({ message: 'Order does not have a vehicle assigned' });
    }

    // Update the order with the driver
    mockOrders[orderIndex] = {
      ...mockOrders[orderIndex],
      driverId,
      status: 'assigned'
    };

    // Update the driver status and assign vehicle
    mockDrivers[driverIndex] = {
      ...mockDrivers[driverIndex],
      status: 'on_duty',
      currentVehicle: vehicleId
    };

    // If it's a chauffeur service, update the vehicle with the driver
    if (orderType === 'chauffeur') {
      const vehicleIndex = mockVehicles.findIndex(vehicle => vehicle.id === vehicleId);
      if (vehicleIndex !== -1) {
        mockVehicles[vehicleIndex] = {
          ...mockVehicles[vehicleIndex],
          currentDriverId: driverId
        };
      }
    }

    return res.status(200).json({ 
      message: 'Driver assigned successfully',
      order: mockOrders[orderIndex]
    });
  } catch (error) {
    console.error('Error assigning driver:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
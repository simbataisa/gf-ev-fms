import type { NextApiRequest, NextApiResponse } from 'next';
import { Order, Vehicle } from '../../../../types';

// Mock data
let mockOrders: Order[] = []; // Assume this is populated
let mockVehicles: Vehicle[] = []; // Assume this is populated

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const { vehicleId } = req.body;

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Find the order
    const orderIndex = mockOrders.findIndex(order => order.id === id);
    if (orderIndex === -1) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Find the vehicle
    const vehicleIndex = mockVehicles.findIndex(vehicle => vehicle.id === vehicleId);
    if (vehicleIndex === -1) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    // Update the order with the vehicle
    mockOrders[orderIndex] = {
      ...mockOrders[orderIndex],
      vehicleId,
      status: 'assigned'
    };

    // Update the vehicle status
    mockVehicles[vehicleIndex] = {
      ...mockVehicles[vehicleIndex],
      status: 'assigned'
    };

    return res.status(200).json({ 
      message: 'Vehicle assigned successfully',
      order: mockOrders[orderIndex]
    });
  } catch (error) {
    console.error('Error assigning vehicle:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
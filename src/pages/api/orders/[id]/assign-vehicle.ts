import type { NextApiRequest, NextApiResponse } from 'next';
import { Vehicle } from '../../../../types';
import { orders } from '@/data/mockOrders';
import { withMiddleware } from '../../../../middleware/withMiddleware';
import { withAuth, AuthenticatedRequest } from '../../../../middleware/withAuth';
import { withMethods } from '../../../../middleware/withMethods';

// Remove the empty vehicles array and fetch from API instead

async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const { vehicleId } = req.body;

  try {
    // Check user permissions (example of authorization)
    if (req.user?.role !== 'admin' && req.user?.role !== 'manager') {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    // Find the order
    const orderIndex = orders.findIndex(order => order.id === id);
    if (orderIndex === -1) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Fetch vehicles from API
    const vehicleResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/vehicles`);
    if (!vehicleResponse.ok) {
      return res.status(500).json({ message: 'Failed to fetch vehicles data' });
    }
    const vehiclesData = await vehicleResponse.json();

    // Find the vehicle
    const vehicle = vehiclesData.find((vehicle: Vehicle) => vehicle.id === vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    // Update the order with the vehicle
    orders[orderIndex] = {
      ...orders[orderIndex],
      vehicleId,
      status: 'assigned'
    };

    // Update the vehicle status via API
    const updateVehicleResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/vehicles/${vehicleId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status: 'assigned'
      })
    });

    if (!updateVehicleResponse.ok) {
      console.error('Failed to update vehicle status');
      // Continue execution even if this fails
    }

    return res.status(200).json({ 
      message: 'Vehicle assigned successfully',
      order: orders[orderIndex]
    });
  } catch (error) {
    console.error('Error assigning vehicle:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}


export default withMiddleware(
  handler,
  (h) => withMethods(['POST'], h),
  withAuth
);
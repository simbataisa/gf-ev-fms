import type { NextApiRequest, NextApiResponse } from 'next';
import { Order, Driver, Vehicle } from '../../../../types';
import { orders } from '../../../../data/mockOrders';
import { withAuth, AuthenticatedRequest } from '../../../../middleware/withAuth';
import { withMethods } from '../../../../middleware/withMethods';
import { withMiddleware } from '../../../../middleware/withMiddleware';

// Remove mock data imports and use API fetching instead

async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const { driverId, orderType } = req.body;

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

    // Fetch driver data from API
    const driverResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/drivers`);
    if (!driverResponse.ok) {
      return res.status(500).json({ message: 'Failed to fetch drivers data' });
    }
    const driversData = await driverResponse.json();
    
    // Find the driver
    const driver = driversData.find((driver: Driver) => driver.id === driverId);
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    // Get the vehicle ID from the order
    const vehicleId = orders[orderIndex].vehicleId;
    if (!vehicleId) {
      return res.status(400).json({ message: 'Order does not have a vehicle assigned' });
    }

    // Fetch vehicle data from API
    const vehicleResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/vehicles`);
    if (!vehicleResponse.ok) {
      return res.status(500).json({ message: 'Failed to fetch vehicles data' });
    }
    const vehiclesData = await vehicleResponse.json();

    // Update the order with the driver
    orders[orderIndex] = {
      ...orders[orderIndex],
      driverId,
      status: 'assigned'
    };

    // Update the driver status and assign vehicle via API
    const updateDriverResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/drivers/${driverId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': req.headers.authorization || ''
      },
      body: JSON.stringify({
        status: 'on_duty',
        currentVehicle: vehicleId
      })
    });

    if (!updateDriverResponse.ok) {
      return res.status(500).json({ message: 'Failed to update driver status' });
    }

    // If it's a chauffeur service, update the vehicle with the driver
    if (orderType === 'chauffeur') {
      const vehicle = vehiclesData.find((vehicle: Vehicle) => vehicle.id === vehicleId);
      if (vehicle) {
        const updateVehicleResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/vehicles/${vehicleId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': req.headers.authorization || ''
          },
          body: JSON.stringify({
            currentDriverId: driverId
          })
        });

        if (!updateVehicleResponse.ok) {
          console.error('Failed to update vehicle with driver');
          // Continue execution even if this fails
        }
      }
    }

    return res.status(200).json({ 
      message: 'Driver assigned successfully',
      order: orders[orderIndex]
    });
  } catch (error) {
    console.error('Error assigning driver:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Apply middleware with the fixed withMiddleware function
export default withMiddleware(
  handler,
  (h) => withMethods(['POST'], h),
  withAuth
);
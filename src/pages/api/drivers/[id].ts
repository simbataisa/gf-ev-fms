import type { NextApiRequest, NextApiResponse } from 'next';
import { Driver } from '../../../types/index';

// Reference to the drivers data from the main endpoint
// In a real app, this would be a database connection
import { default as driversHandler } from './index';

// Access the drivers array (this is a simplified approach for demonstration)
// @ts-ignore - Accessing internal variable of the handler
const drivers = (driversHandler as any).drivers || [];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const id = req.query.id as string;

  // Find the driver by ID
  const driverIndex = drivers.findIndex((driver: Driver) => driver.id === id);
  
  if (driverIndex === -1) {
    return res.status(404).json({ message: 'Driver not found' });
  }

  switch (method) {
    case 'GET':
      // Return the driver
      return res.status(200).json(drivers[driverIndex]);

    case 'PUT':
      // Update the driver
      const updatedDriver = { ...drivers[driverIndex], ...req.body };
      drivers[driverIndex] = updatedDriver;
      return res.status(200).json(updatedDriver);

    case 'DELETE':
      // Delete the driver
      drivers.splice(driverIndex, 1);
      return res.status(200).json({ success: true });

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
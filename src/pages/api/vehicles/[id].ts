import type { NextApiRequest, NextApiResponse } from 'next';
import { Vehicle } from '../../../types/index';

// Import the vehicles array from the index file
import { vehicles } from './index';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  // Find the vehicle index
  const vehicleIndex = vehicles.findIndex(v => v.id === id);
  
  if (vehicleIndex === -1) {
    return res.status(404).json({ error: 'Vehicle not found' });
  }

  switch (method) {
    case 'GET':
      // Return the specific vehicle
      return res.status(200).json(vehicles[vehicleIndex]);

    case 'PUT':
      // Update the vehicle
      const updatedVehicle = {
        ...vehicles[vehicleIndex],
        ...req.body,
        id // Ensure ID doesn't change
      };
      vehicles[vehicleIndex] = updatedVehicle;
      return res.status(200).json(updatedVehicle);

    case 'DELETE':
      // Remove the vehicle
      vehicles.splice(vehicleIndex, 1);
      return res.status(200).json({ success: true });

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
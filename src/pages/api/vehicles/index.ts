import type { NextApiRequest, NextApiResponse } from 'next';
import { Vehicle } from '../../../types/index';

// Mock data for demonstration
const mockVehicles: Vehicle[] = [
  {
    id: '1',
    name: 'VinFast VF 8 Eco',
    model: 'VF 8',
    manufacturer: 'VinFast',
    year: 2023,
    licensePlate: '51F-123.45',
    vin: 'VF8A12345678901',
    batteryCapacity: 82,
    range: 420,
    batteryLevel: 85,
    currentCharge: 85,
    status: 'available',
    currentLocation: 'Ho Chi Minh City',
    lastMaintenance: '2023-05-15',
    color: 'Midnight Blue',
    currentDriverId: null,
    lastMaintenanceDate: '2023-05-15',
    nextMaintenanceDate: '2023-11-15'
  },
  {
    id: '2',
    name: 'VinFast VF 9 Plus',
    model: 'VF 9',
    manufacturer: 'VinFast',
    year: 2023,
    licensePlate: '30F-789.12',
    vin: 'VF9B23456789012',
    batteryCapacity: 92,
    range: 450,
    batteryLevel: 72,
    currentCharge: 72,
    status: 'available',
    currentLocation: 'Ho Chi Minh City',
    lastMaintenance: '2023-06-20',
    color: 'Pearl White',
    currentDriverId: null,
    lastMaintenanceDate: '2023-06-20',
    nextMaintenanceDate: '2023-12-20'
  },
  {
    id: '3',
    name: 'VinFast VF e34',
    model: 'VF e34',
    manufacturer: 'VinFast',
    year: 2022,
    licensePlate: '51F-456.78',
    vin: 'VFE34567890123',
    batteryCapacity: 42,
    range: 300,
    batteryLevel: 90,
    currentCharge: 90,
    status: 'available',
    currentLocation: 'Ho Chi Minh City',
    lastMaintenance: '2023-07-05',
    color: 'Crimson Red',
    currentDriverId: null,
    lastMaintenanceDate: '2023-07-05',
    nextMaintenanceDate: '2024-01-05'
  },
  {
    id: '4',
    name: 'VinFast VF 5 Plus',
    model: 'VF 5',
    manufacturer: 'VinFast',
    year: 2023,
    licensePlate: '51F-901.23',
    vin: 'VF5C34567890124',
    batteryCapacity: 38,
    range: 280,
    batteryLevel: 65,
    currentCharge: 65,
    status: 'in_use',
    currentLocation: 'Ho Chi Minh City',
    lastMaintenance: '2023-04-10',
    color: 'Silver Grey',
    currentDriverId: '2',
    lastMaintenanceDate: '2023-04-10',
    nextMaintenanceDate: '2023-10-10'
  },
  {
    id: '5',
    name: 'VinFast VF 6 Eco',
    model: 'VF 6',
    manufacturer: 'VinFast',
    year: 2023,
    licensePlate: '51F-345.67',
    vin: 'VF6D45678901235',
    batteryCapacity: 59.6,
    range: 381,
    batteryLevel: 78,
    currentCharge: 78,
    status: 'maintenance',
    currentLocation: 'Ho Chi Minh City',
    lastMaintenance: '2023-08-01',
    color: 'Emerald Green',
    currentDriverId: null,
    lastMaintenanceDate: '2023-08-01',
    nextMaintenanceDate: '2024-02-01'
  }
];

// In-memory store for vehicles (simulating a database)
export let vehicles = [...mockVehicles];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      // Handle GET request - return all vehicles or filter by status
      if (req.query.status === 'available') {
        return res.status(200).json(vehicles.filter(vehicle => vehicle.status === 'available'));
      }
      return res.status(200).json(vehicles);

    case 'POST':
      // Handle POST request - create a new vehicle
      const newVehicle: Vehicle = {
        ...req.body,
        id: String(vehicles.length + 1)
      };
      vehicles.push(newVehicle);
      return res.status(201).json(newVehicle);

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
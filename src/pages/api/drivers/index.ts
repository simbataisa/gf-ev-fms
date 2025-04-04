import type { NextApiRequest, NextApiResponse } from 'next';
import { Driver } from '../../../types/index';

// Mock data for demonstration
const mockDrivers: Driver[] = [
  {
    id: '1',
    name: 'Nguyễn Văn An',
    phone: '0912-345-678',
    email: 'vanan@example.com',
    licenseNumber: 'B2-123456',
    licenseExpiry: '2025-06-15',
    status: 'available',
    rating: 4.8,
    address: '123 Lê Lợi, Quận 1, TP.HCM',
    joinDate: '2022-03-15',
    currentVehicle: null,
    totalTrips: 156
  },
  {
    id: '2',
    name: 'Trần Thị Bình',
    phone: '0987-654-321',
    email: 'thibinh@example.com',
    licenseNumber: 'B2-654321',
    licenseExpiry: '2024-11-30',
    status: 'on_duty',
    rating: 4.5,
    address: '456 Nguyễn Huệ, Quận 1, TP.HCM',
    joinDate: '2022-05-20',
    currentVehicle: 'VF-8 Premium (51F-123.45)',
    totalTrips: 132
  },
  {
    id: '3',
    name: 'Lê Hoàng Cường',
    phone: '0909-123-456',
    email: 'hoangcuong@example.com',
    licenseNumber: 'B2-789012',
    licenseExpiry: '2023-12-31',
    status: 'on_leave',
    rating: 4.2,
    address: '789 Điện Biên Phủ, Quận 3, TP.HCM',
    joinDate: '2022-01-10',
    currentVehicle: null,
    totalTrips: 98
  },
  {
    id: '4',
    name: 'Phạm Minh Đức',
    phone: '0918-765-432',
    email: 'minhduc@example.com',
    licenseNumber: 'B2-345678',
    licenseExpiry: '2024-08-22',
    status: 'available',
    rating: 4.9,
    address: '321 Võ Văn Tần, Quận 3, TP.HCM',
    joinDate: '2022-07-05',
    currentVehicle: null,
    totalTrips: 145
  },
  {
    id: '5',
    name: 'Vũ Thị Hoa',
    phone: '0933-222-111',
    email: 'thihoa@example.com',
    licenseNumber: 'B2-901234',
    licenseExpiry: '2025-03-18',
    status: 'on_duty',
    rating: 4.7,
    address: '567 Cách Mạng Tháng 8, Quận 10, TP.HCM',
    joinDate: '2022-02-28',
    currentVehicle: 'VF-9 Luxury (30F-789.12)',
    totalTrips: 167
  }
];

// In-memory store for drivers (simulating a database)
let drivers = [...mockDrivers];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      // Handle GET request - return all drivers or filter by status
      if (req.query.status === 'available') {
        return res.status(200).json(drivers.filter(driver => driver.status === 'available'));
      }
      return res.status(200).json(drivers);

    case 'POST':
      // Handle POST request - create a new driver
      const newDriver: Driver = {
        ...req.body,
        id: String(drivers.length + 1)
      };
      drivers.push(newDriver);
      return res.status(201).json(newDriver);

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
import type { NextApiRequest, NextApiResponse } from 'next';
import { Order, Task } from '../../../../types';

// Mock data for demonstration
const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Pick up vehicle',
    description: 'Pick up the vehicle from the depot',
    status: 'completed',
    orderId: '1',
    driverId: '1',
    dueDate: new Date(2023, 5, 15, 9, 0, 0),
    completedDate: new Date(2023, 5, 15, 9, 15, 0)
  },
  {
    id: '2',
    title: 'Deliver to customer',
    description: 'Deliver the vehicle to the customer address',
    status: 'completed',
    orderId: '1',
    driverId: '1',
    dueDate: new Date(2023, 5, 15, 10, 0, 0),
    completedDate: new Date(2023, 5, 15, 10, 10, 0)
  },
  {
    id: '3',
    title: 'Collect documents',
    description: 'Have customer sign delivery documents',
    status: 'completed',
    orderId: '1',
    driverId: '1',
    dueDate: new Date(2023, 5, 15, 10, 15, 0),
    completedDate: new Date(2023, 5, 15, 10, 20, 0)
  },
  {
    id: '4',
    title: 'Collect payment',
    description: 'Collect payment from customer',
    status: 'pending',
    orderId: '1',
    driverId: '1',
    dueDate: new Date(2023, 5, 15, 10, 30, 0)
  },
  {
    id: '5',
    title: 'Pick up vehicle',
    description: 'Pick up the vehicle from the depot',
    status: 'pending',
    orderId: '2',
    driverId: '1',
    dueDate: new Date(2023, 5, 16, 13, 0, 0)
  },
  {
    id: '6',
    title: 'Deliver to customer',
    description: 'Deliver the vehicle to the customer address',
    status: 'pending',
    orderId: '2',
    driverId: '1',
    dueDate: new Date(2023, 5, 16, 14, 0, 0)
  }
];

const mockOrders: Order[] = [
  {
    id: '1',
    customerName: 'Nguyễn Thanh Tùng',
    customerPhone: '0912-345-678',
    customerEmail: 'thanhtung@example.com',
    address: '123 Lê Lợi, Quận 1, TP.HCM',
    orderType: 'delivery',
    scheduledTime: new Date(2023, 5, 15, 10, 0, 0),
    carModel: 'VF 8',
    status: 'in_progress',
    driverId: '1',
    vehicleId: '101',
    paymentStatus: 'to_be_collected',
    paymentAmount: 1500000,
    extraFees: [
      {
        id: '1',
        description: 'Express delivery',
        amount: 200000,
        status: 'to_be_collected'
      }
    ],
    tasks: mockTasks.filter(task => task.orderId === '1')
  },
  {
    id: '2',
    customerName: 'Trần Thị Mai Hương',
    customerPhone: '0987-654-321',
    customerEmail: 'maihuong@example.com',
    address: '456 Nguyễn Huệ, Quận 1, TP.HCM',
    orderType: 'pickup',
    scheduledTime: new Date(2023, 5, 16, 14, 0, 0),
    carModel: 'VF 9',
    status: 'assigned',
    driverId: '1',
    vehicleId: '102',
    paymentStatus: 'paid',
    paymentAmount: 2000000,
    extraFees: [],
    tasks: mockTasks.filter(task => task.orderId === '2')
  },
  {
    id: '3',
    customerName: 'Phạm Văn Đức',
    customerPhone: '0909-123-456',
    customerEmail: 'vanduc@example.com',
    address: '789 Điện Biên Phủ, Quận 3, TP.HCM',
    orderType: 'chauffeur',
    scheduledTime: new Date(2023, 5, 17, 9, 30, 0),
    carModel: 'VF 5',
    status: 'assigned',
    driverId: '1',
    vehicleId: '103',
    paymentStatus: 'pending',
    paymentAmount: 3000000,
    extraFees: [],
    tasks: []
  }
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  
  // Get orders for a specific driver
  const driverOrders = mockOrders.filter(order => order.driverId === id);
  
  return res.status(200).json(driverOrders);
}
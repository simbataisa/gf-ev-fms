import type { NextApiRequest, NextApiResponse } from 'next';

interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  address: string;
  orderType: 'delivery' | 'pickup';
  scheduledTime: Date;
  carModel: string;
  status: 'pending' | 'assigned' | 'completed';
  driverId: string | null;
}

// Mock data for demonstration
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
    status: 'pending',
    driverId: null
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
    driverId: '1'
  },
  {
    id: '3',
    customerName: 'Phạm Văn Đức',
    customerPhone: '0909-123-456',
    customerEmail: 'vanduc@example.com',
    address: '789 Điện Biên Phủ, Quận 3, TP.HCM',
    orderType: 'delivery',
    scheduledTime: new Date(2023, 5, 17, 9, 30, 0),
    carModel: 'VF 5',
    status: 'pending',
    driverId: null
  },
  {
    id: '4',
    customerName: 'Lê Thị Hồng Nhung',
    customerPhone: '0918-765-432',
    customerEmail: 'hongnhung@example.com',
    address: '321 Võ Văn Tần, Quận 3, TP.HCM',
    orderType: 'pickup',
    scheduledTime: new Date(2023, 5, 18, 16, 45, 0),
    carModel: 'VF e34',
    status: 'completed',
    driverId: '2'
  },
  {
    id: '5',
    customerName: 'Hoàng Minh Tuấn',
    customerPhone: '0933-222-111',
    customerEmail: 'minhtuan@example.com',
    address: '567 Cách Mạng Tháng 8, Quận 10, TP.HCM',
    orderType: 'delivery',
    scheduledTime: new Date(2023, 5, 15, 14, 30, 0),
    carModel: 'VF 7',
    status: 'assigned',
    driverId: '4'
  }
];

// In-memory store for orders (simulating a database)
let orders = [...mockOrders];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      // Handle GET request - return all orders or filter by status
      if (req.query.status) {
        return res.status(200).json(
          orders.filter(order => order.status === req.query.status)
        );
      }
      return res.status(200).json(orders);

    case 'POST':
      // Handle POST request - create a new order
      const newOrder: Order = {
        ...req.body,
        id: String(orders.length + 1),
        status: 'pending',
        driverId: null,
        scheduledTime: new Date(req.body.scheduledTime)
      };
      orders.push(newOrder);
      return res.status(201).json(newOrder);

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
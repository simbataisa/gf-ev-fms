import type { NextApiRequest, NextApiResponse } from 'next';

// This would normally be imported from a database or shared state
// For this example, we'll re-declare the mock data
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
  // ... other orders (same as above)
];

// In-memory store for orders (simulating a database)
let orders = [...mockOrders];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query } = req;
  const { id } = query;

  // Find the order by ID
  const orderIndex = orders.findIndex(order => order.id === id);
  
  if (orderIndex === -1) {
    return res.status(404).json({ message: 'Order not found' });
  }

  switch (method) {
    case 'GET':
      // Return the order
      return res.status(200).json(orders[orderIndex]);

    case 'PUT':
      // Update the order
      const updatedOrder = { 
        ...orders[orderIndex], 
        ...req.body,
        scheduledTime: req.body.scheduledTime ? new Date(req.body.scheduledTime) : orders[orderIndex].scheduledTime
      };
      orders[orderIndex] = updatedOrder;
      return res.status(200).json(updatedOrder);

    case 'DELETE':
      // Delete the order
      const deletedOrder = orders[orderIndex];
      orders = orders.filter(order => order.id !== id);
      return res.status(200).json(deletedOrder);

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
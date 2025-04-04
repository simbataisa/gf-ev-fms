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
  const { method } = req;

  if (method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${method} Not Allowed`);
  }

  const { orderId, driverId } = req.body;

  if (!orderId || !driverId) {
    return res.status(400).json({ message: 'Order ID and Driver ID are required' });
  }

  // Find the order by ID
  const orderIndex = orders.findIndex(order => order.id === orderId);
  
  if (orderIndex === -1) {
    return res.status(404).json({ message: 'Order not found' });
  }

  // Update the order with the assigned driver
  const updatedOrder = { 
    ...orders[orderIndex], 
    driverId,
    status: 'assigned' as const
  };
  
  orders[orderIndex] = updatedOrder;
  
  // In a real application, you would also update the driver's status here
  // or make a call to the drivers API to update the driver's status

  return res.status(200).json(updatedOrder);
}
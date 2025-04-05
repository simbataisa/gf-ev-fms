import type { NextApiRequest, NextApiResponse } from 'next';
import { Order } from '../../../types/index';
import { orders } from '../../../data/mockOrders';

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

// Export orders for other API routes to use
export { orders };
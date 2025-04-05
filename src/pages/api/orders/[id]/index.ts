import type { NextApiRequest, NextApiResponse } from 'next';
import { orders } from '../../../../data/mockOrders';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid ID' });
  }
  
  // Find the order
  const order = orders.find(o => o.id === id);
  
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  switch (method) {
    case 'GET':
      // Return the order details
      return res.status(200).json(order);

    case 'PUT':
      // Update the order
      const updatedOrder = {
        ...order,
        ...req.body,
        id // Ensure ID doesn't change
      };
      
      // Find the index and update the order in the array
      const orderIndex = orders.findIndex(o => o.id === id);
      orders[orderIndex] = updatedOrder;
      
      return res.status(200).json(updatedOrder);

    default:
      res.setHeader('Allow', ['GET', 'PUT']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
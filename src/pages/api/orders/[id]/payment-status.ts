import { Order } from '@/types';
import type { NextApiRequest, NextApiResponse } from 'next';
import { orders } from '../../../../data/mockOrders';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const { id } = req.query;

  if (method !== 'PUT') {
    res.setHeader('Allow', ['PUT']);
    return res.status(405).end(`Method ${method} Not Allowed`);
  }

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  // Find the order
  const orderIndex = orders.findIndex(o => o.id === id);
  
  if (orderIndex === -1) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const { paymentStatus } = req.body;
  
  if (!paymentStatus || !['pending', 'paid', 'refunded'].includes(paymentStatus)) {
    return res.status(400).json({ error: 'Invalid payment status' });
  }

  // Update the payment status
  orders[orderIndex].paymentStatus = paymentStatus;
  
  return res.status(200).json(orders[orderIndex]);
}
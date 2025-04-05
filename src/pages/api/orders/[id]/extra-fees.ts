import { ExtraFee } from '@/types';
import { orders } from '../../../../data/mockOrders';
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const { id } = req.query;

  if (method !== 'POST') {
    res.setHeader('Allow', ['POST']);
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

  const { description, amount } = req.body;
  
  if (!description || typeof amount !== 'number') {
    return res.status(400).json({ error: 'Invalid fee data' });
  }

  // Create a new fee
  const newFee: ExtraFee = {
    id: `fee-${Date.now()}`,
    description,
    amount,
    status: 'pending', // Add the required status field
    createdAt: new Date()
  };

  // Add the fee to the order
  if (!orders[orderIndex].extraFees) {
    orders[orderIndex].extraFees = [];
  }
  
  orders[orderIndex].extraFees.push(newFee);
  
  return res.status(201).json(newFee);
}
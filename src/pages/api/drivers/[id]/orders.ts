import type { NextApiRequest, NextApiResponse } from 'next';
import { mockOrders } from '@/data/mockOrders';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  
  // Get orders for a specific driver
  const driverOrders = mockOrders.filter(order => order.driverId === id);
  
  return res.status(200).json(driverOrders);
}
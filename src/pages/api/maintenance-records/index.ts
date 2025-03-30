import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const maintenanceRecords = await prisma.maintenanceRecord.findMany({
        include: {
          vehicle: true,
        },
        orderBy: {
          scheduledDate: 'desc',
        },
      });
      
      res.status(200).json({ docs: maintenanceRecords });
    } catch (error) {
      console.error('Error fetching maintenance records:', error);
      res.status(500).json({ error: 'Failed to fetch maintenance records' });
    }
  } else if (req.method === 'POST') {
    try {
      const data = req.body;
      const maintenanceRecord = await prisma.maintenanceRecord.create({
        data: {
          ...data,
          vehicleId: data.vehicle, // Assuming vehicle is the ID
        },
        include: {
          vehicle: true,
        },
      });
      
      res.status(201).json(maintenanceRecord);
    } catch (error) {
      console.error('Error creating maintenance record:', error);
      res.status(500).json({ error: 'Failed to create maintenance record' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
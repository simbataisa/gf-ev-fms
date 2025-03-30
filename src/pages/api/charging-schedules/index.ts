import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const chargingSchedules = await prisma.chargingSchedule.findMany({
        include: {
          vehicle: true,
        },
        orderBy: {
          scheduledStart: 'desc',
        },
      });
      
      res.status(200).json({ docs: chargingSchedules });
    } catch (error) {
      console.error('Error fetching charging schedules:', error);
      res.status(500).json({ error: 'Failed to fetch charging schedules' });
    }
  } else if (req.method === 'POST') {
    try {
      const data = req.body;
      const chargingSchedule = await prisma.chargingSchedule.create({
        data: {
          ...data,
          vehicleId: data.vehicle, // Assuming vehicle is the ID
        },
        include: {
          vehicle: true,
        },
      });
      
      res.status(201).json(chargingSchedule);
    } catch (error) {
      console.error('Error creating charging schedule:', error);
      res.status(500).json({ error: 'Failed to create charging schedule' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
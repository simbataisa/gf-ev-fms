import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { status } = req.query;
  
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    // Filter records by status from database
    const filteredRecords = await prisma.paperwork.findMany({
      where: {
        status: {
          equals: status as string,
          mode: 'insensitive' // Case-insensitive search
        }
      }
    });
    
    // Format dates for frontend consumption
    const formattedRecords = filteredRecords.map(record => ({
      ...record,
      startDate: record.startDate.toISOString().split('T')[0],
      estimatedCompletion: record.estimatedCompletion.toISOString().split('T')[0],
    }));
    
    res.status(200).json(formattedRecords);
  } catch (error) {
    console.error('Error fetching paperwork records by status:', error);
    res.status(500).json({ error: 'Failed to fetch paperwork records' });
  }
}
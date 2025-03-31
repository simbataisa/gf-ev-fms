import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        // Get all paperwork records from database
        const paperworkRecords = await prisma.paperwork.findMany();
        
        // Format dates for frontend consumption
        const formattedRecords = paperworkRecords.map(record => ({
          ...record,
          startDate: record.startDate.toISOString().split('T')[0],
          estimatedCompletion: record.estimatedCompletion.toISOString().split('T')[0],
        }));
        
        res.status(200).json(formattedRecords);
      } catch (error) {
        console.error('Error fetching paperwork records:', error);
        res.status(500).json({ error: 'Failed to fetch paperwork records' });
      }
      break;
      
    case 'POST':
      try {
        const data = req.body;
        
        // Convert string dates to Date objects
        const paperworkData = {
          ...data,
          startDate: new Date(data.startDate),
          estimatedCompletion: new Date(data.estimatedCompletion),
          progress: parseInt(data.progress, 10)
        };
        
        // Create a new paperwork record in database
        const newRecord = await prisma.paperwork.create({
          data: paperworkData
        });
        
        // Format dates for response
        res.status(201).json({
          ...newRecord,
          startDate: newRecord.startDate.toISOString().split('T')[0],
          estimatedCompletion: newRecord.estimatedCompletion.toISOString().split('T')[0],
        });
      } catch (error) {
        console.error('Error creating paperwork record:', error);
        res.status(500).json({ error: 'Failed to create paperwork record' });
      }
      break;
      
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
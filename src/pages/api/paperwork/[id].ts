import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  const { id } = req.query;
  const recordId = parseInt(id as string);
  
  if (isNaN(recordId)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  switch (method) {
    case 'GET':
      try {
        // Get a specific paperwork record from database
        const record = await prisma.paperwork.findUnique({
          where: { id: recordId }
        });
        
        if (!record) {
          return res.status(404).json({ message: 'Record not found' });
        }
        
        // Format dates for frontend consumption
        res.status(200).json({
          ...record,
          startDate: record.startDate.toISOString().split('T')[0],
          estimatedCompletion: record.estimatedCompletion.toISOString().split('T')[0],
        });
      } catch (error) {
        console.error('Error fetching paperwork record:', error);
        res.status(500).json({ error: 'Failed to fetch paperwork record' });
      }
      break;
      
    case 'PUT':
      try {
        const data = req.body;
        
        // Convert string dates to Date objects
        const paperworkData = {
          ...data,
          startDate: new Date(data.startDate),
          estimatedCompletion: new Date(data.estimatedCompletion),
          progress: parseInt(data.progress, 10)
        };
        
        // Update a paperwork record in database
        const updatedRecord = await prisma.paperwork.update({
          where: { id: recordId },
          data: paperworkData
        });
        
        // Format dates for response
        res.status(200).json({
          ...updatedRecord,
          startDate: updatedRecord.startDate.toISOString().split('T')[0],
          estimatedCompletion: updatedRecord.estimatedCompletion.toISOString().split('T')[0],
        });
      } catch (error) {
        console.error('Error updating paperwork record:', error);
        res.status(500).json({ error: 'Failed to update paperwork record' });
      }
      break;
      
    case 'DELETE':
      try {
        // Delete a paperwork record from database
        await prisma.paperwork.delete({
          where: { id: recordId }
        });
        
        res.status(200).json({ message: 'Record deleted successfully' });
      } catch (error) {
        console.error('Error deleting paperwork record:', error);
        res.status(500).json({ error: 'Failed to delete paperwork record' });
      }
      break;
      
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
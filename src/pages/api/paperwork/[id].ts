import type { NextApiRequest, NextApiResponse } from 'next';

// Mock database for paperwork records (same as in index.ts)
const paperworkData = [
  { 
    id: 1, 
    vehicleId: 'EV-025', 
    status: 'Purchase Documentation', 
    startDate: '2023-05-10', 
    estimatedCompletion: '2023-05-25',
    progress: 30,
    assignedTo: 'John Smith',
    nextStep: 'Vendor Payment Confirmation'
  },
  { 
    id: 2, 
    vehicleId: 'EV-026', 
    status: 'Registration', 
    startDate: '2023-05-05', 
    estimatedCompletion: '2023-05-20',
    progress: 65,
    assignedTo: 'Maria Garcia',
    nextStep: 'DMV Appointment'
  },
  { 
    id: 3, 
    vehicleId: 'EV-027', 
    status: 'Number Plate Issuance', 
    startDate: '2023-05-01', 
    estimatedCompletion: '2023-05-15',
    progress: 85,
    assignedTo: 'Robert Chen',
    nextStep: 'Plate Installation'
  },
  { 
    id: 4, 
    vehicleId: 'EV-028', 
    status: 'Final Inspection', 
    startDate: '2023-04-25', 
    estimatedCompletion: '2023-05-12',
    progress: 95,
    assignedTo: 'Sarah Johnson',
    nextStep: 'Fleet Onboarding'
  }
];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  const { id } = req.query;
  const recordId = parseInt(id as string);
  
  // Find the record by ID
  const recordIndex = paperworkData.findIndex(record => record.id === recordId);
  
  if (recordIndex === -1) {
    return res.status(404).json({ message: 'Record not found' });
  }

  switch (method) {
    case 'GET':
      // Get a specific paperwork record
      res.status(200).json(paperworkData[recordIndex]);
      break;
    case 'PUT':
      // Update a paperwork record
      const updatedRecord = {
        ...paperworkData[recordIndex],
        ...req.body,
        id: recordId // Ensure ID doesn't change
      };
      paperworkData[recordIndex] = updatedRecord;
      res.status(200).json(updatedRecord);
      break;
    case 'DELETE':
      // Delete a paperwork record
      paperworkData.splice(recordIndex, 1);
      res.status(200).json({ message: 'Record deleted successfully' });
      break;
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
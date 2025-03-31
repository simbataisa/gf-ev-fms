import type { NextApiRequest, NextApiResponse } from 'next';

// Mock database for paperwork records
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

  switch (method) {
    case 'GET':
      // Get all paperwork records
      res.status(200).json(paperworkData);
      break;
    case 'POST':
      // Create a new paperwork record
      const newRecord = {
        id: paperworkData.length + 1,
        ...req.body
      };
      paperworkData.push(newRecord);
      res.status(201).json(newRecord);
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
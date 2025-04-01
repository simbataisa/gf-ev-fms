import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const vehicleId = parseInt(id as string, 10);

  if (isNaN(vehicleId)) {
    return res.status(400).json({ error: 'Invalid vehicle ID' });
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { enabled } = req.body;

    if (typeof enabled !== 'boolean') {
      return res.status(400).json({ error: 'Invalid request body. "enabled" must be a boolean.' });
    }

    // In a real application, you would:
    // 1. Update the vehicle's charging status in the database
    // 2. Send a command to the actual vehicle via telematics
    
    // For now, we'll just simulate success
    res.status(200).json({ 
      success: true, 
      message: `Charging for vehicle ${vehicleId} has been ${enabled ? 'enabled' : 'disabled'}.`,
      vehicleId,
      chargingEnabled: enabled
    });
  } catch (error) {
    console.error(`Error ${req.body.enabled ? 'enabling' : 'disabling'} charging:`, error);
    res.status(500).json({ error: `Failed to ${req.body.enabled ? 'enable' : 'disable'} charging` });
  }
}
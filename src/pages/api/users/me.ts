import { NextApiRequest, NextApiResponse } from 'next';
import payload from 'payload';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const user = await payload.authenticate(req, res);
    
    if (!user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    res.status(200).json({ user });
  } catch (error: any) {
    console.error('Auth error:', error);
    res.status(401).json({ message: error.message || 'Not authenticated' });
  }
}
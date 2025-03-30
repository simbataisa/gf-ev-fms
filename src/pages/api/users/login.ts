import { NextApiRequest, NextApiResponse } from 'next';
import payload from 'payload';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const result = await payload.login({
      collection: 'users',
      data: {
        email,
        password,
      },
    });

    res.status(200).json({ user: result.user });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(401).json({ message: error.message || 'Invalid credentials' });
  }
}
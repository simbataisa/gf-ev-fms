import { NextApiRequest, NextApiResponse } from 'next';
import { NextApiHandler } from 'next';

// Middleware to validate HTTP methods
export function withMethods(methods: string[], handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    if (!methods.includes(req.method || '')) {
      res.setHeader('Allow', methods);
      return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
    
    return handler(req, res);
  };
}
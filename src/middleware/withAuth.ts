import { NextApiRequest, NextApiResponse } from 'next';
import { NextApiHandler } from 'next';

export interface AuthenticatedRequest extends NextApiRequest {
  user?: {
    id: string;
    role: string;
    email: string;
  };
}

// Middleware to handle authentication
export function withAuth(handler: NextApiHandler) {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    try {
      // Get token from request headers
      const token = req.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
      }
      
      // In a real app, you would verify the token here
      // For now, we'll mock a user
      const user = {
        id: 'user-1',
        role: 'admin',
        email: 'admin@example.com'
      };
      
      // Attach user to request
      req.user = user;
      
      // Call the original handler
      return handler(req, res);
    } catch (error) {
      console.error('Authentication error:', error);
      return res.status(401).json({ message: 'Authentication failed' });
    }
  };
}
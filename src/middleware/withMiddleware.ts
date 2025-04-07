import { NextApiRequest, NextApiResponse } from 'next';
import { NextApiHandler } from 'next';

// Helper to combine multiple middleware functions
export function withMiddleware(handler: NextApiHandler, ...middlewares: Array<(handler: NextApiHandler) => NextApiHandler>) {
  return middlewares.reduce((h, middleware) => middleware(h), handler);
}
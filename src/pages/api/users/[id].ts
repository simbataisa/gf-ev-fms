import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  
  try {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: {
        id: String(id)
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        phoneNumber: true,
        address: true,
        createdAt: true,
        updatedAt: true,
      }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (req.method === 'GET') {
      // Return the user
      return res.status(200).json(user);
    } else if (req.method === 'PATCH') {
      // Update the user
      const updatedUser = await prisma.user.update({
        where: {
          id: String(id)
        },
        data: req.body,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          phoneNumber: true,
          address: true,
          createdAt: true,
          updatedAt: true,
        }
      });
      
      return res.status(200).json(updatedUser);
    } else if (req.method === 'DELETE') {
      // Delete the user
      await prisma.user.delete({
        where: {
          id: String(id)
        }
      });
      
      return res.status(200).json({ message: 'User deleted successfully' });
    }
    
    // Method not allowed
    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Error handling user request:', error);
    return res.status(500).json({ message: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}
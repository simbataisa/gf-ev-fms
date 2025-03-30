import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  const { id } = req.query;
  const { password } = req.body;
  
  if (!password) {
    return res.status(400).json({ message: 'Password is required' });
  }
  
  try {
    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Update the user's password in the database
    const updatedUser = await prisma.user.update({
      where: {
        id: String(id)
      },
      data: {
        password: hashedPassword
      }
    });
    
    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    return res.status(500).json({ message: 'Failed to update password' });
  } finally {
    await prisma.$disconnect();
  }
}
import type { NextApiRequest, NextApiResponse } from 'next';
import { Notification } from '../../../types';
import { v4 as uuidv4 } from 'uuid';

// Mock data
let mockNotifications: Notification[] = [];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    // Get notifications for a user
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    const userNotifications = mockNotifications.filter(
      notification => notification.userId === userId
    );
    
    return res.status(200).json(userNotifications);
  } else if (req.method === 'POST') {
    // Create a new notification
    const { userId, title, message, type, relatedTo } = req.body;
    
    if (!userId || !title || !message) {
      return res.status(400).json({ message: 'User ID, title, and message are required' });
    }
    
    const newNotification: Notification = {
      id: uuidv4(),
      userId,
      title,
      message,
      type: type || 'info',
      read: false,
      createdAt: new Date(),
      relatedTo
    };
    
    mockNotifications.push(newNotification);
    
    return res.status(201).json(newNotification);
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
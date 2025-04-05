import type { NextApiRequest, NextApiResponse } from 'next';
import { Order, Task } from '../../../../types';
import { v4 as uuidv4 } from 'uuid';

// Mock data
let mockOrders: Order[] = []; // Assume this is populated
let mockTasks: Task[] = []; // Assume this is populated

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const { driverId, orderType } = req.body;

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Find the order
    const orderIndex = mockOrders.findIndex(order => order.id === id);
    if (orderIndex === -1) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const order = mockOrders[orderIndex];
    const scheduledTime = new Date(order.scheduledTime);
    const tasks: Task[] = [];

    // Create tasks based on order type
    if (orderType === 'delivery') {
      // Task 1: Pick up vehicle
      tasks.push({
        id: uuidv4(),
        title: 'Pick up vehicle',
        description: `Pick up ${order.carModel} from the depot`,
        status: 'pending',
        orderId: order.id,
        driverId,
        dueDate: new Date(scheduledTime.getTime() - 60 * 60 * 1000) // 1 hour before delivery
      });

      // Task 2: Deliver to customer
      tasks.push({
        id: uuidv4(),
        title: 'Deliver to customer',
        description: `Deliver ${order.carModel} to ${order.customerName} at ${order.address}`,
        status: 'pending',
        orderId: order.id,
        driverId,
        dueDate: scheduledTime
      });

      // Task 3: Get documents signed
      tasks.push({
        id: uuidv4(),
        title: 'Get documents signed',
        description: 'Have customer sign delivery documents and explain vehicle features',
        status: 'pending',
        orderId: order.id,
        driverId,
        dueDate: new Date(scheduledTime.getTime() + 15 * 60 * 1000) // 15 minutes after delivery
      });

      // Task 4: Collect payment if needed
      if (order.paymentStatus === 'to_be_collected') {
        tasks.push({
          id: uuidv4(),
          title: 'Collect payment',
          description: `Collect payment of ${order.paymentAmount} VND from customer`,
          status: 'pending',
          orderId: order.id,
          driverId,
          dueDate: new Date(scheduledTime.getTime() + 30 * 60 * 1000) // 30 minutes after delivery
        });
      }
    } else if (orderType === 'pickup') {
      // Task 1: Meet customer
      tasks.push({
        id: uuidv4(),
        title: 'Meet customer',
        description: `Meet ${order.customerName} at ${order.address}`,
        status: 'pending',
        orderId: order.id,
        driverId,
        dueDate: scheduledTime
      });

      // Task 2: Inspect vehicle
      tasks.push({
        id: uuidv4(),
        title: 'Inspect vehicle',
        description: 'Inspect vehicle condition and document any issues',
        status: 'pending',
        orderId: order.id,
        driverId,
        dueDate: new Date(scheduledTime.getTime() + 15 * 60 * 1000) // 15 minutes after meeting
      });

      // Task 3: Get documents signed
      tasks.push({
        id: uuidv4(),
        title: 'Get documents signed',
        description: 'Have customer sign pickup documents',
        status: 'pending',
        orderId: order.id,
        driverId,
        dueDate: new Date(scheduledTime.getTime() + 30 * 60 * 1000) // 30 minutes after meeting
      });

      // Task 4: Return vehicle to depot
      tasks.push({
        id: uuidv4(),
        title: 'Return vehicle to depot',
        description: `Return ${order.carModel} to the depot`,
        status: 'pending',
        orderId: order.id,
        driverId,
        dueDate: new Date(scheduledTime.getTime() + 90 * 60 * 1000) // 1.5 hours after meeting
      });
    } else if (orderType === 'chauffeur') {
      // Task 1: Pick up vehicle
      tasks.push({
        id: uuidv4(),
        title: 'Pick up vehicle',
        description: `Pick up ${order.carModel} from the depot`,
        status: 'pending',
        orderId: order.id,
        driverId,
        dueDate: new Date(scheduledTime.getTime() - 60 * 60 * 1000) // 1 hour before service
      });

      // Task 2: Pick up customer
      tasks.push({
        id: uuidv4(),
        title: 'Pick up customer',
        description: `Pick up ${order.customerName} at ${order.address}`,
        status: 'pending',
        orderId: order.id,
        driverId,
        dueDate: scheduledTime
      });

      // Task 3: Provide chauffeur service
      tasks.push({
        id: uuidv4(),
        title: 'Provide chauffeur service',
        description: 'Drive customer to their destinations as requested',
        status: 'pending',
        orderId: order.id,
        driverId,
        dueDate: new Date(scheduledTime.getTime() + 4 * 60 * 60 * 1000) // 4 hours after pickup
      });

      // Task 4: Complete service
      tasks.push({
        id: uuidv4(),
        title: 'Complete service',
        description: 'Return customer to original location and complete service',
        status: 'pending',
        orderId: order.id,
        driverId,
        dueDate: new Date(scheduledTime.getTime() + 5 * 60 * 60 * 1000) // 5 hours after pickup
      });

      // Task 5: Collect payment if needed
      if (order.paymentStatus === 'to_be_collected') {
        tasks.push({
          id: uuidv4(),
          title: 'Collect payment',
          description: `Collect payment of ${order.paymentAmount} VND from customer`,
          status: 'pending',
          orderId: order.id,
          driverId,
          dueDate: new Date(scheduledTime.getTime() + 5 * 60 * 60 * 1000 + 15 * 60 * 1000) // 15 minutes after service completion
        });
      }
    }

    // Add tasks to mock data
    mockTasks = [...mockTasks, ...tasks];

    // Update order with tasks
    mockOrders[orderIndex] = {
      ...mockOrders[orderIndex],
      tasks
    };

    return res.status(200).json({ 
      message: 'Tasks created successfully',
      tasks
    });
  } catch (error) {
    console.error('Error creating tasks:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
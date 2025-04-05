import type { NextApiRequest, NextApiResponse } from 'next';
import { Task } from '../../../types';

// Mock data for demonstration
const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Pick up vehicle',
    description: 'Pick up the vehicle from the depot',
    status: 'completed',
    orderId: '1',
    driverId: '1',
    dueDate: new Date(2023, 5, 15, 9, 0, 0),
    completedDate: new Date(2023, 5, 15, 9, 15, 0)
  },
  // ... other tasks
];

// In-memory store for tasks
let tasks = [...mockTasks];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const { method } = req;
  
  // Find the task by ID
  const taskIndex = tasks.findIndex(task => task.id === id);
  
  if (taskIndex === -1) {
    return res.status(404).json({ message: 'Task not found' });
  }

  switch (method) {
    case 'GET':
      // Return the task
      return res.status(200).json(tasks[taskIndex]);

    case 'PUT':
      // Update the task
      const updatedTask = { 
        ...tasks[taskIndex], 
        ...req.body,
        dueDate: tasks[taskIndex].dueDate, // Preserve original due date
        completedDate: req.body.status === 'completed' ? new Date() : req.body.completedDate
      };
      tasks[taskIndex] = updatedTask;
      return res.status(200).json(updatedTask);

    default:
      res.setHeader('Allow', ['GET', 'PUT']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
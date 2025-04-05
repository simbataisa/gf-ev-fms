import { Task } from '../types';

// Initial mock tasks
export const mockTasks: Task[] = [
  {
    id: 'task-001',
    title: 'Initial vehicle inspection',
    description: 'Perform initial inspection of VF 8 before delivery',
    status: 'completed',
    orderId: '1',
    driverId: null,
    dueDate: new Date(2023, 5, 14, 15, 0, 0),
    completed: true,
    notes: 'Vehicle in excellent condition',
    createdAt: new Date(2023, 5, 14, 9, 0, 0),
    updatedAt: new Date(2023, 5, 14, 15, 30, 0)
  },
  {
    id: 'task-002',
    title: 'Charge vehicle',
    description: 'Charge VF 9 to 100% before customer pickup',
    status: 'completed',
    orderId: '2',
    driverId: '1',
    dueDate: new Date(2023, 5, 16, 10, 0, 0),
    completed: true,
    notes: 'Charged to 100%',
    createdAt: new Date(2023, 5, 15, 14, 0, 0),
    updatedAt: new Date(2023, 5, 16, 10, 15, 0)
  },
  {
    id: 'task-003',
    title: 'Prepare documentation',
    description: 'Prepare delivery documents for VF 5',
    status: 'in_progress',
    orderId: '3',
    driverId: null,
    dueDate: new Date(2023, 5, 17, 8, 0, 0),
    completed: false,
    notes: 'Waiting for final approval',
    createdAt: new Date(2023, 5, 16, 13, 0, 0),
    updatedAt: new Date(2023, 5, 16, 16, 45, 0)
  }
];

// Create a mutable copy for API operations
export let tasks = [...mockTasks];

// Helper function to reset tasks to initial state
export const resetTasks = () => {
  tasks = [...mockTasks];
  return tasks;
};
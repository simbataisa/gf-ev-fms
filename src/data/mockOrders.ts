import { Order, ExtraFee, Task } from '../types/index';

// Mock data for demonstration
export const mockOrders: Order[] = [
  {
    id: '1',
    customerName: 'Nguyễn Thanh Tùng',
    customerPhone: '0912-345-678',
    customerEmail: 'thanhtung@example.com',
    address: '123 Lê Lợi, Quận 1, TP.HCM',
    orderType: 'delivery',
    scheduledTime: new Date(2023, 5, 15, 10, 0, 0),
    carModel: 'VF 8',
    status: 'pending',
    driverId: null,
    vehicleId: null,
    paymentStatus: 'pending',
    paymentAmount: 1500000,
    extraFees: [
      {
        id: 'fee-1',
        description: 'Delivery fee',
        amount: 200000,
        status: 'pending',
        createdAt: new Date(2023, 5, 14)
      }
    ],
    tasks: []
  },
  {
    id: '2',
    customerName: 'Trần Thị Mai Hương',
    customerPhone: '0987-654-321',
    customerEmail: 'maihuong@example.com',
    address: '456 Nguyễn Huệ, Quận 1, TP.HCM',
    orderType: 'pickup',
    scheduledTime: new Date(2023, 5, 16, 14, 0, 0),
    carModel: 'VF 9',
    status: 'assigned',
    driverId: '1',
    vehicleId: '3',
    paymentStatus: 'paid',
    paymentAmount: 2000000,
    extraFees: [],
    tasks: [
      {
        id: 'task-1',
        title: 'Vehicle Pickup',
        description: 'Pick up vehicle from customer',
        status: 'pending',
        orderId: '2',
        driverId: '1',
        dueDate: new Date(2023, 5, 16, 14, 0, 0),
        completed: false,
        notes: 'Contact customer before arrival',
        createdAt: new Date(2023, 5, 15),
        updatedAt: new Date(2023, 5, 15)
      }
    ]
  },
  {
    id: '3',
    customerName: 'Phạm Văn Đức',
    customerPhone: '0909-123-456',
    customerEmail: 'vanduc@example.com',
    address: '789 Điện Biên Phủ, Quận 3, TP.HCM',
    orderType: 'delivery',
    scheduledTime: new Date(2023, 5, 17, 9, 30, 0),
    carModel: 'VF 5',
    status: 'pending',
    driverId: null,
    vehicleId: null,
    paymentStatus: 'pending',
    paymentAmount: 1200000,
    extraFees: [],
    tasks: []
  },
  {
    id: '4',
    customerName: 'Lê Thị Hồng Nhung',
    customerPhone: '0918-765-432',
    customerEmail: 'hongnhung@example.com',
    address: '321 Võ Văn Tần, Quận 3, TP.HCM',
    orderType: 'pickup',
    scheduledTime: new Date(2023, 5, 18, 16, 45, 0),
    carModel: 'VF e34',
    status: 'completed',
    driverId: '2',
    vehicleId: '5',
    paymentStatus: 'paid',
    paymentAmount: 1800000,
    extraFees: [
      {
        id: 'fee-2',
        description: 'Cleaning fee',
        amount: 150000,
        status: 'paid',
        createdAt: new Date(2023, 5, 17)
      },
      {
        id: 'fee-3',
        description: 'Late return fee',
        amount: 300000,
        status: 'paid',
        createdAt: new Date(2023, 5, 18)
      }
    ],
    tasks: [
      {
        id: 'task-2',
        title: 'Vehicle Pickup',
        description: 'Pick up vehicle from customer',
        status: 'completed',
        orderId: '4',
        driverId: '2',
        dueDate: new Date(2023, 5, 18, 16, 45, 0),
        completed: true,
        notes: 'Completed on time',
        createdAt: new Date(2023, 5, 17),
        updatedAt: new Date(2023, 5, 18, 16, 45, 0)
      },
      {
        id: 'task-3',
        title: 'Vehicle Inspection',
        description: 'Inspect vehicle condition',
        status: 'completed',
        orderId: '4',
        driverId: '2',
        dueDate: new Date(2023, 5, 18, 17, 30, 0),
        completed: true,
        notes: 'Minor scratches on rear bumper',
        createdAt: new Date(2023, 5, 17),
        updatedAt: new Date(2023, 5, 18, 17, 15, 0)
      }
    ]
  },
  {
    id: '5',
    customerName: 'Hoàng Minh Tuấn',
    customerPhone: '0933-222-111',
    customerEmail: 'minhtuan@example.com',
    address: '567 Cách Mạng Tháng 8, Quận 10, TP.HCM',
    orderType: 'delivery',
    scheduledTime: new Date(2023, 5, 15, 14, 30, 0),
    carModel: 'VF 7',
    status: 'assigned',
    driverId: '4',
    vehicleId: '2',
    paymentStatus: 'pending',
    paymentAmount: 1700000,
    extraFees: [
      {
        id: 'fee-4',
        description: 'Express delivery',
        amount: 250000,
        status: 'pending',
        createdAt: new Date(2023, 5, 14)
      }
    ],
    tasks: [
      {
        id: 'task-4',
        title: 'Vehicle Preparation',
        description: 'Prepare vehicle for delivery',
        status: 'completed',
        orderId: '5',
        driverId: '4',
        dueDate: new Date(2023, 5, 15, 10, 0, 0),
        completed: true,
        notes: 'Vehicle fully charged and cleaned',
        createdAt: new Date(2023, 5, 14),
        updatedAt: new Date(2023, 5, 15, 10, 0, 0)
      },
      {
        id: 'task-5',
        title: 'Vehicle Delivery',
        description: 'Deliver vehicle to customer',
        status: 'in_progress',
        orderId: '5',
        driverId: '4',
        dueDate: new Date(2023, 5, 15, 14, 30, 0),
        completed: false,
        notes: 'On the way to customer location',
        createdAt: new Date(2023, 5, 14),
        updatedAt: new Date(2023, 5, 15, 12, 0, 0)
      }
    ]
  }
];

// Create a mutable copy for API operations
export let orders = [...mockOrders];

// Helper function to reset orders to initial state (useful for testing)
export const resetOrders = () => {
  orders = [...mockOrders];
  return orders;
};
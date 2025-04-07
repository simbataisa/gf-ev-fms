import React from 'react';
import { Table, Button, Space, Tag } from 'antd';
import { useRouter } from 'next/router';
import { Order, Driver } from '../../types';

interface OrderTableProps {
  orders: Order[];
  drivers: Driver[];
  onAssignDriver: (order: Order) => void;
}

const OrderTable: React.FC<OrderTableProps> = ({ orders, drivers, onAssignDriver }) => {
  const router = useRouter();

  const getDriverName = (driverId: string | null) => {
    if (!driverId) return 'Not assigned';
    const driver = drivers.find(d => d.id === driverId);
    return driver ? driver.name : 'Unknown driver';
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Customer',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Type',
      dataIndex: 'orderType',
      key: 'orderType',
      render: (type: string) => type === 'delivery' ? 'Delivery' : 'Pickup',
    },
    {
      title: 'Car Model',
      dataIndex: 'carModel',
      key: 'carModel',
    },
    {
      title: 'Scheduled Time',
      dataIndex: 'scheduledTime',
      key: 'scheduledTime',
      render: (time: Date) => time.toLocaleString(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'blue';
        if (status === 'assigned') color = 'orange';
        if (status === 'completed') color = 'green';
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Driver',
      dataIndex: 'driverId',
      key: 'driverId',
      render: (driverId: string | null) => getDriverName(driverId),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Order) => (
        <Space>
          <Button 
            size="small"
            onClick={() => router.push(`/orders/${record.id}`)}
          >
            View Details
          </Button>
          {record.status === 'pending' && (
            <Button 
              type="primary" 
              size="small"
              onClick={() => onAssignDriver(record)}
            >
              Assign Driver
            </Button>
          )}
          {record.status === 'assigned' && (
            <Button 
              type="primary" 
              size="small"
              danger
              onClick={() => onAssignDriver(record)}
            >
              Re-assign Driver
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Table 
      columns={columns} 
      dataSource={orders} 
      rowKey="id" 
      pagination={{ pageSize: 10 }}
    />
  );
};

export default OrderTable;
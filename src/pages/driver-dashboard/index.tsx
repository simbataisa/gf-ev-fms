import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Card, 
  Tabs, 
  List, 
  Tag, 
  Space, 
  Button, 
  Calendar, 
  Badge, 
  Modal, 
  Steps, 
  Form, 
  Input, 
  Checkbox,
  Row,
  Col,
  Statistic,
  Avatar,
  notification
} from 'antd';
import { 
  CarOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  DollarOutlined,
  UserOutlined,
  CalendarOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import moment from 'moment';
import AppLayout from '../../components/Layout';
import { Order, Task } from '../../types';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Step } = Steps;

const DriverDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('today');
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [taskModalVisible, setTaskModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(moment());
  const [form] = Form.useForm();

  useEffect(() => {
    // Fetch driver's orders
    const fetchDriverOrders = async () => {
      try {
        // In a real app, you would get the current driver's ID from auth context
        const driverId = '1'; // Mock driver ID
        const response = await fetch(`/api/drivers/${driverId}/orders`);
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        notification.error({
          message: 'Error',
          description: 'Failed to load your assignments'
        });
      }
    };

    fetchDriverOrders();
  }, []);

  const getOrdersForPeriod = (period: 'today' | 'week' | 'month') => {
    const today = moment().startOf('day');
    
    return orders.filter(order => {
      const orderDate = moment(order.scheduledTime);
      
      if (period === 'today') {
        return orderDate.isSame(today, 'day');
      } else if (period === 'week') {
        return orderDate.isSame(today, 'week');
      } else if (period === 'month') {
        return orderDate.isSame(today, 'month');
      }
      
      return false;
    });
  };

  const handleViewTasks = (order: Order) => {
    setSelectedOrder(order);
    setTaskModalVisible(true);
  };

  const handleTaskComplete = async (task: Task) => {
    try {
      // Update task status
      await fetch(`/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'completed',
          completedDate: new Date()
        }),
      });

      // Update local state
      if (selectedOrder) {
        const updatedTasks = selectedOrder.tasks.map(t => 
          t.id === task.id ? { ...t, status: 'completed' as const, completedDate: new Date() } : t
        );
        
        setSelectedOrder({
          ...selectedOrder,
          tasks: updatedTasks
        });
      }

      notification.success({
        message: 'Task Completed',
        description: 'Task has been marked as completed'
      });
    } catch (error) {
      console.error('Error completing task:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to complete task'
      });
    }
  };

  const handleCollectPayment = async () => {
    if (!selectedOrder) return;
    
    form.validateFields().then(async (values) => {
      try {
        // Update payment status
        await fetch(`/api/orders/${selectedOrder.id}/payment`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentStatus: 'paid',
            amountCollected: values.amountCollected,
            paymentMethod: values.paymentMethod,
            notes: values.notes
          }),
        });

        // Update local state
        setSelectedOrder({
          ...selectedOrder,
          paymentStatus: 'paid'
        });

        notification.success({
          message: 'Payment Collected',
          description: 'Payment has been recorded successfully'
        });
      } catch (error) {
        console.error('Error recording payment:', error);
        notification.error({
          message: 'Error',
          description: 'Failed to record payment'
        });
      }
    });
  };

  const dateCellRender = (date: moment.Moment) => {
    const ordersForDate = orders.filter(order => 
      moment(order.scheduledTime).isSame(date, 'day')
    );

    return (
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {ordersForDate.map(order => {
          let color = 'blue';
          if (order.status === 'in_progress') color = 'orange';
          if (order.status === 'completed') color = 'green';
          
          return (
            <li key={order.id} style={{ marginBottom: 3 }}>
              <Badge 
                color={color} 
                text={
                  <span style={{ fontSize: '0.8em' }}>
                    {moment(order.scheduledTime).format('HH:mm')} - {order.customerName.split(' ')[0]}
                  </span>
                } 
              />
            </li>
          );
        })}
      </ul>
    );
  };

  const renderOrderList = (orders: Order[]) => (
    <List
      itemLayout="vertical"
      dataSource={orders}
      renderItem={order => (
        <List.Item
          key={order.id}
          actions={[
            <Button 
              key="view" 
              type="primary" 
              onClick={() => handleViewTasks(order)}
            >
              View Tasks
            </Button>
          ]}
        >
          <List.Item.Meta
            avatar={<Avatar icon={<CarOutlined />} style={{ backgroundColor: '#1890ff' }} />}
            title={
              <Space>
                <Text strong>{order.carModel}</Text>
                <Tag color={
                  order.status === 'assigned' ? 'blue' : 
                  order.status === 'in_progress' ? 'orange' : 
                  order.status === 'completed' ? 'green' : 'default'
                }>
                  {order.status.toUpperCase()}
                </Tag>
              </Space>
            }
            description={`${order.orderType === 'delivery' ? 'Delivery to' : order.orderType === 'pickup' ? 'Pickup from' : 'Chauffeur service for'} ${order.customerName}`}
          />
          <Row gutter={16}>
            <Col span={12}>
              <Space direction="vertical">
                <Text><ClockCircleOutlined /> {moment(order.scheduledTime).format('MMM DD, YYYY HH:mm')}</Text>
                <Text><UserOutlined /> {order.customerPhone}</Text>
              </Space>
            </Col>
            <Col span={12}>
              <Space direction="vertical">
                <Text>Address: {order.address}</Text>
                <Text>
                  <DollarOutlined /> Payment: 
                  <Tag color={
                    order.paymentStatus === 'paid' ? 'green' : 
                    order.paymentStatus === 'to_be_collected' ? 'red' : 'orange'
                  }>
                    {order.paymentStatus === 'paid' ? 'PAID' : 
                     order.paymentStatus === 'to_be_collected' ? 'COLLECT PAYMENT' : 'PENDING'}
                  </Tag>
                </Text>
              </Space>
            </Col>
          </Row>
        </List.Item>
      )}
    />
  );

  return (
    <AppLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={2}>Driver Dashboard</Title>
      </div>

      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Today's Assignments"
              value={getOrdersForPeriod('today').length}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Completed Tasks"
              value={orders.filter(o => o.status === 'completed').length}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Pending Collections"
              value={orders.filter(o => o.paymentStatus === 'to_be_collected').length}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Assignments"
              value={orders.length}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card style={{ marginTop: 16 }}>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="Today" key="today">
            {renderOrderList(getOrdersForPeriod('today'))}
          </TabPane>
          <TabPane tab="This Week" key="week">
            {renderOrderList(getOrdersForPeriod('week'))}
          </TabPane>
          <TabPane tab="This Month" key="month">
            {renderOrderList(getOrdersForPeriod('month'))}
          </TabPane>
          <TabPane tab="Calendar View" key="calendar">
            <Calendar dateCellRender={dateCellRender} />
          </TabPane>
        </Tabs>
      </Card>

      <Modal
        title={`Tasks for ${selectedOrder?.carModel || ''}`}
        visible={taskModalVisible}
        onCancel={() => setTaskModalVisible(false)}
        footer={null}
        width={700}
      >
        {selectedOrder && (
          <>
            <Card style={{ marginBottom: 16 }}>
              <Row gutter={16}>
                <Col span={12}>
                  <Text strong>Customer:</Text> {selectedOrder.customerName}<br />
                  <Text strong>Phone:</Text> {selectedOrder.customerPhone}<br />
                  <Text strong>Email:</Text> {selectedOrder.customerEmail}
                </Col>
                <Col span={12}>
                  <Text strong>Address:</Text> {selectedOrder.address}<br />
                  <Text strong>Scheduled Time:</Text> {moment(selectedOrder.scheduledTime).format('MMM DD, YYYY HH:mm')}<br />
                  <Text strong>Order Type:</Text> {selectedOrder.orderType}
                </Col>
              </Row>
            </Card>

            <Steps direction="vertical" current={selectedOrder.tasks.filter(t => t.status === 'completed').length}>
              {selectedOrder.tasks.map(task => (
                <Step 
                  key={task.id}
                  title={task.title}
                  description={
                    <div>
                      <p>{task.description}</p>
                      {task.status !== 'completed' && (
                        <Button 
                          type="primary" 
                          size="small" 
                          onClick={() => handleTaskComplete(task)}
                        >
                          Mark as Completed
                        </Button>
                      )}
                      {task.completedDate && (
                        <Text type="secondary">
                          Completed on {moment(task.completedDate).format('MMM DD, YYYY HH:mm')}
                        </Text>
                      )}
                    </div>
                  }
                  status={
                    task.status === 'completed' ? 'finish' :
                    task.status === 'in_progress' ? 'process' :
                    task.status === 'cancelled' ? 'error' : 'wait'
                  }
                />
              ))}
            </Steps>

            {selectedOrder.paymentStatus === 'to_be_collected' && (
              <Card title="Payment Collection" style={{ marginTop: 16 }}>
                <Form form={form} layout="vertical" onFinish={handleCollectPayment}>
                  <Form.Item
                    name="amountCollected"
                    label="Amount Collected"
                    rules={[{ required: true, message: 'Please enter the amount collected' }]}
                    initialValue={selectedOrder.paymentAmount}
                  >
                    <Input prefix="$" type="number" />
                  </Form.Item>
                  
                  <Form.Item
                    name="paymentMethod"
                    label="Payment Method"
                    rules={[{ required: true, message: 'Please select payment method' }]}
                  >
                    <Input />
                  </Form.Item>
                  
                  <Form.Item name="notes" label="Notes">
                    <Input.TextArea rows={2} />
                  </Form.Item>
                  
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Record Payment
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            )}
          </>
        )}
      </Modal>
    </AppLayout>
  );
};

export default DriverDashboard;
import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Card, 
  Descriptions, 
  Tag, 
  Button, 
  Space, 
  Divider, 
  Row, 
  Col, 
  Statistic, 
  Timeline,
  List,
  Modal,
  Form,
  Input,
  InputNumber,
  message
} from 'antd';
import { 
  CarOutlined, 
  UserOutlined, 
  DollarOutlined, 
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  EditOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/router';
import AppLayout from '../../components/Layout';
import { Order, PaymentStatus, Task } from '../../types';
import moment from 'moment';

const { Title, Text } = Typography;

const OrderDetailsPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [addFeeModalVisible, setAddFeeModalVisible] = useState(false);
  const [feeForm] = Form.useForm();

  useEffect(() => {
    if (id) {
      fetchOrderDetails();
    }
  }, [id]);

  const fetchOrderDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/orders/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setOrder(data);
    } catch (error) {
      console.error('Error fetching order details:', error);
      message.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentStatusUpdate = async (newStatus: PaymentStatus) => {
    if (!order) return;
    
    try {
      const response = await fetch(`/api/orders/${id}/payment-status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentStatus: newStatus }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      // Update local state
      setOrder({
        ...order,
        paymentStatus: newStatus
      });
      
      message.success(`Payment status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating payment status:', error);
      message.error('Failed to update payment status');
    }
  };

  const showAddFeeModal = () => {
    feeForm.resetFields();
    setAddFeeModalVisible(true);
  };

  const handleAddFee = async () => {
    try {
      const values = await feeForm.validateFields();
      
      const response = await fetch(`/api/orders/${id}/extra-fees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: values.description,
          amount: values.amount
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      // Refresh order data
      fetchOrderDetails();
      setAddFeeModalVisible(false);
      message.success('Extra fee added successfully');
    } catch (error) {
      console.error('Error adding extra fee:', error);
      message.error('Failed to add extra fee');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'blue';
      case 'assigned': return 'orange';
      case 'in-progress': return 'purple';
      case 'completed': return 'green';
      case 'cancelled': return 'red';
      default: return 'default';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'green';
      case 'pending': return 'orange';
      case 'refunded': return 'blue';
      default: return 'default';
    }
  };

  const calculateTotalAmount = () => {
    if (!order) return 0;
    
    const extraFeesTotal = order.extraFees.reduce((sum, fee) => sum + fee.amount, 0);
    return order.paymentAmount + extraFeesTotal;
  };

  if (loading) {
    return (
      <AppLayout>
        <Card loading={true}>
          <Title level={2}>Order Details</Title>
        </Card>
      </AppLayout>
    );
  }

  if (!order) {
    return (
      <AppLayout>
        <Card>
          <Title level={2}>Order Not Found</Title>
          <Text>The order you are looking for does not exist or has been removed.</Text>
          <div style={{ marginTop: 16 }}>
            <Button type="primary" onClick={() => router.push('/orders')}>
              Back to Orders
            </Button>
          </div>
        </Card>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div style={{ marginBottom: 16 }}>
        <Button onClick={() => router.push('/orders')}>
          Back to Orders
        </Button>
      </div>
      
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <Title level={2} style={{ margin: 0 }}>Order #{order.id}</Title>
          <Tag color={getStatusColor(order.status)} style={{ fontSize: 16, padding: '4px 8px' }}>
            {order.status.toUpperCase()}
          </Tag>
        </div>
        
        <Row gutter={[24, 24]}>
          <Col span={16}>
            <Card title={<><UserOutlined /> Customer Information</>} bordered={false}>
              <Descriptions column={2}>
                <Descriptions.Item label="Name">{order.customerName}</Descriptions.Item>
                <Descriptions.Item label="Phone">{order.customerPhone}</Descriptions.Item>
                <Descriptions.Item label="Email">{order.customerEmail}</Descriptions.Item>
                <Descriptions.Item label="Address">{order.address}</Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
          
          <Col span={8}>
            <Card title={<><ClockCircleOutlined /> Schedule</>} bordered={false}>
              <Descriptions column={1}>
                <Descriptions.Item label="Order Type">
                  {order.orderType === 'delivery' ? 'Delivery' : 'Pickup'}
                </Descriptions.Item>
                <Descriptions.Item label="Scheduled Time">
                  {moment(order.scheduledTime).format('MMMM D, YYYY h:mm A')}
                </Descriptions.Item>
                <Descriptions.Item label="Car Model">
                  {order.carModel}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
        </Row>
        
        <Divider />
        
        <Row gutter={[24, 24]}>
          <Col span={16}>
            <Card 
              title={<><DollarOutlined /> Payment Information</>} 
              bordered={false}
              extra={
                <Space>
                  <Button 
                    type="primary" 
                    onClick={() => handlePaymentStatusUpdate('paid')}
                    disabled={order.paymentStatus === 'paid'}
                  >
                    Mark as Paid
                  </Button>
                  <Button 
                    onClick={() => handlePaymentStatusUpdate('pending')}
                    disabled={order.paymentStatus === 'pending'}
                  >
                    Mark as Pending
                  </Button>
                  <Button 
                    onClick={() => handlePaymentStatusUpdate('refunded')}
                    disabled={order.paymentStatus === 'refunded'}
                  >
                    Mark as Refunded
                  </Button>
                </Space>
              }
            >
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Statistic 
                    title="Payment Status" 
                    value={order.paymentStatus.toUpperCase()} 
                    valueStyle={{ color: getPaymentStatusColor(order.paymentStatus) }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic 
                    title="Vehicle Fee" 
                    value={order.paymentAmount} 
                    prefix="$" 
                  />
                </Col>
                <Col span={8}>
                  <Statistic 
                    title="Total Amount" 
                    value={calculateTotalAmount()} 
                    prefix="$" 
                  />
                </Col>
              </Row>
              
              <Divider orientation="left">Extra Fees</Divider>
              
              {order.extraFees.length === 0 ? (
                <Text type="secondary">No extra fees</Text>
              ) : (
                <List
                  dataSource={order.extraFees}
                  renderItem={fee => (
                    <List.Item
                      key={fee.id}
                      extra={<Text strong>${fee.amount}</Text>}
                    >
                      <List.Item.Meta
                        title={fee.description}
                        description={fee.createdAt ? moment(fee.createdAt).format('MMMM D, YYYY') : 'N/A'}
                      />
                    </List.Item>
                  )}
                />
              )}
              
              <div style={{ marginTop: 16, textAlign: 'right' }}>
                <Button 
                  type="dashed" 
                  icon={<PlusOutlined />} 
                  onClick={showAddFeeModal}
                >
                  Add Extra Fee
                </Button>
              </div>
            </Card>
          </Col>
          
          <Col span={8}>
            <Card title={<><CarOutlined /> Assignment</>} bordered={false}>
              <Descriptions column={1}>
                <Descriptions.Item label="Driver">
                  {order.driverId ? (
                    <Text strong>{order.driverId}</Text>
                  ) : (
                    <Tag color="red">Not Assigned</Tag>
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Vehicle">
                  {order.vehicleId ? (
                    <Text strong>{order.vehicleId}</Text>
                  ) : (
                    <Tag color="red">Not Assigned</Tag>
                  )}
                </Descriptions.Item>
              </Descriptions>
              
              {(!order.driverId || !order.vehicleId) && (
                <div style={{ marginTop: 16 }}>
                  <Button 
                    type="primary" 
                    onClick={() => router.push(`/orders/assign?id=${order.id}`)}
                  >
                    {order.driverId || order.vehicleId ? 'Reassign' : 'Assign'} Driver & Vehicle
                  </Button>
                </div>
              )}
            </Card>
            
            <Card title="Tasks" style={{ marginTop: 24 }} bordered={false}>
              {order.tasks && order.tasks.length > 0 ? (
                <Timeline>
                  {order.tasks.map((task: Task, index: number) => (
                    <Timeline.Item 
                      key={task.id || index}
                      color={task.completed ? 'green' : 'blue'}
                      dot={task.completed ? <CheckCircleOutlined /> : undefined}
                    >
                      <div>
                        <Text strong>{task.description}</Text>
                        <div>
                          <Text type="secondary">
                            {task.completed 
                              ? `Completed: ${moment(task.updatedAt).format('MMM D, h:mm A')}` 
                              : 'Pending'}
                          </Text>
                        </div>
                      </div>
                    </Timeline.Item>
                  ))}
                </Timeline>
              ) : (
                <Text type="secondary">No tasks assigned yet</Text>
              )}
            </Card>
          </Col>
        </Row>
      </Card>
      
      {/* Modal for adding extra fees */}
      <Modal
        title="Add Extra Fee"
        visible={addFeeModalVisible}
        onCancel={() => setAddFeeModalVisible(false)}
        onOk={handleAddFee}
      >
        <Form form={feeForm} layout="vertical">
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter a description' }]}
          >
            <Input placeholder="e.g., Additional cleaning fee" />
          </Form.Item>
          
          <Form.Item
            name="amount"
            label="Amount ($)"
            rules={[{ required: true, message: 'Please enter an amount' }]}
          >
            <InputNumber 
              min={0} 
              precision={2} 
              style={{ width: '100%' }} 
              placeholder="0.00"
            />
          </Form.Item>
        </Form>
      </Modal>
    </AppLayout>
  );
};

export default OrderDetailsPage;
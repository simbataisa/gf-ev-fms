import React, { useState, useEffect } from 'react';
import { 
  Form, 
  Select, 
  Button, 
  Card, 
  Typography, 
  Divider, 
  Steps, 
  message,
  Row,
  Col,
  Space,
  Tag
} from 'antd';
import { useRouter } from 'next/router';
import AppLayout from '../../components/Layout';
import { Order, Driver, Vehicle } from '../../types';

const { Title, Text } = Typography;
const { Option } = Select;
const { Step } = Steps;

const AssignOrderPage: React.FC = () => {
  const [order, setOrder] = useState<Order | null>(null);
  const [availableVehicles, setAvailableVehicles] = useState<Vehicle[]>([]); // Ensure it's initialized as an empty array
  const [availableDrivers, setAvailableDrivers] = useState<Driver[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [vehicleForm] = Form.useForm();
  const [driverForm] = Form.useForm();
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id) return;

    // Fetch order details
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${id}`);
        const data = await response.json();
        setOrder(data);
      } catch (error) {
        console.error('Error fetching order:', error);
        message.error('Failed to load order details');
      }
    };

    // Fetch available vehicles
    const fetchVehicles = async () => {
      try {
        // Make sure we're using the correct API endpoint with status filter
        const response = await fetch('/api/vehicles?status=available');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetched vehicles:', data); // Debug log
        // Ensure data is an array before setting state
        setAvailableVehicles(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
        message.error('Failed to load available vehicles');
        setAvailableVehicles([]); // Set to empty array on error
      }
    };

    // Fetch available drivers
    const fetchDrivers = async () => {
      try {
        const response = await fetch('/api/drivers?status=available');
        const data = await response.json();
        setAvailableDrivers(data);
      } catch (error) {
        console.error('Error fetching drivers:', error);
        message.error('Failed to load available drivers');
      }
    };

    fetchOrder();
    fetchVehicles();
    fetchDrivers();
  }, [id]);

  const handleVehicleAssign = async () => {
    try {
      await vehicleForm.validateFields();
      const values = vehicleForm.getFieldsValue();
      
      // Assign vehicle to order
      await fetch(`/api/orders/${id}/assign-vehicle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ vehicleId: values.vehicleId }),
      });
      
      message.success('Vehicle assigned successfully');
      setCurrentStep(1);
      
      // Refresh available drivers based on vehicle type
      const selectedVehicle = availableVehicles.find(v => v.id === values.vehicleId);
      if (selectedVehicle) {
        // In a real app, you might filter drivers by those qualified for this vehicle type
        const response = await fetch('/api/drivers?status=available');
        const data = await response.json();
        setAvailableDrivers(data);
      }
    } catch (error) {
      console.error('Error assigning vehicle:', error);
      message.error('Failed to assign vehicle');
    }
  };

  const handleDriverAssign = async () => {
    try {
      await driverForm.validateFields();
      const values = driverForm.getFieldsValue();
      
      // Assign driver to order
      await fetch(`/api/orders/${id}/assign-driver`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          driverId: values.driverId,
          orderType: order?.orderType
        }),
      });
      
      // Create tasks for the driver
      await fetch(`/api/orders/${id}/create-tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          driverId: values.driverId,
          orderType: order?.orderType
        }),
      });
      
      // Send notification to driver
      await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: values.driverId,
          title: 'New Assignment',
          message: `You have been assigned to ${order?.orderType} order for ${order?.customerName}`,
          type: 'info',
          relatedTo: {
            type: 'order',
            id: id as string
          }
        }),
      });
      
      message.success('Driver assigned and notified successfully');
      setCurrentStep(2);
    } catch (error) {
      console.error('Error assigning driver:', error);
      message.error('Failed to assign driver');
    }
  };

  const handleComplete = () => {
    router.push('/orders');
  };

  if (!order) {
    return (
      <AppLayout>
        <Card>
          <Title level={3}>Loading order details...</Title>
        </Card>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Card>
        <Title level={2}>Assign Order #{order.id}</Title>
        
        <Card style={{ marginBottom: 24 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Text strong>Customer:</Text> {order.customerName}<br />
              <Text strong>Phone:</Text> {order.customerPhone}<br />
              <Text strong>Email:</Text> {order.customerEmail}
            </Col>
            <Col span={12}>
              <Text strong>Order Type:</Text> {order.orderType}<br />
              <Text strong>Car Model:</Text> {order.carModel}<br />
              <Text strong>Status:</Text> <Tag color="blue">{order.status}</Tag>
            </Col>
          </Row>
        </Card>
        
        <Steps current={currentStep} style={{ marginBottom: 24 }}>
          <Step title="Assign Vehicle" description="Select a vehicle" />
          <Step title="Assign Driver" description="Select a driver" />
          <Step title="Complete" description="Assignment complete" />
        </Steps>
        
        <Divider />
        
        {currentStep === 0 && (
          <Card title="Step 1: Assign Vehicle">
            <Form form={vehicleForm} layout="vertical">
              <Form.Item
                name="vehicleId"
                label="Select Vehicle"
                rules={[{ required: true, message: 'Please select a vehicle' }]}
              >
                <Select placeholder="Select a vehicle">
                  {Array.isArray(availableVehicles) && availableVehicles.map(vehicle => {
                    // Function to map color names to actual CSS colors
                    const getColorValue = (colorName: string) => {
                      const colorMap: Record<string, string> = {
                        'midnight blue': '#191970',
                        'pearl white': '#f5f5f5',
                        'crimson red': '#dc143c',
                        'silver grey': '#c0c0c0',
                        'emerald green': '#50c878',
                      };
                      
                      const normalizedColor = colorName.toLowerCase();
                      return colorMap[normalizedColor] || normalizedColor;
                    };
                    
                    return (
                      <Option key={vehicle.id} value={vehicle.id}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <div 
                            style={{ 
                              width: '16px', 
                              height: '16px', 
                              backgroundColor: getColorValue(vehicle.color), 
                              marginRight: '8px',
                              border: '1px solid #d9d9d9',
                              borderRadius: '2px'
                            }} 
                          />
                          {vehicle.name || vehicle.model} - {vehicle.color} - {vehicle.licensePlate} (Battery: {vehicle.batteryLevel}%)
                        </div>
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
              
              <Button type="primary" onClick={handleVehicleAssign}>
                Assign Vehicle & Continue
              </Button>
            </Form>
          </Card>
        )}
        
        {currentStep === 1 && (
          <Card title="Step 2: Assign Driver">
            <Form form={driverForm} layout="vertical">
              <Form.Item
                name="driverId"
                label="Select Driver"
                rules={[{ required: true, message: 'Please select a driver' }]}
              >
                <Select placeholder="Select a driver">
                  {availableDrivers.map(driver => (
                    <Option key={driver.id} value={driver.id}>
                      {driver.name} - {driver.phone} (Rating: {driver.rating}/5)
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              
              <Button type="primary" onClick={handleDriverAssign}>
                Assign Driver & Continue
              </Button>
            </Form>
          </Card>
        )}
        
        {currentStep === 2 && (
          <Card title="Assignment Complete">
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <Title level={4} style={{ color: 'green' }}>
                Order has been successfully assigned!
              </Title>
              <Text>
                The driver has been notified of this assignment.
              </Text>
              <div style={{ marginTop: 24 }}>
                <Button type="primary" onClick={handleComplete}>
                  Return to Orders
                </Button>
              </div>
            </div>
          </Card>
        )}
      </Card>
    </AppLayout>
  );
};

export default AssignOrderPage;
import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Button, 
  Table, 
  Space, 
  Modal, 
  Form, 
  Input, 
  Select, 
  DatePicker,
  Tag,
  Row,
  Col,
  Card,
  Calendar,
  Badge,
  Tabs,
  Statistic,
  Progress,
  Empty,
  message
} from 'antd';
import { PlusOutlined, SearchOutlined, CalendarOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import AppLayout from '../../components/Layout';
import type { NextPage } from 'next';
import type { Moment } from 'moment';
import moment from 'moment';
import { driversApi } from '../../services/driversApi';
import { Driver, Order } from '../../types/index';

const { Title } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

const OrderManagement: NextPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [newOrderVisible, setNewOrderVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState('list');
  const [dayViewVisible, setDayViewVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Moment | null>(null);
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  const router = useRouter();

  const MAX_DAILY_SLOTS = 20; // Maximum number of orders allowed per day


  // Fetch orders and drivers data
  useEffect(() => {
    // Get current date for creating relative dates in mock data
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // Mock data for demonstration with dates spread across the current month
    const mockOrders = [
      {
        id: '1',
        customerName: 'Nguyễn Thanh Tùng',
        customerPhone: '0912-345-678',
        customerEmail: 'thanhtung@example.com',
        address: '123 Lê Lợi, Quận 1, TP.HCM',
        orderType: 'delivery' as const,
        scheduledTime: new Date(currentYear, currentMonth, today.getDate(), 10, 0, 0),
        carModel: 'VF 8',
        status: 'pending' as const,
        driverId: null
      },
      {
        id: '2',
        customerName: 'Trần Thị Mai Hương',
        customerPhone: '0987-654-321',
        customerEmail: 'maihuong@example.com',
        address: '456 Nguyễn Huệ, Quận 1, TP.HCM',
        orderType: 'pickup' as const,
        scheduledTime: new Date(currentYear, currentMonth, today.getDate() + 1, 14, 0, 0),
        carModel: 'VF 9',
        status: 'assigned' as const,
        driverId: '1'
      },
      {
        id: '3',
        customerName: 'Phạm Văn Đức',
        customerPhone: '0909-123-456',
        customerEmail: 'vanduc@example.com',
        address: '789 Điện Biên Phủ, Quận 3, TP.HCM',
        orderType: 'delivery' as const,
        scheduledTime: new Date(currentYear, currentMonth, today.getDate() + 2, 9, 30, 0),
        carModel: 'VF 5',
        status: 'pending' as const,
        driverId: null
      },
      {
        id: '4',
        customerName: 'Lê Thị Hồng Nhung',
        customerPhone: '0918-765-432',
        customerEmail: 'hongnhung@example.com',
        address: '321 Võ Văn Tần, Quận 3, TP.HCM',
        orderType: 'pickup' as const,
        scheduledTime: new Date(currentYear, currentMonth, today.getDate() + 3, 16, 45, 0),
        carModel: 'VF e34',
        status: 'completed' as const,
        driverId: '2'
      },
      {
        id: '5',
        customerName: 'Hoàng Minh Tuấn',
        customerPhone: '0933-222-111',
        customerEmail: 'minhtuan@example.com',
        address: '567 Cách Mạng Tháng 8, Quận 10, TP.HCM',
        orderType: 'delivery' as const,
        scheduledTime: new Date(currentYear, currentMonth, today.getDate(), 14, 30, 0),
        carModel: 'VF 7',
        status: 'assigned' as const,
        driverId: '4'
      },
      {
        id: '6',
        customerName: 'Vũ Thị Lan Anh',
        customerPhone: '0977-888-999',
        customerEmail: 'lananh@example.com',
        address: '890 Nguyễn Đình Chiểu, Quận 3, TP.HCM',
        orderType: 'pickup' as const,
        scheduledTime: new Date(currentYear, currentMonth, today.getDate() + 1, 9, 15, 0),
        carModel: 'VF 6',
        status: 'pending' as const,
        driverId: null
      },
      {
        id: '7',
        customerName: 'Đỗ Quang Hải',
        customerPhone: '0965-444-333',
        customerEmail: 'quanghai@example.com',
        address: '234 Trần Hưng Đạo, Quận 5, TP.HCM',
        orderType: 'delivery' as const,
        scheduledTime: new Date(currentYear, currentMonth, today.getDate() + 2, 13, 0, 0),
        carModel: 'VF 8',
        status: 'assigned' as const,
        driverId: '5'
      },
      {
        id: '8',
        customerName: 'Bùi Thị Thanh Thảo',
        customerPhone: '0908-777-666',
        customerEmail: 'thanhthao@example.com',
        address: '678 Lý Tự Trọng, Quận 1, TP.HCM',
        orderType: 'pickup' as const,
        scheduledTime: new Date(currentYear, currentMonth, today.getDate() + 4, 11, 30, 0),
        carModel: 'VF 9',
        status: 'pending' as const,
        driverId: null
      },
      {
        id: '9',
        customerName: 'Trương Văn Thành',
        customerPhone: '0919-555-444',
        customerEmail: 'vanthanh@example.com',
        address: '901 Nguyễn Trãi, Quận 5, TP.HCM',
        orderType: 'delivery' as const,
        scheduledTime: new Date(currentYear, currentMonth, today.getDate() + 5, 15, 45, 0),
        carModel: 'VF 5',
        status: 'assigned' as const,
        driverId: '1'
      },
      {
        id: '10',
        customerName: 'Ngô Thị Mỹ Linh',
        customerPhone: '0944-333-222',
        customerEmail: 'mylinh@example.com',
        address: '345 Hai Bà Trưng, Quận 1, TP.HCM',
        orderType: 'pickup' as const,
        scheduledTime: new Date(currentYear, currentMonth, today.getDate() + 6, 10, 15, 0),
        carModel: 'VF e34',
        status: 'pending' as const,
        driverId: null
      },
      {
        id: '11',
        customerName: 'Đinh Công Phương',
        customerPhone: '0922-111-000',
        customerEmail: 'congphuong@example.com',
        address: '789 Phan Xích Long, Phú Nhuận, TP.HCM',
        orderType: 'delivery' as const,
        scheduledTime: new Date(currentYear, currentMonth, today.getDate() + 7, 12, 30, 0),
        carModel: 'VF 7',
        status: 'completed' as const,
        driverId: '2'
      },
      {
        id: '12',
        customerName: 'Phan Thị Thu Hà',
        customerPhone: '0955-999-888',
        customerEmail: 'thuha@example.com',
        address: '123 Nguyễn Văn Cừ, Quận 5, TP.HCM',
        orderType: 'pickup' as const,
        scheduledTime: new Date(currentYear, currentMonth, today.getDate() + 8, 9, 0, 0),
        carModel: 'VF 6',
        status: 'assigned' as const,
        driverId: '4'
      }
    ];

    
    fetch('/api/orders')
      .then(response => response.json())
      .then(data => {
        setOrders(data)
        setFilteredOrders(data);
      });

    fetch('/api/drivers')
      .then(response => response.json())
      .then(data => setDrivers(data));
  }, []);

  const showNewOrderModal = () => {
    form.resetFields();
    setNewOrderVisible(true);
  };

  const handleNewOrderCancel = () => {
    setNewOrderVisible(false);
  };

  const handleAssignDriver = (order: Order) => {
    // Navigate to the assign page with the order ID
    router.push(`/orders/assign?id=${order.id}`);
  };

  const showSearchModal = () => {
    searchForm.resetFields();
    setSearchVisible(true);
  };

  const handleSearchCancel = () => {
    setSearchVisible(false);
  };

  const handleSearch = () => {
    searchForm.validateFields().then(values => {
      let results = [...orders];
      
      if (values.customerName) {
        results = results.filter(order => 
          order.customerName.toLowerCase().includes(values.customerName.toLowerCase())
        );
      }
      
      if (values.orderType) {
        results = results.filter(order => order.orderType === values.orderType);
      }
      
      if (values.carModel) {
        results = results.filter(order => order.carModel === values.carModel);
      }
      
      if (values.status) {
        results = results.filter(order => order.status === values.status);
      }
      
      if (values.dateRange && values.dateRange[0] && values.dateRange[1]) {
        const startDate = values.dateRange[0].startOf('day').toDate();
        const endDate = values.dateRange[1].endOf('day').toDate();
        
        results = results.filter(order => {
          const orderDate = new Date(order.scheduledTime);
          return orderDate >= startDate && orderDate <= endDate;
        });
      }
      
      setFilteredOrders(results);
      setSearchVisible(false);
    });
  };

  const handleNewOrderSubmit = () => {
    form.validateFields().then(values => {
      // For demonstration, we'll just add to the local state
      const newOrder: Order = {
        id: String(orders.length + 1),
        customerName: values.customerName,
        customerPhone: values.customerPhone,
        customerEmail: values.customerEmail,
        address: values.address,
        orderType: values.orderType,
        scheduledTime: values.scheduledTime.toDate(),
        carModel: values.carModel,
        status: 'pending',
        driverId: null,
        // Add missing properties to match Order interface
        vehicleId: null,
        paymentStatus: 'pending',
        paymentAmount: 0,
        extraFees: [],
        tasks: []
      };
      
      const updatedOrders = [...orders, newOrder];
      setOrders(updatedOrders);
      setFilteredOrders(updatedOrders);
      setNewOrderVisible(false);
    });
  };

  const getDriverName = (driverId: string | null) => {
    if (!driverId) return 'Not assigned';
    const driver = drivers.find(d => d.id === driverId);
    return driver ? driver.name : 'Unknown driver';
  };

  // Add this to the columns array
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
              onClick={() => handleAssignDriver(record)}
            >
              Assign Driver
            </Button>
          )}
          {record.status === 'assigned' && (
            <Button 
              type="primary" 
              size="small"
              danger
              onClick={() => handleAssignDriver(record)}
            >
              Re-assign Driver
            </Button>
          )}
        </Space>
      ),
    },
  ];

  // Function to get orders for a specific date
  const getOrdersForDate = (date: Moment) => {
    return filteredOrders.filter(order => {
      const orderDate = moment(order.scheduledTime);
      return orderDate.isSame(date, 'day');
    });
  };

  // Function to get the booking status color for a date
  const getBookingStatusColor = (date: Moment) => {
    const ordersForDate = getOrdersForDate(date);
    const bookingPercentage = (ordersForDate.length / MAX_DAILY_SLOTS) * 100;
    
    if (bookingPercentage < 30) return 'green';
    if (bookingPercentage < 70) return 'orange';
    return 'red';
  };

  // Function to render calendar cell content
  const dateCellRender = (date: Moment) => {
    const ordersForDate = getOrdersForDate(date);
    const statusColor = getBookingStatusColor(date);
    
    return (
      <>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: 4
        }}>
          <Badge 
            color={statusColor} 
            text={
              <span style={{ fontSize: '0.8em' }}>
                {ordersForDate.length}/{MAX_DAILY_SLOTS} slots
              </span>
            } 
          />
        </div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {ordersForDate.map(order => {
            let color = 'blue';
            if (order.status === 'assigned') color = 'orange';
            if (order.status === 'completed') color = 'green';
            
            const time = moment(order.scheduledTime).format('HH:mm');
            
            return (
              <li key={order.id} style={{ marginBottom: 3 }}>
                <Badge 
                  color={color} 
                  text={
                    <span style={{ fontSize: '0.8em' }}>
                      {time} - {order.customerName.split(' ')[0]} ({order.orderType === 'delivery' ? 'D' : 'P'})
                    </span>
                  } 
                />
              </li>
            );
          })}
        </ul>
      </>
    );
  };

  // Function to handle calendar date selection
  const onCalendarSelect = (date: Moment) => {
    setSelectedDate(date);
    setDayViewVisible(true);
    const ordersForDate = getOrdersForDate(date);
    setFilteredOrders(ordersForDate);
  };

  // Function to close day view modal
  const handleDayViewClose = () => {
    setDayViewVisible(false);
    setFilteredOrders(orders); // Reset to show all orders in the list view
  };

  return (
    <AppLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, alignItems: 'center' }}>
        <Title level={2} style={{ margin: 0 }}>Order Management</Title>
        <Space>
          <Button 
            icon={<SearchOutlined />} 
            onClick={showSearchModal}
            style={{ borderRadius: '6px' }}
          >
            Advanced Search
          </Button>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={showNewOrderModal}
            style={{ borderRadius: '6px' }}
          >
            New Order
          </Button>
        </Space>
      </div>
      
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        type="card"
        style={{ marginBottom: 16 }}
      >
        <TabPane 
          tab={
            <span>
              <UnorderedListOutlined />
              List View
            </span>
          } 
          key="list"
        >
          <Table 
            columns={columns} 
            dataSource={filteredOrders} 
            rowKey="id" 
            pagination={{ pageSize: 10 }}
          />
        </TabPane>
        <TabPane 
          tab={
            <span>
              <CalendarOutlined />
              Calendar View
            </span>
          } 
          key="calendar"
        >
          <Card>
            <Calendar 
              dateCellRender={dateCellRender} 
              onSelect={onCalendarSelect}
            />
          </Card>
        </TabPane>
      </Tabs>
      
      {/* New Order Modal */}
      <Modal
        title="Create New Order"
        visible={newOrderVisible}
        onCancel={handleNewOrderCancel}
        onOk={handleNewOrderSubmit}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="customerName"
            label="Customer Name"
            rules={[{ required: true, message: 'Please enter customer name' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="customerPhone"
            label="Phone Number"
            rules={[{ required: true, message: 'Please enter phone number' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="customerEmail"
            label="Email"
            rules={[
              { required: true, message: 'Please enter email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: 'Please enter address' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="orderType"
            label="Order Type"
            rules={[{ required: true, message: 'Please select order type' }]}
          >
            <Select>
              <Option value="delivery">Delivery</Option>
              <Option value="pickup">Pickup</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="carModel"
            label="Car Model"
            rules={[{ required: true, message: 'Please enter car model' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="scheduledTime"
            label="Scheduled Time"
            rules={[{ required: true, message: 'Please select scheduled time' }]}
          >
            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
          </Form.Item>
        </Form>
      </Modal>
      
      {/* Advanced Search Modal */}
      <Modal
        title="Advanced Search"
        visible={searchVisible}
        onCancel={handleSearchCancel}
        onOk={handleSearch}
        width={700}
      >
        <Form
          form={searchForm}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="customerName"
                label="Customer Name"
              >
                <Input placeholder="Search by customer name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="orderType"
                label="Order Type"
              >
                <Select allowClear placeholder="Select order type">
                  <Option value="delivery">Delivery</Option>
                  <Option value="pickup">Pickup</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="carModel"
                label="Car Model"
              >
                <Select allowClear placeholder="Select car model">
                  <Option value="VF e34">VF e34</Option>
                  <Option value="VF 5">VF 5</Option>
                  <Option value="VF 6">VF 6</Option>
                  <Option value="VF 7">VF 7</Option>
                  <Option value="VF 8">VF 8</Option>
                  <Option value="VF 9">VF 9</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Status"
              >
                <Select allowClear placeholder="Select status">
                  <Option value="pending">Pending</Option>
                  <Option value="assigned">Assigned</Option>
                  <Option value="completed">Completed</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="dateRange"
            label="Date Range"
          >
            <DatePicker.RangePicker style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
      
      {/* Day View Modal */}
      <Modal
        title={selectedDate ? `Orders for ${selectedDate.format('MMMM D, YYYY')}` : 'Day View'}
        visible={dayViewVisible}
        onCancel={handleDayViewClose}
        footer={[
          <Button key="close" onClick={handleDayViewClose}>
            Close
          </Button>
        ]}
        width={1000}
      >
        <div style={{ marginBottom: 16 }}>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Card>
                <Statistic 
                  title="Total Orders" 
                  value={filteredOrders.length} 
                  suffix={`/ ${MAX_DAILY_SLOTS}`}
                />
                <div style={{ marginTop: 8 }}>
                  <Progress 
                    percent={Math.round((filteredOrders.length / MAX_DAILY_SLOTS) * 100)} 
                    status={
                      filteredOrders.length / MAX_DAILY_SLOTS > 0.7 
                        ? 'exception' 
                        : filteredOrders.length / MAX_DAILY_SLOTS > 0.3 
                          ? 'normal' 
                          : 'success'
                    }
                  />
                </div>
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic 
                  title="Pending Orders" 
                  value={filteredOrders.filter(order => order.status === 'pending').length} 
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic 
                  title="Assigned Orders" 
                  value={filteredOrders.filter(order => order.status === 'assigned').length} 
                />
              </Card>
            </Col>
          </Row>
        </div>
        
        <Table 
          columns={columns} 
          dataSource={filteredOrders} 
          rowKey="id" 
          pagination={false}
        />
        
        {filteredOrders.length === 0 && (
          <Empty description="No orders scheduled for this day" />
        )}
      </Modal>
    </AppLayout>
  );
};

export default OrderManagement;
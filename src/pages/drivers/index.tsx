import React, { useState, useEffect, Key } from 'react';
import { 
  Typography, 
  Button, 
  Table, 
  Space, 
  Modal, 
  Form, 
  Input, 
  Select, 
  Tag,
  Row,
  Col,
  Card,
  Avatar,
  Tooltip,
  Popconfirm,
  Badge,
  message
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { 
  UserAddOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  CarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SearchOutlined
} from '@ant-design/icons';
import AppLayout from '../../components/Layout';
import type { NextPage } from 'next';

import { driversApi } from '../../services/driversApi';
import { Driver } from '../../types/index';

const { Title } = Typography;
const { Option } = Select;

const DriverManagement: NextPage = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');

  // Fetch drivers data
  useEffect(() => {
    const fetchDrivers = async () => {
      setLoading(true);
      try {
        const data = await driversApi.getAllDrivers();
        setDrivers(data);
      } catch (error) {
        console.error('Error fetching drivers:', error);
        message.error('Failed to load drivers data');
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  const showAddDriverModal = () => {
    setEditingDriver(null);
    form.resetFields();
    setModalVisible(true);
  };

  const showEditDriverModal = (driver: Driver) => {
    setEditingDriver(driver);
    form.setFieldsValue({
      name: driver.name,
      phone: driver.phone,
      email: driver.email,
      licenseNumber: driver.licenseNumber,
      licenseExpiry: driver.licenseExpiry,
      status: driver.status,
      address: driver.address
    });
    setModalVisible(true);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
  };

  const handleModalSubmit = () => {
    form.validateFields().then(async (values) => {
      try {
        if (editingDriver) {
          // Update existing driver
          const updatedDriver = await driversApi.updateDriver(editingDriver.id, values);
          setDrivers(drivers.map(driver => 
            driver.id === updatedDriver.id ? updatedDriver : driver
          ));
          message.success('Driver updated successfully');
        } else {
          // Add new driver
          const newDriverData = {
            ...values,
            rating: 0,
            joinDate: new Date().toISOString().split('T')[0],
            currentVehicle: null,
            totalTrips: 0
          };
          const newDriver = await driversApi.createDriver(newDriverData);
          setDrivers([...drivers, newDriver]);
          message.success('Driver added successfully');
        }
        setModalVisible(false);
      } catch (error) {
        console.error('Error saving driver:', error);
        message.error('Failed to save driver data');
      }
    });
  };

  const handleDeleteDriver = async (driverId: string) => {
    try {
      const success = await driversApi.deleteDriver(driverId);
      if (success) {
        setDrivers(drivers.filter(driver => driver.id !== driverId));
        message.success('Driver deleted successfully');
      } else {
        message.error('Failed to delete driver');
      }
    } catch (error) {
      console.error('Error deleting driver:', error);
      message.error('Failed to delete driver');
    }
  };

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'available':
        return <Tag icon={<CheckCircleOutlined />} color="success">Available</Tag>;
      case 'on_duty':
        return <Tag icon={<CarOutlined />} color="processing">On Duty</Tag>;
      case 'on_leave':
        return <Tag icon={<CloseCircleOutlined />} color="warning">On Leave</Tag>;
      case 'inactive':
        return <Tag icon={<CloseCircleOutlined />} color="error">Inactive</Tag>;
      default:
        return <Tag color="default">{status}</Tag>;
    }
  };

  const filteredDrivers = drivers.filter(driver => 
    driver.name.toLowerCase().includes(searchText.toLowerCase()) ||
    driver.phone.includes(searchText) ||
    driver.email.toLowerCase().includes(searchText.toLowerCase()) ||
    driver.licenseNumber.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns: ColumnsType<Driver> = [
    {
      title: 'Driver',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Driver) => (
        <Space>
          <Avatar icon={<UserOutlined />} src={record.avatar} />
          {text}
          {record.rating > 4.5 && (
            <Tooltip title="Top Rated Driver">
              <Badge count="★" style={{ backgroundColor: '#faad14' }} />
            </Tooltip>
          )}
        </Space>
      ),
    },
    {
      title: 'Contact',
      key: 'contact',
      render: (_: any, record: Driver) => (
        <Space direction="vertical" size="small">
          <Space>
            <PhoneOutlined /> {record.phone}
          </Space>
          <Space>
            <MailOutlined /> {record.email}
          </Space>
        </Space>
      ),
    },
    {
      title: 'License',
      dataIndex: 'licenseNumber',
      key: 'licenseNumber',
      render: (text: string, record: Driver) => (
        <Space direction="vertical" size="small">
          <div>{text}</div>
          <div>Expires: {record.licenseExpiry}</div>
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status),
      filters: [
        { text: 'Available', value: 'available' },
        { text: 'On Duty', value: 'on_duty' },
        { text: 'On Leave', value: 'on_leave' },
        { text: 'Inactive', value: 'inactive' },
      ],
      onFilter: (value: boolean | Key, record: Driver) => record.status === value,
    },
    {
      title: 'Current Vehicle',
      dataIndex: 'currentVehicle',
      key: 'currentVehicle',
      render: (text: string | null) => text || 'Not assigned',
    },
    {
      title: 'Trips',
      dataIndex: 'totalTrips',
      key: 'totalTrips',
      sorter: (a: Driver, b: Driver) => a.totalTrips - b.totalTrips,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Driver) => (
        <Space>
          <Button 
            icon={<EditOutlined />} 
            size="small" 
            onClick={() => showEditDriverModal(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this driver?"
            onConfirm={() => handleDeleteDriver(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              icon={<DeleteOutlined />} 
              size="small" 
              danger
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <AppLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, alignItems: 'center' }}>
        <Title level={2} style={{ margin: 0 }}>Driver Management</Title>
        <Space>
          <Input
            placeholder="Search drivers..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 250, borderRadius: '6px' }}
          />
          <Button 
            type="primary" 
            icon={<UserAddOutlined />} 
            onClick={showAddDriverModal}
            style={{ borderRadius: '6px' }}
          >
            Add Driver
          </Button>
        </Space>
      </div>
      
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card 
            title="Available Drivers" 
            bordered={false} 
            style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.09)' }}
            headStyle={{ background: '#f6ffed', color: '#52c41a', borderBottom: '1px solid #b7eb8f' }}
          >
            <Title level={3} style={{ color: '#52c41a', textAlign: 'center', margin: 0 }}>
              {drivers.filter(d => d.status === 'available').length}
            </Title>
          </Card>
        </Col>
        <Col span={6}>
          <Card 
            title="On Duty" 
            bordered={false} 
            style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.09)' }}
            headStyle={{ background: '#e6f7ff', color: '#1890ff', borderBottom: '1px solid #91d5ff' }}
          >
            <Title level={3} style={{ color: '#1890ff', textAlign: 'center', margin: 0 }}>
              {drivers.filter(d => d.status === 'on_duty').length}
            </Title>
          </Card>
        </Col>
        <Col span={6}>
          <Card 
            title="On Leave" 
            bordered={false} 
            style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.09)' }}
            headStyle={{ background: '#fff7e6', color: '#faad14', borderBottom: '1px solid #ffd591' }}
          >
            <Title level={3} style={{ color: '#faad14', textAlign: 'center', margin: 0 }}>
              {drivers.filter(d => d.status === 'on_leave').length}
            </Title>
          </Card>
        </Col>
        <Col span={6}>
          <Card 
            title="Total Drivers" 
            bordered={false} 
            style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.09)' }}
            headStyle={{ background: '#f0f2f5', borderBottom: '1px solid #d9d9d9' }}
          >
            <Title level={3} style={{ textAlign: 'center', margin: 0 }}>
              {drivers.length}
            </Title>
          </Card>
        </Col>
      </Row>
      
      <Card 
        style={{ 
          marginTop: 24, 
          borderRadius: '8px', 
          boxShadow: '0 2px 8px rgba(0,0,0,0.09)' 
        }}
        bordered={false}
      >
        <Table 
          columns={columns} 
          dataSource={filteredDrivers} 
          rowKey="id" 
          loading={loading}
          pagination={{ 
            pageSize: 10,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} drivers`
          }}
          style={{ marginTop: 8 }}
        />
      </Card>
      
      <Modal
        title={editingDriver ? "Edit Driver" : "Add New Driver"}
        visible={modalVisible}
        onCancel={handleModalCancel}
        onOk={handleModalSubmit}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Full Name"
            rules={[{ required: true, message: 'Please enter driver name' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="phone"
            label="Phone Number"
            rules={[{ required: true, message: 'Please enter phone number' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="email"
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
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="licenseNumber"
                label="License Number"
                rules={[{ required: true, message: 'Please enter license number' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="licenseExpiry"
                label="License Expiry Date"
                rules={[{ required: true, message: 'Please enter license expiry date' }]}
              >
                <Input type="date" />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select status' }]}
          >
            <Select>
              <Option value="available">Available</Option>
              <Option value="on_duty">On Duty</Option>
              <Option value="on_leave">On Leave</Option>
              <Option value="inactive">Inactive</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </AppLayout>
  );
};

export default DriverManagement;
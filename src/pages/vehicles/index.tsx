import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Tag, Modal, Form, message, Progress, Alert } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import AppLayout from '../../components/Layout';
import { Vehicle } from '../../types';

const VehiclesPage: React.FC = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [batteryFilter, setBatteryFilter] = useState<string | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch vehicles from API
  const fetchVehicles = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/vehicles');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setVehicles(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      message.error('Failed to load vehicles');
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new vehicle
  const createVehicle = async (vehicleData: Omit<Vehicle, 'id'>) => {
    try {
      const response = await fetch('/api/vehicles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vehicleData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      await fetchVehicles(); // Refresh the list
      return true;
    } catch (error) {
      console.error('Error creating vehicle:', error);
      throw error;
    }
  };

  // Update an existing vehicle
  const updateVehicle = async (id: string, vehicleData: Partial<Vehicle>) => {
    try {
      const response = await fetch(`/api/vehicles/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vehicleData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      await fetchVehicles(); // Refresh the list
      return true;
    } catch (error) {
      console.error('Error updating vehicle:', error);
      throw error;
    }
  };

  // Delete a vehicle
  const deleteVehicle = async (id: string) => {
    try {
      const response = await fetch(`/api/vehicles/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      await fetchVehicles(); // Refresh the list
      return true;
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      throw error;
    }
  };

  // Load vehicles on component mount
  useEffect(() => {
    fetchVehicles();
  }, []);

  // Filter vehicles based on battery level
  const filteredVehicles = batteryFilter 
    ? vehicles.filter(vehicle => {
        if (batteryFilter === 'low') return vehicle.currentCharge < 20;
        if (batteryFilter === 'medium') return vehicle.currentCharge >= 20 && vehicle.currentCharge < 50;
        if (batteryFilter === 'high') return vehicle.currentCharge >= 50;
        return true;
      })
    : vehicles;

  // Count vehicles with low battery
  const lowBatteryVehicles = vehicles.filter(vehicle => vehicle.currentCharge < 20);

  const showCreateModal = () => {
    setEditingVehicle(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const showEditModal = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    form.setFieldsValue({
      name: vehicle.name,
      model: vehicle.model,
      manufacturer: vehicle.manufacturer,
      year: vehicle.year,
      licensePlate: vehicle.licensePlate,
      vin: vehicle.vin,
      batteryCapacity: vehicle.batteryCapacity,
      range: vehicle.range,
      status: vehicle.status,
      currentCharge: vehicle.currentCharge,
      color: vehicle.color,
    });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Add a loading state for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true); // Set loading state to true when submitting
      const values = await form.validateFields();
      
      if (editingVehicle) {
        await updateVehicle(editingVehicle.id, values);
        message.success('Vehicle updated successfully');
      } else {
        await createVehicle(values as Omit<Vehicle, 'id'>);
        message.success('Vehicle created successfully');
      }
      
      setIsModalVisible(false);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false); // Reset loading state when done
    }
  };

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this vehicle?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          await deleteVehicle(id);
          message.success('Vehicle deleted successfully');
        } catch (error) {
          message.error('Failed to delete vehicle');
          console.error(error);
        }
      },
    });
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Model',
      dataIndex: 'model',
      key: 'model',
    },
    {
      title: 'Manufacturer',
      dataIndex: 'manufacturer',
      key: 'manufacturer',
    },
    {
      title: 'Year',
      dataIndex: 'year',
      key: 'year',
    },
    {
      title: 'License Plate',
      dataIndex: 'licensePlate',
      key: 'licensePlate',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'green';
        if (status === 'in-use') color = 'blue';
        if (status === 'charging') color = 'purple';
        if (status === 'maintenance') color = 'orange';
        if (status === 'out-of-service') color = 'red';
        
        return (
          <Tag color={color}>
            {status.toUpperCase().replace('-', ' ')}
          </Tag>
        );
      },
    },
    {
      title: 'Current Charge',
      dataIndex: 'currentCharge',
      key: 'currentCharge',
      render: (charge: number) => (
        <div>
          <Progress 
            percent={charge} 
            size="small" 
            status={charge < 20 ? "exception" : charge < 50 ? "normal" : "success"}
            format={(percent) => `${percent}%`}
          />
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Vehicle) => (
        <Space size="middle">
          <Button 
            icon={<EditOutlined />} 
            onClick={() => showEditModal(record)}
          />
          <Button 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <AppLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h1>Vehicles</h1>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={showCreateModal}
        >
          Add Vehicle
        </Button>
      </div>
      
      {lowBatteryVehicles.length === 0 && (
        <Alert
          message="No Vehicles with Low Battery"
          description="All vehicles have sufficient battery levels (20% or higher)."
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}
      
      {lowBatteryVehicles.length > 0 && (
        <Alert
          message={`${lowBatteryVehicles.length} Vehicle${lowBatteryVehicles.length > 1 ? 's' : ''} with Low Battery`}
          description="These vehicles need charging soon."
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}
      
      <Table 
        dataSource={filteredVehicles} 
        columns={columns} 
        rowKey="id" 
        loading={isLoading}
        rowClassName={(record) => record.currentCharge < 20 ? 'low-battery-row' : ''}
      />
      
      {/* Modal form for adding/editing vehicles */}
      <Modal
        title={editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
        visible={isModalVisible}
        onCancel={handleCancel}
        onOk={handleSubmit}
        confirmLoading={isSubmitting} // Use the new isSubmitting state
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please enter vehicle name' }]}
          >
            <input className="ant-input" />
          </Form.Item>
          
          <Form.Item
            name="model"
            label="Model"
            rules={[{ required: true, message: 'Please enter vehicle model' }]}
          >
            <input className="ant-input" />
          </Form.Item>
          
          <Form.Item
            name="manufacturer"
            label="Manufacturer"
            rules={[{ required: true, message: 'Please enter manufacturer' }]}
          >
            <input className="ant-input" />
          </Form.Item>
          
          <Form.Item
            name="year"
            label="Year"
            rules={[{ required: true, message: 'Please enter year' }]}
          >
            <input type="number" className="ant-input" />
          </Form.Item>
          
          <Form.Item
            name="licensePlate"
            label="License Plate"
            rules={[{ required: true, message: 'Please enter license plate' }]}
          >
            <input className="ant-input" />
          </Form.Item>
          
          <Form.Item
            name="vin"
            label="VIN"
            rules={[{ required: true, message: 'Please enter VIN' }]}
          >
            <input className="ant-input" />
          </Form.Item>
          
          <Form.Item
            name="batteryCapacity"
            label="Battery Capacity (kWh)"
            rules={[{ required: true, message: 'Please enter battery capacity' }]}
          >
            <input type="number" className="ant-input" />
          </Form.Item>
          
          <Form.Item
            name="range"
            label="Range (km)"
            rules={[{ required: true, message: 'Please enter range' }]}
          >
            <input type="number" className="ant-input" />
          </Form.Item>
          
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select status' }]}
          >
            <select className="ant-select-selector" style={{ width: '100%', height: '32px' }}>
              <option value="available">Available</option>
              <option value="in-use">In Use</option>
              <option value="charging">Charging</option>
              <option value="maintenance">Maintenance</option>
              <option value="out-of-service">Out of Service</option>
            </select>
          </Form.Item>
          
          <Form.Item
            name="currentCharge"
            label="Current Charge (%)"
            rules={[{ required: true, message: 'Please enter current charge' }]}
          >
            <input type="number" min="0" max="100" className="ant-input" />
          </Form.Item>
        </Form>
      </Modal>
    </AppLayout>
  );
};

export default VehiclesPage;
import React, { useState } from 'react';
import { Table, Button, Space, Tag, Modal, Form, Input, Select, InputNumber, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import AppLayout from '../../components/Layout';
import { useVehicles } from '../../hooks/useVehicles';
import { Vehicle } from '../../types';

const VehiclesPage: React.FC = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  
  const { 
    useGetVehicles, 
    useCreateVehicle, 
    useUpdateVehicle, 
    useDeleteVehicle 
  } = useVehicles();
  
  const { data: vehicles = [], isLoading } = useGetVehicles();
  const createVehicleMutation = useCreateVehicle();
  const updateVehicleMutation = useUpdateVehicle();
  const deleteVehicleMutation = useDeleteVehicle();

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
    });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingVehicle) {
        await updateVehicleMutation.mutateAsync({ id: editingVehicle.id, ...values });
        message.success('Vehicle updated successfully');
      } else {
        await createVehicleMutation.mutateAsync(values);
        message.success('Vehicle created successfully');
      }
      
      setIsModalVisible(false);
    } catch (error) {
      console.error('Error submitting form:', error);
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
          await deleteVehicleMutation.mutateAsync(id);
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
      render: (charge: number) => `${charge}%`,
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
      
      <Table 
        dataSource={vehicles} 
        columns={columns} 
        rowKey="id" 
        loading={isLoading}
      />
      
      <Modal
        title={editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
        visible={isModalVisible}
        onCancel={handleCancel}
        onOk={handleSubmit}
        confirmLoading={createVehicleMutation.isLoading || updateVehicleMutation.isLoading}
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
            <Input />
          </Form.Item>
          
          <Form.Item
            name="model"
            label="Model"
            rules={[{ required: true, message: 'Please enter vehicle model' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="manufacturer"
            label="Manufacturer"
            rules={[{ required: true, message: 'Please enter manufacturer' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="year"
            label="Year"
            rules={[{ required: true, message: 'Please enter year' }]}
          >
            <InputNumber min={1900} max={2100} style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item
            name="licensePlate"
            label="License Plate"
            rules={[{ required: true, message: 'Please enter license plate' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="vin"
            label="VIN"
            rules={[{ required: true, message: 'Please enter VIN' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="batteryCapacity"
            label="Battery Capacity (kWh)"
            rules={[{ required: true, message: 'Please enter battery capacity' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item
            name="range"
            label="Range (miles)"
            rules={[{ required: true, message: 'Please enter range' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select status' }]}
          >
            <Select>
              <Select.Option value="available">Available</Select.Option>
              <Select.Option value="in-use">In Use</Select.Option>
              <Select.Option value="charging">Charging</Select.Option>
              <Select.Option value="maintenance">Maintenance</Select.Option>
              <Select.Option value="out-of-service">Out of Service</Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="currentCharge"
            label="Current Charge (%)"
            rules={[{ required: true, message: 'Please enter current charge' }]}
          >
            <InputNumber min={0} max={100} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </AppLayout>
  );
};

export default VehiclesPage;
import React, { useState } from 'react';
import { Table, Button, Space, Tag, Modal, Form, Input, Select, DatePicker, InputNumber, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';
import AppLayout from '../../components/Layout';
import { useVehicles } from '../../hooks/useVehicles';
import { MaintenanceRecord } from '../../types';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';

const MaintenancePage: React.FC = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<MaintenanceRecord | null>(null);
  const queryClient = useQueryClient();
  
  const { useGetVehicles } = useVehicles();
  const { data: vehicles = [], isLoading: vehiclesLoading } = useGetVehicles();
  
  // Maintenance records API hooks
  const getMaintenanceRecords = async (): Promise<MaintenanceRecord[]> => {
    const response = await axios.get('/api/maintenance-records');
    return response.data.docs;
  };

  const createMaintenanceRecord = async (record: Partial<MaintenanceRecord>): Promise<MaintenanceRecord> => {
    const response = await axios.post('/api/maintenance-records', record);
    return response.data;
  };

  const updateMaintenanceRecord = async ({ id, ...record }: Partial<MaintenanceRecord> & { id: string }): Promise<MaintenanceRecord> => {
    const response = await axios.patch(`/api/maintenance-records/${id}`, record);
    return response.data;
  };

  const deleteMaintenanceRecord = async (id: string): Promise<void> => {
    await axios.delete(`/api/maintenance-records/${id}`);
  };

  const { data: records = [], isLoading } = useQuery('maintenanceRecords', getMaintenanceRecords);
  
  const createRecordMutation = useMutation(createMaintenanceRecord, {
    onSuccess: () => {
      queryClient.invalidateQueries('maintenanceRecords');
    },
  });
  
  const updateRecordMutation = useMutation(updateMaintenanceRecord, {
    onSuccess: () => {
      queryClient.invalidateQueries('maintenanceRecords');
    },
  });
  
  const deleteRecordMutation = useMutation(deleteMaintenanceRecord, {
    onSuccess: () => {
      queryClient.invalidateQueries('maintenanceRecords');
    },
  });

  const showCreateModal = () => {
    setEditingRecord(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const showEditModal = (record: MaintenanceRecord) => {
    setEditingRecord(record);
    form.setFieldsValue({
      title: record.title,
      vehicle: record.vehicle.id,
      maintenanceType: record.maintenanceType,
      scheduledDate: moment(record.scheduledDate),
      completedDate: record.completedDate ? moment(record.completedDate) : undefined,
      cost: record.cost,
      status: record.status,
      notes: record.notes,
    });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      const formattedValues = {
        ...values,
        scheduledDate: values.scheduledDate.toISOString(),
        completedDate: values.completedDate ? values.completedDate.toISOString() : undefined,
      };
      
      if (editingRecord) {
        await updateRecordMutation.mutateAsync({ 
          id: editingRecord.id, 
          ...formattedValues 
        });
        message.success('Maintenance record updated successfully');
      } else {
        await createRecordMutation.mutateAsync(formattedValues);
        message.success('Maintenance record created successfully');
      }
      
      setIsModalVisible(false);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this maintenance record?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          await deleteRecordMutation.mutateAsync(id);
          message.success('Maintenance record deleted successfully');
        } catch (error) {
          message.error('Failed to delete maintenance record');
          console.error(error);
        }
      },
    });
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Vehicle',
      dataIndex: ['vehicle', 'name'],
      key: 'vehicle',
    },
    {
      title: 'Maintenance Type',
      dataIndex: 'maintenanceType',
      key: 'maintenanceType',
      render: (type: string) => {
        const typeMap: Record<string, string> = {
          routine: 'Routine Check',
          battery: 'Battery Service',
          tire: 'Tire Replacement',
          software: 'Software Update',
          repair: 'Repair',
        };
        return typeMap[type] || type;
      },
    },
    {
      title: 'Scheduled Date',
      dataIndex: 'scheduledDate',
      key: 'scheduledDate',
      render: (date: string) => moment(date).format('YYYY-MM-DD'),
    },
    {
      title: 'Completed Date',
      dataIndex: 'completedDate',
      key: 'completedDate',
      render: (date: string) => date ? moment(date).format('YYYY-MM-DD') : '-',
    },
    {
      title: 'Cost',
      dataIndex: 'cost',
      key: 'cost',
      render: (cost: number) => cost ? `$${cost.toFixed(2)}` : '-',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'blue';
        if (status === 'in-progress') color = 'orange';
        if (status === 'completed') color = 'green';
        if (status === 'cancelled') color = 'red';
        
        return (
          <Tag color={color}>
            {status.toUpperCase().replace('-', ' ')}
          </Tag>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: MaintenanceRecord) => (
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
        <h1>Maintenance Records</h1>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={showCreateModal}
        >
          Add Maintenance Record
        </Button>
      </div>
      
      <Table 
        dataSource={records} 
        columns={columns} 
        rowKey="id" 
        loading={isLoading}
      />
      
      <Modal
        title={editingRecord ? 'Edit Maintenance Record' : 'Add New Maintenance Record'}
        visible={isModalVisible}
        onCancel={handleCancel}
        onOk={handleSubmit}
        confirmLoading={createRecordMutation.isLoading || updateRecordMutation.isLoading}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please enter a title' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="vehicle"
            label="Vehicle"
            rules={[{ required: true, message: 'Please select a vehicle' }]}
          >
            <Select loading={vehiclesLoading}>
              {vehicles.map(vehicle => (
                <Select.Option key={vehicle.id} value={vehicle.id}>
                  {vehicle.name} ({vehicle.licensePlate})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="maintenanceType"
            label="Maintenance Type"
            rules={[{ required: true, message: 'Please select maintenance type' }]}
          >
            <Select>
              <Select.Option value="routine">Routine Check</Select.Option>
              <Select.Option value="battery">Battery Service</Select.Option>
              <Select.Option value="tire">Tire Replacement</Select.Option>
              <Select.Option value="software">Software Update</Select.Option>
              <Select.Option value="repair">Repair</Select.Option>
              <Select.Option value="other">Other</Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="scheduledDate"
            label="Scheduled Date"
            rules={[{ required: true, message: 'Please select scheduled date' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item
            name="completedDate"
            label="Completed Date"
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item
            name="cost"
            label="Cost ($)"
          >
            <InputNumber 
              min={0} 
              precision={2} 
              style={{ width: '100%' }} 
              formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            //   parser={value => value ? parseFloat(value.replace(/\$\s?|(,*)/g, '')) : 0}
            />
          </Form.Item>
          
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select status' }]}
          >
            <Select>
              <Select.Option value="scheduled">Scheduled</Select.Option>
              <Select.Option value="in-progress">In Progress</Select.Option>
              <Select.Option value="completed">Completed</Select.Option>
              <Select.Option value="cancelled">Cancelled</Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="notes"
            label="Notes"
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </AppLayout>
  );
};

export default MaintenancePage;
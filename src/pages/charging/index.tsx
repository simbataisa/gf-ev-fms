import React, { useState } from 'react';
import { Table, Button, Space, Tag, Modal, Form, Input, Select, DatePicker, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';
import AppLayout from '../../components/Layout';
import { useChargingSchedules } from '../../hooks/useChargingSchedules';
import { useVehicles } from '../../hooks/useVehicles';
import { ChargingSchedule } from '../../types';

const { RangePicker } = DatePicker;

const ChargingPage: React.FC = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ChargingSchedule | null>(null);
  
  const { 
    useGetChargingSchedules, 
    useCreateChargingSchedule, 
    useUpdateChargingSchedule, 
    useDeleteChargingSchedule 
  } = useChargingSchedules();
  
  const { useGetVehicles } = useVehicles();
  
  const { data: schedules = [], isLoading } = useGetChargingSchedules();
  const { data: vehicles = [], isLoading: vehiclesLoading } = useGetVehicles();
  
  const createScheduleMutation = useCreateChargingSchedule();
  const updateScheduleMutation = useUpdateChargingSchedule();
  const deleteScheduleMutation = useDeleteChargingSchedule();

  const showCreateModal = () => {
    setEditingSchedule(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const showEditModal = (schedule: ChargingSchedule) => {
    setEditingSchedule(schedule);
    form.setFieldsValue({
      title: schedule.title,
      vehicle: schedule.vehicle.id,
      dateRange: [
        moment(schedule.scheduledStart),
        moment(schedule.scheduledEnd)
      ],
      chargingStation: schedule.chargingStation,
      targetChargeLevel: schedule.targetChargeLevel,
      status: schedule.status,
      notes: schedule.notes,
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
        scheduledStart: values.dateRange[0].toISOString(),
        scheduledEnd: values.dateRange[1].toISOString(),
      };
      
      delete formattedValues.dateRange;
      
      if (editingSchedule) {
        await updateScheduleMutation.mutateAsync({ 
          id: editingSchedule.id, 
          ...formattedValues 
        });
        message.success('Charging schedule updated successfully');
      } else {
        await createScheduleMutation.mutateAsync(formattedValues);
        message.success('Charging schedule created successfully');
      }
      
      setIsModalVisible(false);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this charging schedule?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          await deleteScheduleMutation.mutateAsync(id);
          message.success('Charging schedule deleted successfully');
        } catch (error) {
          message.error('Failed to delete charging schedule');
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
      title: 'Scheduled Start',
      dataIndex: 'scheduledStart',
      key: 'scheduledStart',
      render: (date: string) => moment(date).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: 'Scheduled End',
      dataIndex: 'scheduledEnd',
      key: 'scheduledEnd',
      render: (date: string) => moment(date).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: 'Charging Station',
      dataIndex: 'chargingStation',
      key: 'chargingStation',
    },
    {
      title: 'Target Charge',
      dataIndex: 'targetChargeLevel',
      key: 'targetChargeLevel',
      render: (level: number) => `${level}%`,
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
      render: (_: any, record: ChargingSchedule) => (
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
        <h1>Charging Schedules</h1>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={showCreateModal}
        >
          Add Charging Schedule
        </Button>
      </div>
      
      <Table 
        dataSource={schedules} 
        columns={columns} 
        rowKey="id" 
        loading={isLoading}
      />
      
      <Modal
        title={editingSchedule ? 'Edit Charging Schedule' : 'Add New Charging Schedule'}
        visible={isModalVisible}
        onCancel={handleCancel}
        onOk={handleSubmit}
        confirmLoading={createScheduleMutation.isLoading || updateScheduleMutation.isLoading}
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
            name="dateRange"
            label="Schedule Time"
            rules={[{ required: true, message: 'Please select schedule time' }]}
          >
            <RangePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item
            name="chargingStation"
            label="Charging Station"
            rules={[{ required: true, message: 'Please enter charging station' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="targetChargeLevel"
            label="Target Charge Level (%)"
            rules={[{ required: true, message: 'Please enter target charge level' }]}
          >
            <Select>
              <Select.Option value={50}>50%</Select.Option>
              <Select.Option value={75}>75%</Select.Option>
              <Select.Option value={80}>80%</Select.Option>
              <Select.Option value={90}>90%</Select.Option>
              <Select.Option value={100}>100%</Select.Option>
            </Select>
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

export default ChargingPage;
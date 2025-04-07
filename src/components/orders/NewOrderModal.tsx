import React from 'react';
import { Modal, Form, Input, Select, DatePicker } from 'antd';
import { Order } from '../../types';

const { Option } = Select;

interface NewOrderModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (order: Partial<Order>) => void;
}

const NewOrderModal: React.FC<NewOrderModalProps> = ({ 
  visible, 
  onCancel, 
  onSubmit 
}) => {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.validateFields().then(values => {
      onSubmit({
        customerName: values.customerName,
        customerPhone: values.customerPhone,
        customerEmail: values.customerEmail,
        address: values.address,
        orderType: values.orderType,
        scheduledTime: values.scheduledTime.toDate(),
        carModel: values.carModel,
      });
      form.resetFields();
    });
  };

  return (
    <Modal
      title="Create New Order"
      visible={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
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
  );
};

export default NewOrderModal;
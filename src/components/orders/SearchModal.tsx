import React from 'react';
import { Modal, Form, Input, Select, DatePicker, Row, Col } from 'antd';
import { Moment } from 'moment';

const { Option } = Select;

interface SearchCriteria {
  customerName?: string;
  orderType?: string;
  carModel?: string;
  status?: string;
  dateRange?: [Moment, Moment];
}

interface SearchModalProps {
  visible: boolean;
  onCancel: () => void;
  onSearch: (criteria: SearchCriteria) => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ 
  visible, 
  onCancel, 
  onSearch 
}) => {
  const [form] = Form.useForm();

  const handleSearch = () => {
    form.validateFields().then(values => {
      onSearch(values);
      form.resetFields();
    });
  };

  return (
    <Modal
      title="Advanced Search"
      visible={visible}
      onCancel={onCancel}
      onOk={handleSearch}
      width={700}
    >
      <Form
        form={form}
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
  );
};

export default SearchModal;
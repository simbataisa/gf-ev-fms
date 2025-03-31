import React, { useState, useEffect } from 'react';
import { 
  Typography, Table, Card, Button, Tag, Progress, 
  Space, Modal, Form, Input, DatePicker, Select, Row, Col 
} from 'antd';
import { 
  PlusOutlined, EditOutlined, DeleteOutlined, 
  CheckCircleOutlined, FileTextOutlined 
} from '@ant-design/icons';
import AppLayout from '../../components/Layout';
import moment from 'moment';

const { Title, Text } = Typography;
const { Option } = Select;

// Define the paperwork record type
interface PaperworkRecord {
  id: number;
  vehicleId: string;
  status: string;
  startDate: string;
  estimatedCompletion: string;
  progress: number;
  assignedTo: string;
  nextStep: string;
}

const VehicleOnboardingPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [paperworkData, setPaperworkData] = useState<PaperworkRecord[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<PaperworkRecord | null>(null);
  const [form] = Form.useForm();

  // Fetch paperwork data
  useEffect(() => {
    const fetchPaperworkData = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/paperwork');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setPaperworkData(data);
      } catch (error) {
        console.error('Error fetching paperwork data:', error);
        // Fallback to mock data if API fails
        setPaperworkData([
          { 
            id: 1, 
            vehicleId: 'EV-025', 
            status: 'Purchase Documentation', 
            startDate: '2023-05-10', 
            estimatedCompletion: '2023-05-25',
            progress: 30,
            assignedTo: 'John Smith',
            nextStep: 'Vendor Payment Confirmation'
          },
          { 
            id: 2, 
            vehicleId: 'EV-026', 
            status: 'Registration', 
            startDate: '2023-05-05', 
            estimatedCompletion: '2023-05-20',
            progress: 65,
            assignedTo: 'Maria Garcia',
            nextStep: 'DMV Appointment'
          },
          { 
            id: 3, 
            vehicleId: 'EV-027', 
            status: 'Number Plate Issuance', 
            startDate: '2023-05-01', 
            estimatedCompletion: '2023-05-15',
            progress: 85,
            assignedTo: 'Robert Chen',
            nextStep: 'Plate Installation'
          },
          { 
            id: 4, 
            vehicleId: 'EV-028', 
            status: 'Final Inspection', 
            startDate: '2023-04-25', 
            estimatedCompletion: '2023-05-12',
            progress: 95,
            assignedTo: 'Sarah Johnson',
            nextStep: 'Fleet Onboarding'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPaperworkData();
  }, []);

  // Handle form submission
  const handleSubmit = async (values: any) => {
    const formattedValues = {
      ...values,
      startDate: values.startDate.format('YYYY-MM-DD'),
      estimatedCompletion: values.estimatedCompletion.format('YYYY-MM-DD'),
    };

    try {
      if (editingRecord) {
        // Update existing record
        const response = await fetch(`/api/paperwork/${editingRecord.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formattedValues),
        });

        if (!response.ok) {
          throw new Error('Failed to update record');
        }

        const updatedRecord = await response.json();
        setPaperworkData(paperworkData.map(record => 
          record.id === editingRecord.id ? updatedRecord : record
        ));
      } else {
        // Create new record
        const response = await fetch('/api/paperwork', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formattedValues),
        });

        if (!response.ok) {
          throw new Error('Failed to create record');
        }

        const newRecord = await response.json();
        setPaperworkData([...paperworkData, newRecord]);
      }

      setIsModalVisible(false);
      form.resetFields();
      setEditingRecord(null);
    } catch (error) {
      console.error('Error saving record:', error);
    }
  };

  // Handle record deletion
  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/paperwork/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete record');
      }

      setPaperworkData(paperworkData.filter(record => record.id !== id));
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  };

  // Open modal for editing
  const handleEdit = (record: PaperworkRecord) => {
    setEditingRecord(record);
    form.setFieldsValue({
      ...record,
      startDate: moment(record.startDate),
      estimatedCompletion: moment(record.estimatedCompletion),
    });
    setIsModalVisible(true);
  };

  // Open modal for creating new record
  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const columns = [
    {
      title: 'Vehicle ID',
      dataIndex: 'vehicleId',
      key: 'vehicleId',
    },
    {
      title: 'Current Stage',
      dataIndex: 'status',
      key: 'status',
      render: (text: string) => {
        const statusColors: Record<string, string> = {
          'Purchase Documentation': '#1890ff',
          'Registration': '#52c41a',
          'Number Plate Issuance': '#faad14',
          'Final Inspection': '#722ed1'
        };
        return (
          <Tag color={statusColors[text] || '#1890ff'}>
            {text}
          </Tag>
        );
      }
    },
    {
      title: 'Assigned To',
      dataIndex: 'assignedTo',
      key: 'assignedTo',
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
    },
    {
      title: 'Est. Completion',
      dataIndex: 'estimatedCompletion',
      key: 'estimatedCompletion',
    },
    {
      title: 'Next Step',
      dataIndex: 'nextStep',
      key: 'nextStep',
    },
    {
      title: 'Progress',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress: number) => (
        <Progress percent={progress} size="small" status={progress >= 90 ? "success" : "active"} />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: PaperworkRecord) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Button 
            danger 
            icon={<DeleteOutlined />} 
            size="small"
            onClick={() => handleDelete(record.id)}
          >
            Delete
          </Button>
          {record.progress >= 95 && (
            <Button 
              type="primary" 
              icon={<CheckCircleOutlined />} 
              size="small"
              style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
            >
              Complete
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <AppLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={2}>
          <FileTextOutlined /> Vehicle Onboarding & Paperwork
        </Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          Add New Vehicle
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card>
            <Title level={4}>Onboarding Process Workflow</Title>
            <div style={{ margin: '20px 0', overflow: 'auto' }}>
              <div style={{ display: 'flex', minWidth: '900px' }}>
                {['Purchase Documentation', 'Registration', 'Insurance Processing', 'Tax Clearance', 
                  'Emissions Testing', 'Number Plate Issuance', 'Telematics Setup', 'Final Inspection', 
                  'Driver Assignment', 'Fleet Integration'].map((stage, index) => (
                  <div key={index} style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{ 
                      padding: '10px', 
                      margin: '0 5px', 
                      background: '#f0f2f5', 
                      borderRadius: '4px',
                      position: 'relative'
                    }}>
                      <div style={{ fontWeight: 'bold' }}>{stage}</div>
                      <div style={{ fontSize: '12px' }}>Stage {index + 1}</div>
                      {index < 9 && (
                        <div style={{ 
                          position: 'absolute', 
                          right: '-10px', 
                          top: '50%', 
                          transform: 'translateY(-50%)',
                          zIndex: 1,
                          color: '#1890ff'
                        }}>→</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Text>
              Manage the complete vehicle onboarding process from initial acquisition to operational readiness.
              Track paperwork status, assign responsibilities, and monitor progress.
            </Text>
          </Card>
        </Col>
      </Row>

      <Card style={{ marginTop: 16 }}>
        <Table 
          dataSource={paperworkData} 
          columns={columns} 
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={editingRecord ? "Edit Vehicle Onboarding" : "Add New Vehicle"}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="vehicleId"
            label="Vehicle ID"
            rules={[{ required: true, message: 'Please enter vehicle ID' }]}
          >
            <Input placeholder="e.g. EV-029" />
          </Form.Item>

          <Form.Item
            name="status"
            label="Current Stage"
            rules={[{ required: true, message: 'Please select current stage' }]}
          >
            <Select placeholder="Select current stage">
              <Option value="Purchase Documentation">Purchase Documentation</Option>
              <Option value="Registration">Registration</Option>
              <Option value="Number Plate Issuance">Number Plate Issuance</Option>
              <Option value="Final Inspection">Final Inspection</Option>
              <Option value="Insurance Processing">Insurance Processing</Option>
              <Option value="Tax Clearance">Tax Clearance</Option>
              <Option value="Emissions Testing">Emissions Testing</Option>
              <Option value="Fleet Integration">Fleet Integration</Option>
              <Option value="Driver Assignment">Driver Assignment</Option>
              <Option value="Telematics Setup">Telematics Setup</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="assignedTo"
            label="Assigned To"
            rules={[{ required: true, message: 'Please enter assignee name' }]}
          >
            <Input placeholder="e.g. John Smith" />
          </Form.Item>

          <Form.Item
            name="startDate"
            label="Start Date"
            rules={[{ required: true, message: 'Please select start date' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="estimatedCompletion"
            label="Estimated Completion"
            rules={[{ required: true, message: 'Please select estimated completion date' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="nextStep"
            label="Next Step"
            rules={[{ required: true, message: 'Please enter next step' }]}
          >
            <Input placeholder="e.g. Submit registration forms" />
          </Form.Item>

          <Form.Item
            name="progress"
            label="Progress (%)"
            rules={[
              { required: true, message: 'Please enter progress percentage' },
              { type: 'number', min: 0, max: 100, message: 'Progress must be between 0 and 100' }
            ]}
          >
            <Input type="number" placeholder="e.g. 75" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingRecord ? 'Update' : 'Create'}
              </Button>
              <Button onClick={() => setIsModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </AppLayout>
  );
};

export default VehicleOnboardingPage;
import React, { useState } from 'react';
import { Table, Button, Space, Card, Form, Select, DatePicker, Typography, Divider, Spin, message } from 'antd';
import { FileTextOutlined, DownloadOutlined, PieChartOutlined, BarChartOutlined } from '@ant-design/icons';
import moment from 'moment';
import AppLayout from '../../components/Layout';
import { Report } from '../../types';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const ReportsPage: React.FC = () => {
  const [form] = Form.useForm();
  const [generatingReport, setGeneratingReport] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const queryClient = useQueryClient();
  
  // Reports API hooks
  const getReports = async (): Promise<Report[]> => {
    const response = await axios.get('/api/reports');
    return response.data.docs;
  };

  const generateReport = async (reportData: any): Promise<Report> => {
    const response = await axios.post('/api/reports/generate', reportData);
    return response.data;
  };

  const { data: reports = [], isLoading } = useQuery('reports', getReports);
  
  const generateReportMutation = useMutation(generateReport, {
    onSuccess: () => {
      queryClient.invalidateQueries('reports');
    },
  });

  const handleGenerateReport = async () => {
    try {
      const values = await form.validateFields();
      
      setGeneratingReport(true);
      
      const reportData = {
        title: `${values.reportType.charAt(0).toUpperCase() + values.reportType.slice(1)} Report`,
        reportType: values.reportType,
        dateRange: {
          startDate: values.dateRange[0].toISOString(),
          endDate: values.dateRange[1].toISOString(),
        },
      };
      
      await generateReportMutation.mutateAsync(reportData);
      message.success('Report generated successfully');
      
    } catch (error) {
      console.error('Error generating report:', error);
      message.error('Failed to generate report');
    } finally {
      setGeneratingReport(false);
    }
  };

  const handleViewReport = (report: Report) => {
    setSelectedReport(report);
  };

  const handleDownloadReport = (report: Report) => {
    // In a real application, this would trigger a download
    message.success(`Downloading report: ${report.title}`);
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Report Type',
      dataIndex: 'reportType',
      key: 'reportType',
      render: (type: string) => {
        const typeMap: Record<string, string> = {
          usage: 'Vehicle Usage',
          charging: 'Charging Efficiency',
          maintenance: 'Maintenance Cost',
          fleet: 'Fleet Overview',
        };
        return typeMap[type] || type;
      },
    },
    {
      title: 'Date Range',
      key: 'dateRange',
      render: (_, record: Report) => (
        <span>
          {moment(record.dateRange.startDate).format('YYYY-MM-DD')} to {moment(record.dateRange.endDate).format('YYYY-MM-DD')}
        </span>
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => moment(date).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Report) => (
        <Space size="middle">
          <Button 
            icon={<FileTextOutlined />} 
            onClick={() => handleViewReport(record)}
          >
            View
          </Button>
          <Button 
            icon={<DownloadOutlined />} 
            onClick={() => handleDownloadReport(record)}
          >
            Download
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <AppLayout>
      <Title level={2}>Reports</Title>
      
      <Card title="Generate New Report" style={{ marginBottom: 24 }}>
        <Form
          form={form}
          layout="horizontal"
          onFinish={handleGenerateReport}
        >
          <Form.Item
            name="reportType"
            label="Report Type"
            rules={[{ required: true, message: 'Please select report type' }]}
          >
            <Select style={{ width: 200 }}>
              <Select.Option value="usage">Vehicle Usage</Select.Option>
              <Select.Option value="charging">Charging Efficiency</Select.Option>
              <Select.Option value="maintenance">Maintenance Cost</Select.Option>
              <Select.Option value="fleet">Fleet Overview</Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="dateRange"
            label="Date Range"
            rules={[{ required: true, message: 'Please select date range' }]}
          >
            <RangePicker />
          </Form.Item>
          
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit"
              loading={generatingReport}
              icon={<PieChartOutlined />}
            >
              Generate Report
            </Button>
          </Form.Item>
        </Form>
      </Card>
      
      <Card title="Report History">
        <Table 
          dataSource={reports} 
          columns={columns} 
          rowKey="id" 
          loading={isLoading}
        />
      </Card>
      
      {selectedReport && (
        <>
          <Divider />
          <Card 
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{selectedReport.title}</span>
                <Button 
                  icon={<DownloadOutlined />}
                  onClick={() => handleDownloadReport(selectedReport)}
                >
                  Download
                </Button>
              </div>
            }
          >
            <div style={{ marginBottom: 16 }}>
              <Text strong>Date Range: </Text>
              <Text>{moment(selectedReport.dateRange.startDate).format('YYYY-MM-DD')} to {moment(selectedReport.dateRange.endDate).format('YYYY-MM-DD')}</Text>
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <Text strong>Generated By: </Text>
              <Text>{selectedReport.generatedBy?.firstName} {selectedReport.generatedBy?.lastName}</Text>
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <Text strong>Created At: </Text>
              <Text>{moment(selectedReport.createdAt).format('YYYY-MM-DD HH:mm')}</Text>
            </div>
            
            {selectedReport.summary && (
              <div style={{ marginBottom: 16 }}>
                <Text strong>Summary: </Text>
                <Text>{selectedReport.summary}</Text>
              </div>
            )}
            
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
              <BarChartOutlined style={{ fontSize: 120, color: '#1890ff' }} />
            </div>
            
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <Text type="secondary">Report visualization would appear here in a real application</Text>
            </div>
          </Card>
        </>
      )}
    </AppLayout>
  );
};

export default ReportsPage;
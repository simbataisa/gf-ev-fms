import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Progress, Table, Typography, Divider } from 'antd';
import { CarOutlined, ThunderboltOutlined, ToolOutlined, ClockCircleOutlined, 
         EnvironmentOutlined, DollarOutlined, CheckCircleOutlined } from '@ant-design/icons';
import AppLayout from '../../components/Layout';
// Replace ant-design charts with recharts
import { LineChart, Line as RechartsLine, PieChart, Pie as RechartsPie, BarChart, Bar, 
         XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const { Title, Text } = Typography;

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

const DashboardPage: React.FC = () => {
  // Add loading state
  const [loading, setLoading] = useState(false);
  
  // Add state for paperwork data
  const [paperworkProcessData, setPaperworkProcessData] = useState<PaperworkRecord[]>([]);
  
  // Fetch paperwork data from API
  useEffect(() => {
    const fetchPaperworkData = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/paperwork');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setPaperworkProcessData(data);
      } catch (error) {
        console.error('Error fetching paperwork data:', error);
        // Fallback to mock data if API fails
        setPaperworkProcessData([
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
          // ... other mock data entries
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPaperworkData();
  }, []);
  
  // Mock data for dashboard
  const vehicleStats = {
    total: 24,
    available: 15,
    charging: 5,
    maintenance: 4
  };

  const chargingStats = {
    scheduled: 8,
    inProgress: 5,
    completed: 12
  };

  const maintenanceStats = {
    scheduled: 6,
    inProgress: 4,
    completed: 10
  };

  const recentActivities = [
    { id: 1, activity: 'Vehicle EV-001 completed charging', time: '10 minutes ago' },
    { id: 2, activity: 'Maintenance scheduled for EV-005', time: '1 hour ago' },
    { id: 3, activity: 'New vehicle EV-024 added to fleet', time: '3 hours ago' },
    { id: 4, activity: 'Battery replacement completed for EV-012', time: '5 hours ago' },
    { id: 5, activity: 'Charging schedule updated for tomorrow', time: '1 day ago' },
  ];

  const activityColumns = [
    {
      title: 'Activity',
      dataIndex: 'activity',
      key: 'activity',
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
    },
  ];

  // Energy consumption data for line chart
  const energyData = [
    { month: 'Jan', consumption: 320 },
    { month: 'Feb', consumption: 332 },
    { month: 'Mar', consumption: 301 },
    { month: 'Apr', consumption: 334 },
    { month: 'May', consumption: 390 },
    { month: 'Jun', consumption: 330 },
    { month: 'Jul', consumption: 320 },
    { month: 'Aug', consumption: 345 },
    { month: 'Sep', consumption: 310 },
    { month: 'Oct', consumption: 325 },
    { month: 'Nov', consumption: 356 },
    { month: 'Dec', consumption: 368 },
  ];

  // Vehicle status data for pie chart
  const vehicleStatusData = [
    { type: 'Available', value: vehicleStats.available },
    { type: 'Charging', value: vehicleStats.charging },
    { type: 'Maintenance', value: vehicleStats.maintenance },
  ];

  // Maintenance cost data for column chart
  const maintenanceCostData = [
    { type: 'Battery', cost: 12500 },
    { type: 'Tires', cost: 4800 },
    { type: 'Software', cost: 2300 },
    { type: 'Repairs', cost: 7600 },
    { type: 'Routine', cost: 3200 },
  ];

  // Top performing vehicles
  const topVehicles = [
    { id: 1, name: 'EV-007', mileage: '12,450 km', efficiency: '98%' },
    { id: 2, name: 'EV-015', mileage: '10,280 km', efficiency: '96%' },
    { id: 3, name: 'EV-003', mileage: '9,870 km', efficiency: '95%' },
  ];

  const vehicleColumns = [
    {
      title: 'Vehicle',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Mileage',
      dataIndex: 'mileage',
      key: 'mileage',
    },
    {
      title: 'Efficiency',
      dataIndex: 'efficiency',
      key: 'efficiency',
    },
  ];

  const paperworkColumns = [
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
          <span style={{ 
            color: 'white', 
            backgroundColor: statusColors[text] || '#1890ff',
            padding: '4px 8px',
            borderRadius: '4px'
          }}>
            {text}
          </span>
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
      title: 'Action',
      key: 'action',
      render: (_: any, record: any) => (
        <a href={`/vehicle-onboarding/${record.vehicleId}`}>
          {record.progress >= 95 ? 'Complete Onboarding' : 'View Details'}
        </a>
      ),
    },
  ];

  return (
    <AppLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={2}>Dashboard</Title>
        <Text type="secondary">Last updated: Today at 10:45 AM</Text>
      </div>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Vehicles"
              value={vehicleStats.total}
              prefix={<CarOutlined />}
            />
            <div style={{ marginTop: 16 }}>
              <Progress 
                percent={(vehicleStats.available / vehicleStats.total) * 100} 
                size="small" 
                format={() => `${vehicleStats.available} Available`}
              />
            </div>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Charging"
              value={chargingStats.inProgress}
              prefix={<ThunderboltOutlined />}
              suffix={`/ ${chargingStats.scheduled + chargingStats.inProgress}`}
            />
            <div style={{ marginTop: 16 }}>
              <Progress 
                percent={Math.round((chargingStats.inProgress / (chargingStats.scheduled + chargingStats.inProgress)) * 100)} 
                size="small"
              />
            </div>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Maintenance"
              value={maintenanceStats.inProgress}
              prefix={<ToolOutlined />}
              suffix={`/ ${maintenanceStats.scheduled + maintenanceStats.inProgress}`}
            />
            <div style={{ marginTop: 16 }}>
              <Progress 
                percent={Math.round((maintenanceStats.inProgress / (maintenanceStats.scheduled + maintenanceStats.inProgress)) * 100)} 
                size="small"
                status="active"
              />
            </div>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Fleet Efficiency"
              value={87}
              suffix="%"
              prefix={<ClockCircleOutlined />}
            />
            <div style={{ marginTop: 16 }}>
              <Progress percent={87} size="small" status="active" />
            </div>
          </Card>
        </Col>
      </Row>
      
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <Card title="Monthly Energy Consumption (kWh)">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={energyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <RechartsLine 
                  type="monotone" 
                  dataKey="consumption" 
                  stroke="#8884d8" 
                  activeDot={{ r: 8 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Vehicle Status Distribution">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <RechartsPie
                  data={vehicleStatusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="type"
                  label
                />
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
      
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={16}>
          <Card title="Maintenance Costs by Category">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={maintenanceCostData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="cost" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Top Performing Vehicles">
            <Table 
              dataSource={topVehicles} 
              columns={vehicleColumns} 
              pagination={false}
              rowKey="id"
            />
          </Card>
        </Col>
      </Row>
      
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <Card title="Fleet Summary">
            <Row gutter={[16, 8]}>
              <Col span={12}>
                <Statistic 
                  title="Total Distance" 
                  value={156789} 
                  suffix="km"
                  prefix={<EnvironmentOutlined />}
                />
              </Col>
              <Col span={12}>
                <Statistic 
                  title="Operating Cost" 
                  value={42350} 
                  prefix={<DollarOutlined />}
                  precision={2}
                />
              </Col>
              <Col span={12}>
                <Statistic 
                  title="Completed Trips" 
                  value={1243}
                  prefix={<CheckCircleOutlined />}
                />
              </Col>
              <Col span={12}>
                <Statistic 
                  title="Avg. Charge Time" 
                  value={3.5}
                  suffix="hrs"
                  prefix={<ThunderboltOutlined />}
                />
              </Col>
            </Row>
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card title="Recent Activities">
            <Table 
              dataSource={recentActivities} 
              columns={activityColumns} 
              pagination={false}
              rowKey="id"
            />
          </Card>
        </Col>
      </Row>
      
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24}>
          <Card 
            title="EV Acquisition & Paperwork Status" 
            extra={<a href="/vehicle-onboarding">Manage Onboarding</a>}
          >
            <Table 
              dataSource={paperworkProcessData} 
              columns={paperworkColumns} 
              pagination={false}
              rowKey="id"
              loading={loading}
            />
          </Card>
        </Col>
      </Row>
    </AppLayout>
  );
};

export default DashboardPage;
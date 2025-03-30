import React from 'react';
import { Row, Col, Card, Statistic, Progress, Table, Typography } from 'antd';
import { CarOutlined, ThunderboltOutlined, ToolOutlined, ClockCircleOutlined } from '@ant-design/icons';
import AppLayout from '../../components/Layout';

const { Title } = Typography;

const DashboardPage: React.FC = () => {
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

  return (
    <AppLayout>
      <Title level={2}>Dashboard</Title>
      
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
                percent={(chargingStats.inProgress / (chargingStats.scheduled + chargingStats.inProgress)) * 100} 
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
                percent={(maintenanceStats.inProgress / (maintenanceStats.scheduled + maintenanceStats.inProgress)) * 100} 
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
      
      <Row style={{ marginTop: 24 }}>
        <Col span={24}>
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
    </AppLayout>
  );
};

export default DashboardPage;
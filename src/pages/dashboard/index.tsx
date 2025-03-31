import React from 'react';
import { Row, Col, Card, Statistic, Progress, Table, Typography, Divider } from 'antd';
import { CarOutlined, ThunderboltOutlined, ToolOutlined, ClockCircleOutlined, 
         EnvironmentOutlined, DollarOutlined, CheckCircleOutlined } from '@ant-design/icons';
import AppLayout from '../../components/Layout';
import { Line, Pie, Column } from '@ant-design/charts';

const { Title, Text } = Typography;

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

  // Config for energy consumption line chart
  const lineConfig = {
    data: energyData,
    height: 250,
    xField: 'month',
    yField: 'consumption',
    point: {
      size: 4
    },
    smooth: true
  };

  // Config for vehicle status pie chart
  const pieConfig = {
    data: vehicleStatusData,
    height: 250,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    // Simplify label configuration
    legend: {
      position: 'bottom'
    }
  };

  // Config for maintenance cost column chart
  const columnConfig = {
    data: maintenanceCostData,
    height: 250,
    xField: 'type',
    yField: 'cost',
    // Remove label configuration that's causing issues
    meta: {
      cost: {
        alias: 'Cost ($)'
      }
    }
  };

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
      
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <Card title="Monthly Energy Consumption (kWh)">
            <Line {...lineConfig} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Vehicle Status Distribution">
            <Pie {...pieConfig} />
          </Card>
        </Col>
      </Row>
      
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={16}>
          <Card title="Maintenance Costs by Category">
            <Column {...columnConfig} />
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
    </AppLayout>
  );
};

export default DashboardPage;
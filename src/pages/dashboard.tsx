import React from 'react';
import { Row, Col, Card, Statistic, Table, Progress, Typography } from 'antd';
import { CarOutlined, ThunderboltOutlined, ToolOutlined, UserOutlined } from '@ant-design/icons';
import AppLayout from '../components/Layout';
import { useVehicles } from '../hooks/useVehicles';
import { useChargingSchedules } from '../hooks/useChargingSchedules';

const { Title } = Typography;

const Dashboard: React.FC = () => {
  const { useGetVehicles } = useVehicles();
  const { useGetChargingSchedules } = useChargingSchedules();
  
  const { data: vehicles = [], isLoading: vehiclesLoading } = useGetVehicles();
  const { data: chargingSchedules = [], isLoading: schedulesLoading } = useGetChargingSchedules();

  const availableVehicles = vehicles.filter(v => v.status === 'available').length;
  const inUseVehicles = vehicles.filter(v => v.status === 'in-use').length;
  const chargingVehicles = vehicles.filter(v => v.status === 'charging').length;
  const maintenanceVehicles = vehicles.filter(v => v.status === 'maintenance').length;

  const upcomingChargingSchedules = chargingSchedules
    .filter(s => s.status === 'scheduled')
    .slice(0, 5);

  const vehiclesWithLowBattery = vehicles
    .filter(v => v.currentCharge < 20)
    .slice(0, 5);

  const columns = [
    {
      title: 'Vehicle',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Current Charge',
      dataIndex: 'currentCharge',
      key: 'currentCharge',
      render: (charge: number) => (
        <Progress percent={charge} size="small" status={charge < 20 ? 'exception' : 'normal'} />
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' '),
    },
  ];

  const chargingColumns = [
    {
      title: 'Vehicle',
      dataIndex: ['vehicle', 'name'],
      key: 'vehicle',
    },
    {
      title: 'Scheduled Start',
      dataIndex: 'scheduledStart',
      key: 'scheduledStart',
      render: (date: Date) => new Date(date).toLocaleString(),
    },
    {
      title: 'Charging Station',
      dataIndex: 'chargingStation',
      key: 'chargingStation',
    },
    {
      title: 'Target Level',
      dataIndex: 'targetChargeLevel',
      key: 'targetChargeLevel',
      render: (level: number) => `${level}%`,
    },
  ];

  return (
    <AppLayout>
      <Title level={2}>Dashboard</Title>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Available Vehicles"
              value={availableVehicles}
              prefix={<CarOutlined />}
              loading={vehiclesLoading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="In Use"
              value={inUseVehicles}
              prefix={<UserOutlined />}
              loading={vehiclesLoading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Charging"
              value={chargingVehicles}
              prefix={<ThunderboltOutlined />}
              loading={vehiclesLoading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="In Maintenance"
              value={maintenanceVehicles}
              prefix={<ToolOutlined />}
              loading={vehiclesLoading}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} md={12}>
          <Card title="Vehicles with Low Battery">
            <Table
              dataSource={vehiclesWithLowBattery}
              columns={columns}
              rowKey="id"
              pagination={false}
              loading={vehiclesLoading}
            />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Upcoming Charging Schedules">
            <Table
              dataSource={upcomingChargingSchedules}
              columns={chargingColumns}
              rowKey="id"
              pagination={false}
              loading={schedulesLoading}
            />
          </Card>
        </Col>
      </Row>
    </AppLayout>
  );
};

export default Dashboard;
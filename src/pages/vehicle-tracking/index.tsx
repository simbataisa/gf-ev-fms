import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, useLoadScript, MarkerF, InfoWindowF, OverlayView } from "@react-google-maps/api";

import { 
  Typography, Card, Row, Col, Table, Tag, Button, Space, Statistic, 
  Modal, Spin, Switch, Divider
} from 'antd';
import { 
  CarOutlined, EnvironmentOutlined, DashboardOutlined, 
  ThunderboltOutlined, LockOutlined, UnlockOutlined, 
  StopOutlined, ReloadOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import AppLayout from '../../components/Layout';

const { Title, Text } = Typography;
const { confirm } = Modal;

// Define vehicle tracking interface
interface VehicleTrackingData {
  id: number;
  name: string;
  licensePlate: string;
  status: string;
  batteryLevel: number;
  odometer: number;
  location: {
    latitude: number;
    longitude: number;
    address: string;
    lastUpdated: string;
  };
  isLocked: boolean;
  isChargingEnabled: boolean;
  lastActivity: string;
  driver: string;
}

const VehicleTrackingPage: React.FC = () => {
  // Google Maps API loader
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    id: 'google-map-script'
  });

  const [vehicles, setVehicles] = useState<VehicleTrackingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleTrackingData | null>(null);
  const [mapLoading, setMapLoading] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [activeMarker, setActiveMarker] = useState<number | null>(null);

  // Map callbacks
  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Fetch vehicle data
  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/vehicles/tracking');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setVehicles(data);
      } catch (error) {
        console.error('Error fetching vehicle tracking data:', error);
        // Mock data for development with VinFast vehicles and Vietnam locations
        setVehicles([
          {
            id: 1,
            name: 'VF-8 Premium',
            licensePlate: '51F-123.45',
            status: 'Active',
            batteryLevel: 78,
            odometer: 12543,
            location: {
              latitude: 10.7769,
              longitude: 106.7009,
              address: '123 Nguyễn Huệ, District 1, Ho Chi Minh City',
              lastUpdated: '2023-05-15T14:30:00Z'
            },
            isLocked: true,
            isChargingEnabled: true,
            lastActivity: '2023-05-15T14:30:00Z',
            driver: 'Nguyen Van Minh'
          },
          {
            id: 2,
            name: 'VF-9 Luxury',
            licensePlate: '30F-789.12',
            status: 'Charging',
            batteryLevel: 45,
            odometer: 8721,
            location: {
              latitude: 21.0285,
              longitude: 105.8542,
              address: '456 Tràng Tiền, Hoàn Kiếm, Hanoi',
              lastUpdated: '2023-05-15T14:15:00Z'
            },
            isLocked: true,
            isChargingEnabled: true,
            lastActivity: '2023-05-15T14:15:00Z',
            driver: 'Tran Thi Lan'
          },
          {
            id: 3,
            name: 'VF-5 Plus',
            licensePlate: '43F-456.78',
            status: 'Inactive',
            batteryLevel: 12,
            odometer: 15632,
            location: {
              latitude: 16.0544,
              longitude: 108.2022,
              address: '789 Bạch Đằng, Hải Châu, Da Nang',
              lastUpdated: '2023-05-15T13:45:00Z'
            },
            isLocked: true,
            isChargingEnabled: false,
            lastActivity: '2023-05-15T13:45:00Z',
            driver: 'Le Quang Hai'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
    
    // Set up polling for real-time updates (every 30 seconds)
    const intervalId = setInterval(fetchVehicles, 30000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Handle vehicle selection
  const handleSelectVehicle = (vehicle: VehicleTrackingData) => {
    setSelectedVehicle(vehicle);
    setMapLoading(true);
    // Simulate map loading
    setTimeout(() => setMapLoading(false), 1000);
  };

  // Handle vehicle lock/unlock
  const handleLockToggle = async (vehicleId: number, currentState: boolean) => {
    confirm({
      title: `${currentState ? 'Unlock' : 'Lock'} Vehicle`,
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to ${currentState ? 'unlock' : 'lock'} this vehicle?`,
      onOk: async () => {
        try {
          // In a real app, you would call an API here
          // await fetch(`/api/vehicles/${vehicleId}/lock`, {
          //   method: 'POST',
          //   headers: { 'Content-Type': 'application/json' },
          //   body: JSON.stringify({ locked: !currentState })
          // });
          
          // Update local state
          setVehicles(vehicles.map(v => 
            v.id === vehicleId ? { ...v, isLocked: !currentState } : v
          ));
          
          if (selectedVehicle?.id === vehicleId) {
            setSelectedVehicle({ ...selectedVehicle, isLocked: !currentState });
          }
        } catch (error) {
          console.error('Error toggling vehicle lock:', error);
        }
      }
    });
  };

  // Handle charging enable/disable
  const handleChargingToggle = async (vehicleId: number, currentState: boolean) => {
    confirm({
      title: `${currentState ? 'Disable' : 'Enable'} Charging`,
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to ${currentState ? 'disable' : 'enable'} charging for this vehicle?`,
      onOk: async () => {
        try {
          // In a real app, you would call an API here
          // await fetch(`/api/vehicles/${vehicleId}/charging`, {
          //   method: 'POST',
          //   headers: { 'Content-Type': 'application/json' },
          //   body: JSON.stringify({ enabled: !currentState })
          // });
          
          // Update local state
          setVehicles(vehicles.map(v => 
            v.id === vehicleId ? { ...v, isChargingEnabled: !currentState } : v
          ));
          
          if (selectedVehicle?.id === vehicleId) {
            setSelectedVehicle({ ...selectedVehicle, isChargingEnabled: !currentState });
          }
        } catch (error) {
          console.error('Error toggling charging state:', error);
        }
      }
    });
  };

  // Table columns
  const columns = [
    {
      title: 'Vehicle',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: VehicleTrackingData) => (
        <a onClick={() => handleSelectVehicle(record)}>{text}</a>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'green';
        if (status === 'Inactive') color = 'volcano';
        else if (status === 'Charging') color = 'blue';
        return <Tag color={color}>{status}</Tag>;
      }
    },
    {
      title: 'Battery',
      dataIndex: 'batteryLevel',
      key: 'batteryLevel',
      render: (level: number) => {
        let color = 'success';
        if (level < 20) color = 'error';
        else if (level < 50) color = 'warning';
        return (
          <Space>
            <ThunderboltOutlined /> 
            <span style={{ color: level < 20 ? 'red' : level < 50 ? 'orange' : 'green' }}>
              {level}%
            </span>
          </Space>
        );
      }
    },
    {
      title: 'Location',
      dataIndex: ['location', 'address'],
      key: 'location',
      ellipsis: true,
    },
    {
      title: 'Driver',
      dataIndex: 'driver',
      key: 'driver',
    },
    {
      title: 'Controls',
      key: 'controls',
      render: (_: any, record: VehicleTrackingData) => (
        <Space size="small">
          <Button 
            type={record.isLocked ? "primary" : "default"}
            icon={record.isLocked ? <LockOutlined /> : <UnlockOutlined />}
            size="small"
            onClick={() => handleLockToggle(record.id, record.isLocked)}
          >
            {record.isLocked ? "Locked" : "Unlocked"}
          </Button>
          <Button 
            type={record.isChargingEnabled ? "primary" : "default"}
            danger={!record.isChargingEnabled}
            icon={record.isChargingEnabled ? <ThunderboltOutlined /> : <StopOutlined />}
            size="small"
            onClick={() => handleChargingToggle(record.id, record.isChargingEnabled)}
          >
            {record.isChargingEnabled ? "Charging Enabled" : "Charging Disabled"}
          </Button>
        </Space>
      )
    }
  ];

  return (
    <AppLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={2}>
          <CarOutlined /> Vehicle Tracking & Control
        </Title>
        <Button 
          type="primary" 
          icon={<ReloadOutlined />}
          onClick={() => window.location.reload()}
        >
          Refresh Data
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="Vehicle Fleet Status" loading={loading}>
            <Table 
              dataSource={vehicles} 
              columns={columns} 
              rowKey="id"
              pagination={false}
              onRow={(record) => ({
                onClick: () => handleSelectVehicle(record),
                style: { cursor: 'pointer' }
              })}
            />
          </Card>
        </Col>
        
        <Col xs={24} lg={8}>
          <Card 
            title={selectedVehicle ? `${selectedVehicle.name} Details` : "Select a Vehicle"} 
            style={{ marginBottom: 16 }}
          >
            {selectedVehicle ? (
              <>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Statistic 
                      title="Battery Level" 
                      value={selectedVehicle.batteryLevel} 
                      suffix="%" 
                      valueStyle={{ color: selectedVehicle.batteryLevel < 20 ? 'red' : selectedVehicle.batteryLevel < 50 ? 'orange' : 'green' }}
                      prefix={<ThunderboltOutlined />} 
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic 
                      title="Odometer" 
                      value={selectedVehicle.odometer} 
                      suffix="km" 
                      prefix={<DashboardOutlined />} 
                    />
                  </Col>
                </Row>
                
                <Divider />
                
                <div style={{ marginBottom: 16 }}>
                  <Text strong>Current Location:</Text>
                  <div style={{ marginTop: 8 }}>
                    <EnvironmentOutlined /> {selectedVehicle.location.address}
                  </div>
                  <div style={{ marginTop: 4, fontSize: '12px', color: 'rgba(0, 0, 0, 0.45)' }}>
                    Last updated: {new Date(selectedVehicle.location.lastUpdated).toLocaleString()}
                  </div>
                </div>
                
                <Divider />
                
                <div style={{ marginBottom: 16 }}>
                  <Text strong>Remote Controls:</Text>
                  <div style={{ marginTop: 12 }}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text>Lock/Unlock Vehicle:</Text>
                        <Switch 
                          checked={selectedVehicle.isLocked}
                          onChange={() => handleLockToggle(selectedVehicle.id, selectedVehicle.isLocked)}
                          checkedChildren={<LockOutlined />}
                          unCheckedChildren={<UnlockOutlined />}
                        />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text>Enable/Disable Charging:</Text>
                        <Switch 
                          checked={selectedVehicle.isChargingEnabled}
                          onChange={() => handleChargingToggle(selectedVehicle.id, selectedVehicle.isChargingEnabled)}
                          checkedChildren={<ThunderboltOutlined />}
                          unCheckedChildren={<StopOutlined />}
                        />
                      </div>
                    </Space>
                  </div>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <CarOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />
                <p style={{ marginTop: 16 }}>Select a vehicle from the table to view details and controls</p>
              </div>
            )}
          </Card>
          
          <Card title="GPS Location" style={{ height: 300 }}>
            {selectedVehicle ? (
              mapLoading ? (
                <div style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Spin tip="Loading map..." />
                </div>
              ) : (
                <div style={{ height: '220px', width: '100%' }}>
                  {isLoaded ? (
                    <GoogleMap
                      mapContainerStyle={{ height: '100%', width: '100%' }}
                      center={{
                        lat: selectedVehicle.location.latitude,
                        lng: selectedVehicle.location.longitude
                      }}
                      zoom={15}
                      onLoad={onLoad}
                      onUnmount={onUnmount}
                    >
                      <MarkerF
                        position={{
                          lat: selectedVehicle.location.latitude,
                          lng: selectedVehicle.location.longitude
                        }}
                        onClick={() => setActiveMarker(selectedVehicle.id)}
                      >
                        {activeMarker === selectedVehicle.id && (
                          <InfoWindowF onCloseClick={() => setActiveMarker(null)}>
                            <div>
                              <h3>{selectedVehicle.name}</h3>
                              <p>{selectedVehicle.location.address}</p>
                              <p>Battery: {selectedVehicle.batteryLevel}%</p>
                            </div>
                          </InfoWindowF>
                        )}
                      </MarkerF>
                    </GoogleMap>
                  ) : (
                    <div style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <Text type="warning">Google Maps API not loaded. Check your API key.</Text>
                    </div>
                  )}
                </div>
              )
            ) : (
              <div style={{ height: '220px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Text type="secondary">Select a vehicle to view its location</Text>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </AppLayout>
  );
};

export default VehicleTrackingPage;
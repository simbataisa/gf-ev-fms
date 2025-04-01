import React from 'react';
import { 
  Typography, Row, Col, Statistic, Divider, Space, Switch, Card, Spin, Modal
} from 'antd';
import { 
  ThunderboltOutlined, DashboardOutlined, EnvironmentOutlined, 
  LockOutlined, UnlockOutlined, StopOutlined, CarOutlined
} from '@ant-design/icons';
import { GoogleMap, MarkerF, InfoWindowF } from "@react-google-maps/api";

const { Text } = Typography;

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

interface VehicleTrackingDetailsProps {
  vehicle: VehicleTrackingData | null;
  visible: boolean;
  onClose: () => void;
  handleLockToggle: (vehicleId: number, currentState: boolean) => void;
  handleChargingToggle: (vehicleId: number, currentState: boolean) => void;
  mapLoading: boolean;
  isLoaded: boolean;
  onLoad: (map: google.maps.Map) => void;
  onUnmount: () => void;
  activeMarker: number | null;
  setActiveMarker: (id: number | null) => void;
}

const VehicleTrackingDetails: React.FC<VehicleTrackingDetailsProps> = ({
  vehicle,
  visible,
  onClose,
  handleLockToggle,
  handleChargingToggle,
  mapLoading,
  isLoaded,
  onLoad,
  onUnmount,
  activeMarker,
  setActiveMarker
}) => {
  if (!vehicle) return null;

  return (
    <Modal
      title={`${vehicle.name} Details`}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Statistic 
                  title="Battery Level" 
                  value={vehicle.batteryLevel} 
                  suffix="%" 
                  valueStyle={{ color: vehicle.batteryLevel < 20 ? 'red' : vehicle.batteryLevel < 50 ? 'orange' : 'green' }}
                  prefix={<ThunderboltOutlined />} 
                />
              </Col>
              <Col span={12}>
                <Statistic 
                  title="Odometer" 
                  value={vehicle.odometer} 
                  suffix="km" 
                  prefix={<DashboardOutlined />} 
                />
              </Col>
            </Row>
            
            <Divider />
            
            <div style={{ marginBottom: 16 }}>
              <Text strong>Current Location:</Text>
              <div style={{ marginTop: 8 }}>
                <EnvironmentOutlined /> {vehicle.location.address}
              </div>
              <div style={{ marginTop: 4, fontSize: '12px', color: 'rgba(0, 0, 0, 0.45)' }}>
                Last updated: {new Date(vehicle.location.lastUpdated).toLocaleString()}
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
                      checked={vehicle.isLocked}
                      onChange={() => handleLockToggle(vehicle.id, vehicle.isLocked)}
                      checkedChildren={<LockOutlined />}
                      unCheckedChildren={<UnlockOutlined />}
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text>Enable/Disable Charging:</Text>
                    <Switch 
                      checked={vehicle.isChargingEnabled}
                      onChange={() => handleChargingToggle(vehicle.id, vehicle.isChargingEnabled)}
                      checkedChildren={<ThunderboltOutlined />}
                      unCheckedChildren={<StopOutlined />}
                    />
                  </div>
                </Space>
              </div>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} md={12}>
          <Card title="GPS Location" style={{ height: 300 }}>
            {mapLoading ? (
              <div style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Spin tip="Loading map..." />
              </div>
            ) : (
              <div style={{ height: '220px', width: '100%' }}>
                {isLoaded ? (
                  <GoogleMap
                    mapContainerStyle={{ height: '100%', width: '100%' }}
                    center={{
                      lat: vehicle.location.latitude,
                      lng: vehicle.location.longitude
                    }}
                    zoom={15}
                    onLoad={onLoad}
                    onUnmount={onUnmount}
                  >
                    <MarkerF
                      position={{
                        lat: vehicle.location.latitude,
                        lng: vehicle.location.longitude
                      }}
                      onClick={() => setActiveMarker(vehicle.id)}
                    >
                      {activeMarker === vehicle.id && (
                        <InfoWindowF onCloseClick={() => setActiveMarker(null)}>
                          <div>
                            <h3>{vehicle.name}</h3>
                            <p>{vehicle.location.address}</p>
                            <p>Battery: {vehicle.batteryLevel}%</p>
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
            )}
          </Card>
        </Col>
      </Row>
    </Modal>
  );
};

export default VehicleTrackingDetails;
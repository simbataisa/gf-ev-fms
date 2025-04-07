import React from 'react';
import { Modal, Button, Row, Col, Card, Statistic, Progress, Empty } from 'antd';
import { Moment } from 'moment';
import { Order, Driver } from '../../types';
import OrderTable from './OrderTable';

interface DayViewModalProps {
  visible: boolean;
  onClose: () => void;
  selectedDate: Moment | null;
  orders: Order[];
  drivers: Driver[];
  maxDailySlots: number;
  onAssignDriver: (order: Order) => void;
}

const DayViewModal: React.FC<DayViewModalProps> = ({
  visible,
  onClose,
  selectedDate,
  orders,
  drivers,
  maxDailySlots,
  onAssignDriver
}) => {
  return (
    <Modal
      title={selectedDate ? `Orders for ${selectedDate.format('MMMM D, YYYY')}` : 'Day View'}
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>
      ]}
      width={1000}
    >
      <div style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Card>
              <Statistic 
                title="Total Orders" 
                value={orders.length} 
                suffix={`/ ${maxDailySlots}`}
              />
              <div style={{ marginTop: 8 }}>
                <Progress 
                  percent={Math.round((orders.length / maxDailySlots) * 100)} 
                  status={
                    orders.length / maxDailySlots > 0.7 
                      ? 'exception' 
                      : orders.length / maxDailySlots > 0.3 
                        ? 'normal' 
                        : 'success'
                  }
                />
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic 
                title="Pending Orders" 
                value={orders.filter(order => order.status === 'pending').length} 
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic 
                title="Assigned Orders" 
                value={orders.filter(order => order.status === 'assigned').length} 
              />
            </Card>
          </Col>
        </Row>
      </div>
      
      <OrderTable 
        orders={orders} 
        drivers={drivers} 
        onAssignDriver={onAssignDriver} 
      />
      
      {orders.length === 0 && (
        <Empty description="No orders scheduled for this day" />
      )}
    </Modal>
  );
};

export default DayViewModal;
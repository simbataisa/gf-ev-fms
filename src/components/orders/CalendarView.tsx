import React from 'react';
import { Calendar, Badge, Card } from 'antd';
import { Order } from '../../types';
import moment, { Moment } from 'moment';

interface CalendarViewProps {
  orders: Order[];
  maxDailySlots: number;
  onSelectDate: (date: Moment) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ 
  orders, 
  maxDailySlots, 
  onSelectDate 
}) => {
  // Function to get orders for a specific date
  const getOrdersForDate = (date: Moment) => {
    return orders.filter(order => {
      const orderDate = moment(order.scheduledTime);
      return orderDate.isSame(date, 'day');
    });
  };

  // Function to get the booking status color for a date
  const getBookingStatusColor = (date: Moment) => {
    const ordersForDate = getOrdersForDate(date);
    const bookingPercentage = (ordersForDate.length / maxDailySlots) * 100;
    
    if (bookingPercentage < 30) return 'green';
    if (bookingPercentage < 70) return 'orange';
    return 'red';
  };

  // Function to render calendar cell content
  const dateCellRender = (date: Moment) => {
    const ordersForDate = getOrdersForDate(date);
    const statusColor = getBookingStatusColor(date);
    
    return (
      <>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: 4
        }}>
          <Badge 
            color={statusColor} 
            text={
              <span style={{ fontSize: '0.8em' }}>
                {ordersForDate.length}/{maxDailySlots} slots
              </span>
            } 
          />
        </div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {ordersForDate.map(order => {
            let color = 'blue';
            if (order.status === 'assigned') color = 'orange';
            if (order.status === 'completed') color = 'green';
            
            const time = moment(order.scheduledTime).format('HH:mm');
            
            return (
              <li key={order.id} style={{ marginBottom: 3 }}>
                <Badge 
                  color={color} 
                  text={
                    <span style={{ fontSize: '0.8em' }}>
                      {time} - {order.customerName.split(' ')[0]} ({order.orderType === 'delivery' ? 'D' : 'P'})
                    </span>
                  } 
                />
              </li>
            );
          })}
        </ul>
      </>
    );
  };

  return (
    <Card>
      <Calendar 
        dateCellRender={dateCellRender} 
        onSelect={onSelectDate}
      />
    </Card>
  );
};

export default CalendarView;
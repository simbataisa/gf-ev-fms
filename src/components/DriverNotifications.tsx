import React, { useState, useEffect } from 'react';
import { Badge, Dropdown, Menu, List, Typography, Space, Avatar, Button } from 'antd';
import { BellOutlined, CheckOutlined, CarOutlined, UserOutlined, DollarOutlined } from '@ant-design/icons';
import { Notification } from '../types';
import moment from 'moment';

const { Text } = Typography;

interface DriverNotificationsProps {
  driverId: string;
}

const DriverNotifications: React.FC<DriverNotificationsProps> = ({ driverId }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, [driverId]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/notifications?userId=${driverId}`);
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PUT'
      });
      
      // Update local state
      setNotifications(notifications.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true } 
          : notification
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch(`/api/notifications/read-all`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: driverId }),
      });
      
      // Update local state
      setNotifications(notifications.map(notification => ({ ...notification, read: true })));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <BellOutlined style={{ color: '#1890ff' }} />;
      case 'success':
        return <CheckOutlined style={{ color: '#52c41a' }} />;
      case 'warning':
        return <CarOutlined style={{ color: '#faad14' }} />;
      case 'error':
        return <DollarOutlined style={{ color: '#f5222d' }} />;
      default:
        return <BellOutlined />;
    }
  };

  const menu = (
    <Menu style={{ width: 350 }}>
      <Menu.Item key="header" disabled style={{ cursor: 'default' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text strong>Notifications</Text>
          <Button type="link" size="small" onClick={markAllAsRead}>
            Mark all as read
          </Button>
        </div>
      </Menu.Item>
      <Menu.Divider />
      <div style={{ maxHeight: 400, overflow: 'auto' }}>
        <List
          dataSource={notifications}
          loading={loading}
          renderItem={notification => (
            <Menu.Item key={notification.id} onClick={() => markAsRead(notification.id)}>
              <List.Item style={{ opacity: notification.read ? 0.6 : 1 }}>
                <List.Item.Meta
                  avatar={
                    <Avatar icon={getNotificationIcon(notification.type)} />
                  }
                  title={notification.title}
                  description={
                    <Space direction="vertical" size={0}>
                      <Text>{notification.message}</Text>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {moment(notification.createdAt).fromNow()}
                      </Text>
                    </Space>
                  }
                />
              </List.Item>
            </Menu.Item>
          )}
          locale={{ emptyText: 'No notifications' }}
        />
      </div>
      <Menu.Divider />
      <Menu.Item key="footer">
        <Button type="link" block>
          View all notifications
        </Button>
      </Menu.Item>
    </Menu>
  );

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
      <Badge count={unreadCount} overflowCount={99}>
        <Avatar icon={<BellOutlined />} style={{ backgroundColor: '#1890ff', cursor: 'pointer' }} />
      </Badge>
    </Dropdown>
  );
};

export default DriverNotifications;
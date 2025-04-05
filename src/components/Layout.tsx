import React, { ReactNode } from 'react';
import { Layout, Menu, Typography, Avatar, Dropdown, Space, Badge } from 'antd';
import { 
  DashboardOutlined, 
  CarOutlined, 
  ThunderboltOutlined, 
  ToolOutlined, 
  FileTextOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ShoppingCartOutlined,
  BellOutlined
} from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/router';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = React.useState(false);
  const router = useRouter();

  const toggle = () => {
    setCollapsed(!collapsed);
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        Profile
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} danger>
        Logout
      </Menu.Item>
    </Menu>
  );

  const notificationMenu = (
    <Menu>
      <Menu.Item key="notification1">
        <b>New order assigned</b>
        <div>Order #123 has been assigned to driver Nguyễn Văn An</div>
      </Menu.Item>
      <Menu.Item key="notification2">
        <b>Vehicle maintenance due</b>
        <div>VF 8 (51F-123.45) is due for maintenance</div>
      </Menu.Item>
      <Menu.Item key="notification3">
        <b>Driver license expiring</b>
        <div>Trần Thị Bình's license expires in 30 days</div>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="viewAll">
        <a>View all notifications</a>
      </Menu.Item>
    </Menu>
  );

  // Define menu items
  const items = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: <Link href="/">Dashboard</Link>,
    },
    {
      key: '/vehicles',
      icon: <CarOutlined />,
      label: <Link href="/vehicles">Vehicles</Link>,
    },
    {
      key: '/orders',
      icon: <ShoppingCartOutlined />,
      label: <Link href="/orders">Order Management</Link>,
    },
    {
      key: '/drivers',
      icon: <UserOutlined />,
      label: <Link href="/drivers">Drivers</Link>,
    },
    {
      key: '/vehicle-onboarding',
      icon: <FileTextOutlined />,
      label: <Link href="/vehicle-onboarding">Vehicle Onboarding</Link>,
    },
    {
      key: '/charging',
      icon: <ThunderboltOutlined />,
      label: <Link href="/charging">Charging</Link>,
    },
    {
      key: '/maintenance',
      icon: <ToolOutlined />,
      label: <Link href="/maintenance">Maintenance</Link>,
    },
    {
      key: '/vehicle-tracking',
      icon: <ThunderboltOutlined />,
      label: <Link href="/vehicle-tracking">Vehicle Tracking</Link>,
    },
    {
      key: '/reports',
      icon: <FileTextOutlined />,
      label: <Link href="/reports">Reports</Link>,
    },
    {
      key: '/users',
      icon: <UserOutlined />,
      label: <Link href="/users">Users</Link>,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed} 
        width={250}
        style={{
          boxShadow: '2px 0 8px rgba(0,0,0,0.15)',
          zIndex: 10
        }}
      >
        <div style={{ 
          height: 64, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          margin: '16px 0',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: collapsed ? '50%' : '4px',
          width: collapsed ? '40px' : '80%',
          marginLeft: collapsed ? 'auto' : '10%',
          marginRight: collapsed ? 'auto' : '10%',
          padding: '8px'
        }}>
          <Title level={4} style={{ color: 'white', margin: 0 }}>
            {collapsed ? 'EV' : 'EV Management'}
          </Title>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[router.pathname]}
          items={items}
          style={{ borderRight: 0 }}
        />
      </Sider>
      <Layout>
        <Header style={{ 
          background: '#fff', 
          padding: '0 16px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
          zIndex: 9
        }}>
          <div className="left-section" style={{ display: 'flex', alignItems: 'center' }}>
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              onClick: toggle,
              style: { fontSize: '18px' }
            })}
          </div>
          <div className="right-section" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Dropdown overlay={notificationMenu} trigger={['click']}>
              <Badge count={3} style={{ cursor: 'pointer' }}>
                <BellOutlined style={{ fontSize: '18px' }} />
              </Badge>
            </Dropdown>
            <Dropdown overlay={userMenu} trigger={['click']}>
              <Space style={{ cursor: 'pointer' }}>
                <Avatar style={{ backgroundColor: '#1890ff' }} icon={<UserOutlined />} />
                <span>Admin User</span>
              </Space>
            </Dropdown>
          </div>
        </Header>
        <Content style={{ 
          margin: '24px 16px', 
          padding: 24, 
          background: '#fff', 
          minHeight: 280,
          borderRadius: '8px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
        }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
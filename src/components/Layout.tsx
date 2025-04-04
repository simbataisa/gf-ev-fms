import React, { ReactNode } from 'react';
import { Layout, Menu, Typography, Avatar, Dropdown, Space } from 'antd';
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
  ShoppingCartOutlined
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
      <Sider trigger={null} collapsible collapsed={collapsed} width={250}>
        <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '16px 0' }}>
          <Title level={4} style={{ color: 'white', margin: 0 }}>
            {collapsed ? 'EV' : 'EV Management'}
          </Title>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[router.pathname]}
          items={items}
        />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: 'trigger',
            onClick: toggle,
            style: { fontSize: '18px' }
          })}
          <Dropdown overlay={userMenu} trigger={['click']}>
            <Space style={{ cursor: 'pointer' }}>
              <Avatar icon={<UserOutlined />} />
              <span>Admin User</span>
            </Space>
          </Dropdown>
        </Header>
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
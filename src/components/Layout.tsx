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
  MenuUnfoldOutlined
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
        >
          <Menu.Item key="/dashboard" icon={<DashboardOutlined />}>
            <Link href="/dashboard">Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="/vehicles" icon={<CarOutlined />}>
            <Link href="/vehicles">Vehicles</Link>
          </Menu.Item>
          <Menu.Item key="/charging" icon={<ThunderboltOutlined />}>
            <Link href="/charging">Charging</Link>
          </Menu.Item>
          <Menu.Item key="/maintenance" icon={<ToolOutlined />}>
            <Link href="/maintenance">Maintenance</Link>
          </Menu.Item>
          <Menu.Item key="/vehicle-onboarding" icon={<FileTextOutlined />}>
            <Link href="/vehicle-onboarding">Paperwork & Onboarding</Link>
          </Menu.Item>
          <Menu.Item key="/reports" icon={<FileTextOutlined />}>
            <Link href="/reports">Reports</Link>
          </Menu.Item>
          <Menu.Item key="/users" icon={<UserOutlined />}>
            <Link href="/users">Users</Link>
          </Menu.Item>
        </Menu>
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

// In the menu items section
const items = [
  {
    key: '1',
    icon: <DashboardOutlined />,
    label: <Link href="/">Dashboard</Link>,
  },
  {
    key: '2',
    icon: <CarOutlined />,
    label: <Link href="/fleet-management">Fleet Management</Link>,
  },
  {
    key: '3',
    icon: <ToolOutlined />,
    label: <Link href="/maintenance">Maintenance</Link>,
  },
  {
    key: '4',
    icon: <FileTextOutlined />,
    label: <Link href="/vehicle-onboarding">Vehicle Onboarding</Link>,
  },
  {
    key: '5',
    icon: <UserOutlined />,
    label: <Link href="/driver-management">Driver Management</Link>,
  },
  {
    key: '6',
    icon: <ThunderboltOutlined />,
    label: <Link href="/vehicle-tracking">Vehicle Tracking</Link>,
  },
];
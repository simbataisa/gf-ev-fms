import React, { useState } from 'react';
import { Layout, Menu, Button } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  DashboardOutlined,
  CarOutlined,
  ThunderboltOutlined,
  ToolOutlined,
  UserOutlined,
  SettingOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/router';

const { Header, Sider, Content } = Layout;

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();

  const toggle = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo" style={{ height: 64, padding: 16, color: 'white', fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>
          {collapsed ? 'EV' : 'EV Fleet Manager'}
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={[router.pathname]}>
          <Menu.Item key="/" icon={<DashboardOutlined />}>
            <Link href="/">Dashboard</Link>
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
          <Menu.Item key="/users" icon={<UserOutlined />}>
            <Link href="/users">Users</Link>
          </Menu.Item>
          <Menu.Item key="/settings" icon={<SettingOutlined />}>
            <Link href="/settings">Settings</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0, background: '#fff' }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={toggle}
            style={{ fontSize: '16px', width: 64, height: 64 }}
          />
        </Header>
        <Content
          className="site-layout-background"
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: '#fff',
            overflowY: 'auto'
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
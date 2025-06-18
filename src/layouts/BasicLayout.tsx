import React, { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Button } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import type { MenuProps } from 'antd';
import {
  UserOutlined,
  HomeOutlined,
  ShopOutlined,
  HomeOutlined as RentalOutlined,
  FundProjectionScreenOutlined,
  ShoppingOutlined,
  FileTextOutlined,
  WalletOutlined,
  TeamOutlined,
  ShopOutlined as MerchantOutlined,
  SettingOutlined,
  BarChartOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

const BasicLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人信息',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },
  ];

  const handleUserMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      localStorage.removeItem('token');
      navigate('/login');
    } else if (key === 'profile') {
      navigate('/settings/account');
    }
  };

  const menuItems: MenuProps['items'] = [
    {
      key: 'dashboard',
      icon: <HomeOutlined />,
      label: '数据总览',
    },
    {
      key: 'hotel',
      icon: <ShopOutlined />,
      label: '酒店管理',
      children: [
        {
          key: 'hotel/rooms',
          label: '房间管理',
        },
        {
          key: 'hotel/order',
          label: '订单管理',
        },
        {
          key: 'hotel/reviews',
          label: '评价管理',
        },
        {
          key: 'hotel/audit',
          label: '审核管理',
        },
      ],
    },
    {
      key: 'rental',
      icon: <RentalOutlined />,
      label: '租房管理',
      children: [
        {
          key: 'rental/rooms',
          label: '房源管理',
        },
        {
          key: 'rental/appointments',
          label: '预约管理',
        },
        {
          key: 'rental/audit',
          label: '审核管理',
        },
      ],
    },
    {
      key: 'leads',
      icon: <FundProjectionScreenOutlined />,
      label: '线索管理',
      children: [
        {
          key: 'leads/list',
          label: '线索列表',
        },
      ],
    },
    {
      key: 'marketing',
      icon: <ShoppingOutlined />,
      label: '营销管理',
      children: [
        {
          key: 'marketing/promotions/dashboard',
          label: '推广活动总览',
        },
        {
          key: 'marketing/promotions/audit',
          label: '活动审核管理',
        },
        {
          key: 'marketing/promotions/monitor',
          label: '活动监控管理',
        },
        {
          key: 'marketing/promotions/analysis',
          label: '推广数据分析',
        },
        {
          key: 'marketing/ads',
          label: '广告管理',
        },
        {
          key: 'marketing/coupons',
          label: '优惠券管理',
        },
        {
          key: 'marketing/activities',
          label: '活动管理',
        },
      ],
    },
    {
      key: 'content',
      icon: <FileTextOutlined />,
      label: '内容管理',
      children: [
        {
          key: 'content/audit',
          label: '内容审核',
        },
      ],
    },
    {
      key: 'finance',
      icon: <WalletOutlined />,
      label: '财务管理',
      children: [
        {
          key: 'finance/revenue',
          label: '收入统计',
        },
        {
          key: 'finance/invoice',
          label: '发票管理',
        },
        {
          key: 'finance/settlement',
          label: '结算管理',
        },
      ],
    },
    {
      key: 'user',
      icon: <TeamOutlined />,
      label: '用户管理',
      children: [
        {
          key: 'user/list',
          label: '用户列表',
        },
        {
          key: 'user/feedback',
          label: '用户反馈',
        },
      ],
    },
    {
      key: 'merchant',
      icon: <MerchantOutlined />,
      label: '商家管理',
      children: [
        {
          key: 'merchant/list',
          label: '商家列表',
        },
        {
          key: 'merchant/audit',
          label: '入驻审核',
        },
        {
          key: 'merchant/finance',
          label: '财务管理',
        },
        {
          key: 'merchant/review',
          label: '评价管理',
        },
      ],
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '系统设置',
      children: [
        {
          key: 'settings/account',
          label: '账号管理',
        },
        {
          key: 'settings/role',
          label: '角色权限',
        },
        {
          key: 'settings/config',
          label: '系统配置',
        },
      ],
    },
    {
      key: 'stats',
      icon: <BarChartOutlined />,
      label: '数据统计',
      children: [
        {
          key: 'stats/business',
          label: '业务统计',
        },
        {
          key: 'stats/conversion',
          label: '转化统计',
        },
        {
          key: 'stats/trend',
          label: '趋势分析',
        },
      ],
    },
  ];

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    navigate(`/${key}`);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        padding: '0 24px', 
        background: '#fff', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        height: 64,
        boxShadow: '0 1px 4px rgba(0,21,41,.08)'
      }}>
        <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
          瞬寻平台管理后台
        </div>
        <Dropdown menu={{ items: userMenuItems, onClick: handleUserMenuClick }} placement="bottomRight">
          <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <Avatar icon={<UserOutlined />} />
            <span style={{ marginLeft: 8 }}>管理员</span>
          </div>
        </Dropdown>
      </Header>
      <Layout hasSider style={{ marginTop: 64 }}>
        <Sider 
          width={200} 
          style={{ 
            background: '#fff',
            height: 'calc(100vh - 64px)',
            position: 'fixed',
            left: 0,
            top: 64,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '2px 0 8px 0 rgba(29,35,41,.05)'
          }}
          collapsible 
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          trigger={null}
        >
          <div style={{ 
            flex: 1, 
            overflow: 'auto',
            borderRight: '1px solid #f0f0f0'
          }}>
            <Menu
              mode="inline"
              style={{ 
                height: '100%',
                borderRight: 0,
              }}
              items={menuItems}
              onClick={handleMenuClick}
              selectedKeys={[location.pathname.slice(1)]}
              defaultOpenKeys={[location.pathname.split('/')[1]]}
            />
          </div>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: '100%',
              height: 48,
              borderRadius: 0,
              borderTop: '1px solid #f0f0f0'
            }}
          />
        </Sider>
        <Layout style={{ 
          marginLeft: collapsed ? 80 : 200,
          transition: 'margin-left 0.2s',
          minHeight: 'calc(100vh - 64px)',
          background: '#f0f2f5',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <Content style={{ 
            padding: 24,
            height: 'calc(100vh - 64px)',
            overflow: 'auto'
          }}>
            <div style={{
              background: '#fff',
              padding: 24,
              borderRadius: 4,
              minHeight: '100%'
            }}>
              <Outlet />
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default BasicLayout; 
import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import BasicLayout from '../layouts/BasicLayout';
import Login from '../pages/login';
import Dashboard from '../pages/dashboard';
import NotFound from '../pages/404';

// 懒加载页面组件
const HotelRooms = React.lazy(() => import('../pages/hotel/rooms'));
const HotelOrder = React.lazy(() => import('../pages/hotel/order'));
const HotelOrderStats = React.lazy(() => import('../pages/hotel/order/stats'));
const HotelOrderDetail = React.lazy(() => import('../pages/hotel/order/detail'));
const HotelReviews = React.lazy(() => import('../pages/hotel/reviews'));
const HotelAudit = React.lazy(() => import('../pages/hotel/audit'));

const RentalRooms = React.lazy(() => import('../pages/rental/rooms'));
const RentalAudit = React.lazy(() => import('../pages/rental/audit'));
const RentalAppointments = React.lazy(() => import('../pages/rental/appointments'));

const LeadsList = React.lazy(() => import('../pages/leads/list'));
const LeadsDetail = React.lazy(() => import('../pages/leads/detail'));
const LeadsEdit = React.lazy(() => import('../pages/leads/edit'));
const LeadsFollow = React.lazy(() => import('../pages/leads/follow'));

const MarketingAds = React.lazy(() => import('../pages/marketing/ads'));
const MarketingCoupons = React.lazy(() => import('../pages/marketing/coupons'));
const MarketingActivities = React.lazy(() => import('../pages/marketing/activities'));
const MarketingPromotionsDashboard = React.lazy(() => import('../pages/marketing/promotions/dashboard'));
const MarketingPromotionsAudit = React.lazy(() => import('../pages/marketing/promotions/audit'));
const MarketingPromotionsMonitor = React.lazy(() => import('../pages/marketing/promotions/monitor'));
const MarketingPromotionsAnalysis = React.lazy(() => import('../pages/marketing/promotions/analysis'));

const ContentAudit = React.lazy(() => import('../pages/content/audit'));

const FinanceRevenue = React.lazy(() => import('../pages/finance/revenue'));
const FinanceInvoice = React.lazy(() => import('../pages/finance/invoice'));
const FinanceSettlement = React.lazy(() => import('../pages/finance/settlement'));

const UserList = React.lazy(() => import('../pages/user/list'));
const UserFeedback = React.lazy(() => import('../pages/user/feedback'));

const MerchantList = React.lazy(() => import('../pages/merchant/list'));
const MerchantAudit = React.lazy(() => import('../pages/merchant/audit'));
const MerchantDetail = React.lazy(() => import('../pages/merchant/detail'));
const MerchantFinance = React.lazy(() => import('../pages/merchant/finance'));
const MerchantLeads = React.lazy(() => import('../pages/merchant/leads'));
const MerchantReview = React.lazy(() => import('../pages/merchant/review'));
const MerchantSettings = React.lazy(() => import('../pages/merchant/settings'));
const MerchantStats = React.lazy(() => import('../pages/merchant/stats'));
const MerchantEdit = React.lazy(() => import('../pages/merchant/edit'));

const SettingsAccount = React.lazy(() => import('../pages/settings/account'));
const SettingsRole = React.lazy(() => import('../pages/settings/role'));
const SettingsConfig = React.lazy(() => import('../pages/settings/config'));

const StatsBusiness = React.lazy(() => import('../pages/stats/business'));
const StatsConversion = React.lazy(() => import('../pages/stats/conversion'));
const StatsTrend = React.lazy(() => import('../pages/stats/trend'));

// 路由守卫组件
const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// 路由配置
const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: (
      <RequireAuth>
        <BasicLayout />
      </RequireAuth>
    ),
    children: [
      {
        path: '',
        element: <Dashboard />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      // 酒店管理
      {
        path: 'hotel/rooms',
        element: <React.Suspense fallback={<div>Loading...</div>}><HotelRooms /></React.Suspense>,
      },
      {
        path: 'hotel/order',
        element: <React.Suspense fallback={<div>Loading...</div>}><HotelOrder /></React.Suspense>,
      },
      {
        path: 'hotel/order/stats',
        element: <React.Suspense fallback={<div>Loading...</div>}><HotelOrderStats /></React.Suspense>,
      },
      {
        path: 'hotel/order/detail/:id',
        element: <React.Suspense fallback={<div>Loading...</div>}><HotelOrderDetail /></React.Suspense>,
      },
      {
        path: 'hotel/reviews',
        element: <React.Suspense fallback={<div>Loading...</div>}><HotelReviews /></React.Suspense>,
      },
      {
        path: 'hotel/audit',
        element: <React.Suspense fallback={<div>Loading...</div>}><HotelAudit /></React.Suspense>,
      },
      // 租房管理
      {
        path: 'rental/rooms',
        element: <React.Suspense fallback={<div>Loading...</div>}><RentalRooms /></React.Suspense>,
      },
      {
        path: 'rental/audit',
        element: <React.Suspense fallback={<div>Loading...</div>}><RentalAudit /></React.Suspense>,
      },
      {
        path: 'rental/appointments',
        element: <React.Suspense fallback={<div>Loading...</div>}><RentalAppointments /></React.Suspense>,
      },
      // 线索管理
      {
        path: 'leads/list',
        element: <React.Suspense fallback={<div>Loading...</div>}><LeadsList /></React.Suspense>,
      },
      {
        path: 'leads/detail/:id',
        element: <React.Suspense fallback={<div>Loading...</div>}><LeadsDetail /></React.Suspense>,
      },
      {
        path: 'leads/edit/:id',
        element: <React.Suspense fallback={<div>Loading...</div>}><LeadsEdit /></React.Suspense>,
      },
      {
        path: 'leads/edit',
        element: <React.Suspense fallback={<div>Loading...</div>}><LeadsEdit /></React.Suspense>,
      },
      {
        path: 'leads/follow/:id',
        element: <React.Suspense fallback={<div>Loading...</div>}><LeadsFollow /></React.Suspense>,
      },
      // 营销管理
      {
        path: 'marketing/ads',
        element: <React.Suspense fallback={<div>Loading...</div>}><MarketingAds /></React.Suspense>,
      },
      {
        path: 'marketing/coupons',
        element: <React.Suspense fallback={<div>Loading...</div>}><MarketingCoupons /></React.Suspense>,
      },
      {
        path: 'marketing/activities',
        element: <React.Suspense fallback={<div>Loading...</div>}><MarketingActivities /></React.Suspense>,
      },
      {
        path: 'marketing/promotions/dashboard',
        element: <React.Suspense fallback={<div>Loading...</div>}><MarketingPromotionsDashboard /></React.Suspense>,
      },
      {
        path: 'marketing/promotions/audit',
        element: <React.Suspense fallback={<div>Loading...</div>}><MarketingPromotionsAudit /></React.Suspense>,
      },
      {
        path: 'marketing/promotions/monitor',
        element: <React.Suspense fallback={<div>Loading...</div>}><MarketingPromotionsMonitor /></React.Suspense>,
      },
      {
        path: 'marketing/promotions/analysis',
        element: <React.Suspense fallback={<div>Loading...</div>}><MarketingPromotionsAnalysis /></React.Suspense>,
      },
      // 内容管理
      {
        path: 'content/audit',
        element: <React.Suspense fallback={<div>Loading...</div>}><ContentAudit /></React.Suspense>,
      },
      // 财务管理
      {
        path: 'finance/revenue',
        element: <React.Suspense fallback={<div>Loading...</div>}><FinanceRevenue /></React.Suspense>,
      },
      {
        path: 'finance/invoice',
        element: <React.Suspense fallback={<div>Loading...</div>}><FinanceInvoice /></React.Suspense>,
      },
      {
        path: 'finance/settlement',
        element: <React.Suspense fallback={<div>Loading...</div>}><FinanceSettlement /></React.Suspense>,
      },
      // 用户管理
      {
        path: 'user/list',
        element: <React.Suspense fallback={<div>Loading...</div>}><UserList /></React.Suspense>,
      },
      {
        path: 'user/feedback',
        element: <React.Suspense fallback={<div>Loading...</div>}><UserFeedback /></React.Suspense>,
      },
      // 商家管理
      {
        path: 'merchant/list',
        element: <React.Suspense fallback={<div>Loading...</div>}><MerchantList /></React.Suspense>,
      },
      {
        path: 'merchant/audit',
        element: <React.Suspense fallback={<div>Loading...</div>}><MerchantAudit /></React.Suspense>,
      },
      {
        path: 'merchant/detail/:id',
        element: <React.Suspense fallback={<div>Loading...</div>}><MerchantDetail /></React.Suspense>,
      },
      {
        path: 'merchant/edit/:id',
        element: <React.Suspense fallback={<div>Loading...</div>}><MerchantEdit /></React.Suspense>,
      },
      {
        path: 'merchant/create',
        element: <React.Suspense fallback={<div>Loading...</div>}><MerchantEdit /></React.Suspense>,
      },
      {
        path: 'merchant/finance',
        element: <React.Suspense fallback={<div>Loading...</div>}><MerchantFinance /></React.Suspense>,
      },
      {
        path: 'merchant/leads',
        element: <React.Suspense fallback={<div>Loading...</div>}><MerchantLeads /></React.Suspense>,
      },
      {
        path: 'merchant/review',
        element: <React.Suspense fallback={<div>Loading...</div>}><MerchantReview /></React.Suspense>,
      },
      // 系统设置
      {
        path: 'settings/account',
        element: <React.Suspense fallback={<div>Loading...</div>}><SettingsAccount /></React.Suspense>,
      },
      {
        path: 'settings/role',
        element: <React.Suspense fallback={<div>Loading...</div>}><SettingsRole /></React.Suspense>,
      },
      {
        path: 'settings/config',
        element: <React.Suspense fallback={<div>Loading...</div>}><SettingsConfig /></React.Suspense>,
      },
      // 数据统计
      {
        path: 'stats/business',
        element: <React.Suspense fallback={<div>Loading...</div>}><StatsBusiness /></React.Suspense>,
      },
      {
        path: 'stats/conversion',
        element: <React.Suspense fallback={<div>Loading...</div>}><StatsConversion /></React.Suspense>,
      },
      {
        path: 'stats/trend',
        element: <React.Suspense fallback={<div>Loading...</div>}><StatsTrend /></React.Suspense>,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);

export default router; 
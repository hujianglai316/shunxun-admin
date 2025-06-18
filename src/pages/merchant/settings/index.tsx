import React, { useState } from 'react';
import { Card, Tabs, message } from 'antd';
import type { MerchantSettings } from '../../../types/merchant';
import BasicInfoForm from './components/BasicInfoForm';
import BusinessHoursForm from './components/BusinessHoursForm';
import FacilitiesForm from './components/FacilitiesForm';
import RefundRulesForm from './components/RefundRulesForm';
import CommissionRulesForm from './components/CommissionRulesForm';
import PaymentSettingsForm from './components/PaymentSettingsForm';
import BookingSettingsForm from './components/BookingSettingsForm';

// 模拟数据
const mockSettings: MerchantSettings = {
  basicInfo: {
    name: '瑞森酒店',
    description: '位于市中心的豪华酒店',
    contactPerson: '张经理',
    contactPhone: '13800138000',
    contactEmail: 'contact@ruisen.com',
    address: '北京市朝阳区建国路88号',
    latitude: 39.9042,
    longitude: 116.4074,
    images: [
      'https://example.com/hotel1.jpg',
      'https://example.com/hotel2.jpg',
    ],
    notice: '欢迎入住瑞森酒店',
  },
  businessHours: [
    { weekday: 1, isOpen: true, openTime: '00:00', closeTime: '23:59' },
    { weekday: 2, isOpen: true, openTime: '00:00', closeTime: '23:59' },
    { weekday: 3, isOpen: true, openTime: '00:00', closeTime: '23:59' },
    { weekday: 4, isOpen: true, openTime: '00:00', closeTime: '23:59' },
    { weekday: 5, isOpen: true, openTime: '00:00', closeTime: '23:59' },
    { weekday: 6, isOpen: true, openTime: '00:00', closeTime: '23:59' },
    { weekday: 7, isOpen: true, openTime: '00:00', closeTime: '23:59' },
  ],
  facilities: [
    { id: 1, name: 'WiFi', icon: 'wifi', category: '通用设施', isEnabled: true },
    { id: 2, name: '停车场', icon: 'car', category: '通用设施', isEnabled: true },
    { id: 3, name: '健身房', icon: 'gym', category: '休闲设施', isEnabled: true },
    { id: 4, name: '游泳池', icon: 'pool', category: '休闲设施', isEnabled: true },
  ],
  refundRules: [
    {
      id: 1,
      name: '提前24小时取消',
      description: '预订入住时间24小时前取消，全额退款',
      timeLimit: 24,
      refundRate: 1,
      isEnabled: true,
    },
    {
      id: 2,
      name: '提前12小时取消',
      description: '预订入住时间12小时前取消，退款50%',
      timeLimit: 12,
      refundRate: 0.5,
      isEnabled: true,
    },
  ],
  commissionRules: [
    {
      id: 1,
      name: '基础佣金',
      description: '基础订单佣金比例',
      baseRate: 0.1,
      minAmount: 10,
      maxAmount: 1000,
      conditions: [
        { type: 'order_amount', value: 1000, rate: 0.12 },
        { type: 'order_amount', value: 5000, rate: 0.15 },
      ],
      isEnabled: true,
    },
  ],
  paymentSettings: {
    supportedMethods: ['alipay', 'wechat', 'creditcard'],
    minDeposit: 100,
    depositRate: 0.3,
  },
  bookingSettings: {
    minAdvanceHours: 0,
    maxAdvanceDays: 90,
    minStayHours: 4,
    maxStayDays: 30,
    checkInTime: '14:00',
    checkOutTime: '12:00',
  },
};

const MerchantSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('basic_info');
  const [loading, setLoading] = useState(false);

  const handleSave = async (type: string, values: any) => {
    setLoading(true);
    try {
      // 这里添加实际的保存逻辑
      console.log('保存设置：', type, values);
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success('保存成功');
    } catch (error) {
      message.error('保存失败');
    } finally {
      setLoading(false);
    }
  };

  const items = [
    {
      key: 'basic_info',
      label: '基本信息',
      children: <BasicInfoForm data={mockSettings.basicInfo} onSave={values => handleSave('basic_info', values)} loading={loading} />,
    },
    {
      key: 'business_hours',
      label: '营业时间',
      children: <BusinessHoursForm data={mockSettings.businessHours} onSave={values => handleSave('business_hours', values)} loading={loading} />,
    },
    {
      key: 'facilities',
      label: '服务设施',
      children: <FacilitiesForm data={mockSettings.facilities} onSave={values => handleSave('facilities', values)} loading={loading} />,
    },
    {
      key: 'refund_rules',
      label: '退款规则',
      children: <RefundRulesForm data={mockSettings.refundRules} onSave={values => handleSave('refund_rules', values)} loading={loading} />,
    },
    {
      key: 'commission_rules',
      label: '佣金规则',
      children: <CommissionRulesForm data={mockSettings.commissionRules} onSave={values => handleSave('commission_rules', values)} loading={loading} />,
    },
    {
      key: 'payment_settings',
      label: '支付设置',
      children: <PaymentSettingsForm data={mockSettings.paymentSettings} onSave={values => handleSave('payment_settings', values)} loading={loading} />,
    },
    {
      key: 'booking_settings',
      label: '预订设置',
      children: <BookingSettingsForm data={mockSettings.bookingSettings} onSave={values => handleSave('booking_settings', values)} loading={loading} />,
    },
  ];

  return (
    <Card>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={items}
      />
    </Card>
  );
};

export default MerchantSettings; 
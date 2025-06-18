import React, { useState } from 'react';
import { Card, Tabs, message } from 'antd';
import BasicInfoForm from './components/BasicInfoForm';
import BusinessHoursForm from './components/BusinessHoursForm';
import FacilitiesForm from './components/FacilitiesForm';
import RefundRulesForm from './components/RefundRulesForm';
import CommissionRulesForm from './components/CommissionRulesForm';
import PaymentSettingsForm from './components/PaymentSettingsForm';
import BookingSettingsForm from './components/BookingSettingsForm';

const MerchantSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('basic_info');
  const [loading, setLoading] = useState(false);

  // 模拟设置数据
  const mockSettings = {
    basicInfo: {
      name: '瑞森酒店',
      type: 'hotel',
      contact: '张三',
      phone: '13800138000',
      email: 'zhangsan@example.com',
      address: '北京市朝阳区xxx街道xxx号',
      description: '位于市中心的豪华酒店',
    },
    businessHours: {
      checkInTime: '14:00',
      checkOutTime: '12:00',
      frontDeskHours: ['00:00', '24:00'],
    },
    facilities: {
      basic: ['wifi', 'parking', 'elevator'],
      room: ['tv', 'air_conditioning', 'private_bathroom'],
      service: ['24h_front_desk', 'luggage_storage', 'wake_up'],
      entertainment: ['gym', 'swimming_pool', 'spa'],
    },
    refundRules: {
      rules: [
        {
          timeBeforeCheckIn: 72,
          refundPercentage: 100,
        },
        {
          timeBeforeCheckIn: 48,
          refundPercentage: 80,
        },
        {
          timeBeforeCheckIn: 24,
          refundPercentage: 50,
        },
      ],
      specialNotes: '节假日期间可能有特殊退款规则',
    },
    commissionRules: {
      basicRate: 10,
      specialRates: [
        {
          condition: 'holiday',
          rate: 12,
        },
        {
          condition: 'long_stay',
          rate: 8,
        },
      ],
    },
    paymentSettings: {
      methods: ['alipay', 'wechat', 'creditcard'],
      depositRequired: true,
      depositAmount: 200,
    },
    bookingSettings: {
      minAdvanceBooking: 0,
      maxAdvanceBooking: 90,
      minStayDuration: 1,
      maxStayDuration: 30,
      instantBooking: true,
    },
  };

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
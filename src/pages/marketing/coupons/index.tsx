import React, { useState, useEffect } from 'react';
import { Card, Tabs, Button, Table, Form, Input, Select, DatePicker, Row, Col, Space, message, Tag, Modal, Tooltip, Badge, Popconfirm } from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, EyeOutlined, StopOutlined, PlayCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import type { CouponTemplate, CouponType, CouponStatus, DistributionType, UserCoupon, CouponStats } from '../../../types/marketing';
import CouponFormModal from './components/CouponFormModal';
import CouponDetail from './components/CouponDetail';
import CouponStatsCard from './components/CouponStatsCard';
import UserCouponList from './components/UserCouponList';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Option } = Select;

// 模拟数据 - 优惠券列表
const mockCoupons: CouponTemplate[] = [
  {
    id: 'CP202305001',
    name: '新人专享8折券',
    type: 'DISCOUNT',
    value: 0.8,
    status: 'ACTIVE',
    startTime: '2023-05-01 00:00:00',
    endTime: '2023-06-30 23:59:59',
    validDays: 30,
    distributionType: 'DIRECT',
    rule: {
      perLimit: 1,
      totalLimit: 10000,
      maxDiscount: 200,
      useChannels: ['ALL'],
      useScope: 'ALL',
      newUserOnly: true,
      excludePromotion: true,
      description: '新用户专享，下单可享8折优惠，最高优惠200元',
    },
    createdAt: '2023-04-28 14:30:00',
    createdBy: '张三',
    updatedAt: '2023-04-28 14:30:00',
    updatedBy: '张三',
    totalIssued: 1860,
    totalUsed: 928,
    totalExpired: 320,
  },
  {
    id: 'CP202305002',
    name: '满100减20元',
    type: 'CASH',
    value: 20,
    status: 'ACTIVE',
    startTime: '2023-05-01 00:00:00',
    endTime: '2023-05-31 23:59:59',
    validDays: 15,
    distributionType: 'DIRECT',
    rule: {
      perLimit: 3,
      totalLimit: 5000,
      minAmount: 100,
      useChannels: ['APP', 'MINI'],
      useScope: 'ALL',
      newUserOnly: false,
      excludePromotion: true,
      description: '消费满100元可使用，不可与其他优惠叠加',
    },
    createdAt: '2023-04-25 10:15:00',
    createdBy: '李四',
    updatedAt: '2023-04-25 10:15:00',
    updatedBy: '李四',
    totalIssued: 3280,
    totalUsed: 1450,
    totalExpired: 320,
  },
  {
    id: 'CP202305003',
    name: '立减15元',
    type: 'DIRECT',
    value: 15,
    status: 'ACTIVE',
    startTime: '2023-05-01 00:00:00',
    endTime: '2023-05-15 23:59:59',
    validDays: 7,
    distributionType: 'CODE',
    code: 'PROMO15',
    rule: {
      perLimit: 1,
      totalLimit: 2000,
      useChannels: ['ALL'],
      useScope: 'CATEGORY',
      scopeIds: ['hotel', 'apartment'],
      newUserOnly: false,
      excludePromotion: false,
      description: '立减15元，仅限酒店和公寓类订单使用',
    },
    createdAt: '2023-04-28 16:20:00',
    createdBy: '王五',
    updatedAt: '2023-04-28 16:20:00',
    updatedBy: '王五',
    totalIssued: 950,
    totalUsed: 320,
    totalExpired: 120,
  },
  {
    id: 'CP202305004',
    name: '周末免费住一晚',
    type: 'FREE',
    value: 0,
    status: 'PENDING',
    startTime: '2023-05-15 00:00:00',
    endTime: '2023-06-15 23:59:59',
    validDays: 30,
    distributionType: 'ACTIVITY',
    rule: {
      perLimit: 1,
      totalLimit: 100,
      useChannels: ['APP'],
      useScope: 'MERCHANT',
      scopeIds: ['M10001', 'M10002'],
      newUserOnly: false,
      excludePromotion: true,
      weekendOnly: true,
      description: '周末入住可免费住一晚，需提前3天预订',
    },
    createdAt: '2023-05-01 09:30:00',
    createdBy: '张三',
    updatedAt: '2023-05-01 09:30:00',
    updatedBy: '张三',
    totalIssued: 0,
    totalUsed: 0,
    totalExpired: 0,
  },
  {
    id: 'CP202305005',
    name: '赠送双早',
    type: 'GIFT',
    value: 0,
    status: 'PAUSED',
    startTime: '2023-05-01 00:00:00',
    endTime: '2023-06-30 23:59:59',
    validDays: 15,
    distributionType: 'MANUAL',
    rule: {
      perLimit: 1,
      totalLimit: 500,
      useChannels: ['ALL'],
      useScope: 'MERCHANT',
      scopeIds: ['M10003'],
      newUserOnly: false,
      excludePromotion: false,
      description: '预订任意房型可赠送双人早餐',
    },
    createdAt: '2023-04-20 11:40:00',
    createdBy: '李四',
    updatedAt: '2023-05-05 14:20:00',
    updatedBy: '王五',
    totalIssued: 120,
    totalUsed: 35,
    totalExpired: 20,
  },
];

// 模拟数据 - 用户优惠券
const mockUserCoupons: UserCoupon[] = [
  {
    id: 'UC202305001',
    userId: 'U10001',
    userName: '张小明',
    templateId: 'CP202305001',
    couponName: '新人专享8折券',
    couponType: 'DISCOUNT',
    couponValue: 0.8,
    status: 'UNUSED',
    obtainTime: '2023-05-01 10:20:30',
    validStartTime: '2023-05-01 10:20:30',
    validEndTime: '2023-05-31 23:59:59',
    distributionType: 'DIRECT',
    source: '新用户注册赠送',
  },
  {
    id: 'UC202305002',
    userId: 'U10001',
    userName: '张小明',
    templateId: 'CP202305002',
    couponName: '满100减20元',
    couponType: 'CASH',
    couponValue: 20,
    status: 'USED',
    obtainTime: '2023-05-02 15:30:45',
    validStartTime: '2023-05-02 15:30:45',
    validEndTime: '2023-05-17 23:59:59',
    usedTime: '2023-05-10 20:15:30',
    usedOrderId: 'O202305100001',
    distributionType: 'DIRECT',
    source: '限时领券活动',
  },
  {
    id: 'UC202305003',
    userId: 'U10002',
    userName: '李华',
    templateId: 'CP202305001',
    couponName: '新人专享8折券',
    couponType: 'DISCOUNT',
    couponValue: 0.8,
    status: 'EXPIRED',
    obtainTime: '2023-04-05 09:10:20',
    validStartTime: '2023-04-05 09:10:20',
    validEndTime: '2023-05-05 23:59:59',
    distributionType: 'DIRECT',
    source: '新用户注册赠送',
  },
  {
    id: 'UC202305004',
    userId: 'U10003',
    userName: '王梅',
    templateId: 'CP202305003',
    couponName: '立减15元',
    couponType: 'DIRECT',
    couponValue: 15,
    status: 'UNUSED',
    obtainTime: '2023-05-03 16:45:10',
    validStartTime: '2023-05-03 16:45:10',
    validEndTime: '2023-05-10 23:59:59',
    distributionType: 'CODE',
    source: '兑换码：PROMO15',
  },
  {
    id: 'UC202305005',
    userId: 'U10004',
    userName: '赵强',
    templateId: 'CP202305005',
    couponName: '赠送双早',
    couponType: 'GIFT',
    couponValue: 0,
    status: 'USED',
    obtainTime: '2023-05-02 10:30:00',
    validStartTime: '2023-05-02 10:30:00',
    validEndTime: '2023-05-17 23:59:59',
    usedTime: '2023-05-08 14:20:15',
    usedOrderId: 'O202305080003',
    distributionType: 'MANUAL',
    source: '客服发放',
  },
];

// 模拟数据 - 统计数据
const mockStats: CouponStats = {
  activeCoupons: 3,
  totalIssued: 6210,
  totalUsed: 2733,
  usageRate: 44.01,
  totalValue: 68325.5,
  avgDiscount: 25.0,
  topCoupons: [
    { id: 'CP202305001', name: '新人专享8折券', issuedCount: 1860, usedCount: 928, usageRate: 0.5 },
    { id: 'CP202305002', name: '满100减20元', issuedCount: 3280, usedCount: 1450, usageRate: 0.44 },
    { id: 'CP202305003', name: '立减15元', issuedCount: 950, usedCount: 320, usageRate: 0.34 },
    { id: 'CP202305005', name: '赠送双早', issuedCount: 120, usedCount: 35, usageRate: 0.29 },
    { id: 'CP202305004', name: '周末免费住一晚', issuedCount: 0, usedCount: 0, usageRate: 0 },
  ],
};

const MarketingCoupons: React.FC = () => {
  // 状态管理
  const [activeTab, setActiveTab] = useState<string>('list');
  const [loading, setLoading] = useState<boolean>(false);
  const [statLoading, setStatLoading] = useState<boolean>(false);
  const [coupons, setCoupons] = useState<CouponTemplate[]>([]);
  const [userCoupons, setUserCoupons] = useState<UserCoupon[]>([]);
  const [stats, setStats] = useState<CouponStats>(mockStats);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [userCouponPagination, setUserCouponPagination] = useState({ current: 1, pageSize: 10 });
  const [total, setTotal] = useState<number>(0);
  const [userCouponTotal, setUserCouponTotal] = useState<number>(0);
  const [formModal, setFormModal] = useState<{ visible: boolean; title: string; record?: CouponTemplate }>({
    visible: false,
    title: '',
  });
  const [detailVisible, setDetailVisible] = useState<boolean>(false);
  const [currentCoupon, setCurrentCoupon] = useState<CouponTemplate | null>(null);
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const [form] = Form.useForm();

  // 初始加载数据
  useEffect(() => {
    fetchCoupons();
    fetchStats();
  }, []);

  // 加载优惠券列表
  const fetchCoupons = (params = {}) => {
    setLoading(true);
    // 模拟接口请求
    setTimeout(() => {
      setCoupons(mockCoupons);
      setTotal(mockCoupons.length);
      setLoading(false);
    }, 500);
  };

  // 加载用户优惠券列表
  const fetchUserCoupons = (params = {}) => {
    setLoading(true);
    // 模拟接口请求
    setTimeout(() => {
      setUserCoupons(mockUserCoupons);
      setUserCouponTotal(mockUserCoupons.length);
      setLoading(false);
    }, 500);
  };

  // 加载统计数据
  const fetchStats = () => {
    setStatLoading(true);
    // 模拟接口请求
    setTimeout(() => {
      setStats(mockStats);
      setStatLoading(false);
    }, 500);
  };

  // 切换标签页
  const handleTabChange = (key: string) => {
    setActiveTab(key);
    if (key === 'list') {
      fetchCoupons();
    } else if (key === 'user') {
      fetchUserCoupons();
    } else if (key === 'stats') {
      fetchStats();
    }
  };

  // 处理搜索
  const handleSearch = (values: any) => {
    console.log('搜索参数:', values);
    fetchCoupons(values);
  };

  // 处理用户优惠券搜索
  const handleUserCouponSearch = (values: any) => {
    console.log('用户优惠券搜索参数:', values);
    fetchUserCoupons(values);
  };

  // 处理表格分页变化
  const handleTableChange = (newPagination: any) => {
    setPagination(newPagination);
    const values = form.getFieldsValue();
    fetchCoupons({ ...values, page: newPagination.current, pageSize: newPagination.pageSize });
  };

  // 显示新增优惠券表单
  const showAddForm = () => {
    setFormModal({
      visible: true,
      title: '新增优惠券',
    });
  };

  // 显示编辑优惠券表单
  const showEditForm = (record: CouponTemplate) => {
    setFormModal({
      visible: true,
      title: '编辑优惠券',
      record,
    });
  };

  // 查看优惠券详情
  const showDetail = (record: CouponTemplate) => {
    setCurrentCoupon(record);
    setDetailVisible(true);
  };

  // 关闭详情弹窗
  const handleDetailClose = () => {
    setCurrentCoupon(null);
    setDetailVisible(false);
  };

  // 关闭表单弹窗
  const handleFormCancel = () => {
    setFormModal({ visible: false, title: '' });
  };

  // 提交表单
  const handleFormSubmit = async (values: any) => {
    setFormLoading(true);
    // 模拟接口请求
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (formModal.record) {
      // 编辑优惠券
      message.success('优惠券更新成功');
    } else {
      // 新增优惠券
      message.success('优惠券创建成功');
    }
    
    setFormLoading(false);
    setFormModal({ visible: false, title: '' });
    fetchCoupons();
  };

  // 暂停优惠券
  const handlePause = async (record: CouponTemplate) => {
    setLoading(true);
    // 模拟接口请求
    await new Promise(resolve => setTimeout(resolve, 500));
    message.success('优惠券已暂停');
    setLoading(false);
    fetchCoupons();
  };

  // 启用优惠券
  const handleActivate = async (record: CouponTemplate) => {
    setLoading(true);
    // 模拟接口请求
    await new Promise(resolve => setTimeout(resolve, 500));
    message.success('优惠券已启用');
    setLoading(false);
    fetchCoupons();
  };

  // 删除优惠券
  const handleDelete = async (record: CouponTemplate) => {
    setLoading(true);
    // 模拟接口请求
    await new Promise(resolve => setTimeout(resolve, 500));
    message.success('优惠券已删除');
    setLoading(false);
    fetchCoupons();
  };

  // 重置表单
  const handleReset = () => {
    form.resetFields();
  };

  // 渲染优惠券类型
  const renderCouponType = (type: CouponType) => {
    const typeMap: Record<CouponType, { color: string; text: string }> = {
      DISCOUNT: { color: 'blue', text: '折扣券' },
      CASH: { color: 'green', text: '满减券' },
      DIRECT: { color: 'red', text: '直减券' },
      FREE: { color: 'purple', text: '免费券' },
      GIFT: { color: 'orange', text: '赠品券' },
    };
    
    const { color, text } = typeMap[type] || { color: 'default', text: '未知类型' };
    return <Tag color={color}>{text}</Tag>;
  };

  // 渲染优惠券状态
  const renderCouponStatus = (status: CouponStatus) => {
    const statusMap: Record<CouponStatus, { status: 'success' | 'processing' | 'warning' | 'error' | 'default', text: string }> = {
      DRAFT: { status: 'default', text: '草稿' },
      PENDING: { status: 'warning', text: '待发布' },
      ACTIVE: { status: 'success', text: '进行中' },
      PAUSED: { status: 'warning', text: '已暂停' },
      EXPIRED: { status: 'error', text: '已过期' },
      FINISHED: { status: 'default', text: '已结束' },
    };
    
    const { status: badgeStatus, text } = statusMap[status] || { status: 'default', text: '未知状态' };
    return <Badge status={badgeStatus} text={text} />;
  };

  // 渲染发放方式
  const renderDistributionType = (type: DistributionType) => {
    const typeMap: Record<DistributionType, string> = {
      CODE: '兑换码',
      DIRECT: '直接发放',
      ACTIVITY: '活动奖励',
      MANUAL: '人工发放',
    };
    
    return typeMap[type] || '未知方式';
  };

  // 优惠券列表表格列定义
  const columns = [
    {
      title: '优惠券名称',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: CouponType) => renderCouponType(type),
    },
    {
      title: '面值',
      key: 'value',
      width: 100,
      render: (_: React.ReactNode, record: CouponTemplate) => (
        record.type === 'DISCOUNT' 
          ? `${(record.value * 100).toFixed(0)}% 折扣` 
          : record.type === 'CASH' || record.type === 'DIRECT'
            ? `¥ ${record.value.toFixed(2)}` 
            : '-'
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: CouponStatus) => renderCouponStatus(status),
    },
    {
      title: '发放方式',
      dataIndex: 'distributionType',
      key: 'distributionType',
      width: 100,
      render: (type: DistributionType) => renderDistributionType(type),
    },
    {
      title: '有效期',
      key: 'validPeriod',
      width: 240,
      render: (_: React.ReactNode, record: CouponTemplate) => `${record.startTime} ~ ${record.endTime}`,
    },
    {
      title: '已发放/总数',
      key: 'issued',
      width: 120,
      render: (_: React.ReactNode, record: CouponTemplate) => `${record.totalIssued} / ${record.rule.totalLimit}`,
    },
    {
      title: '已使用',
      dataIndex: 'totalUsed',
      key: 'totalUsed',
      width: 100,
    },
    {
      title: '使用率',
      key: 'usageRate',
      width: 100,
      render: (_: React.ReactNode, record: CouponTemplate) => (
        record.totalIssued > 0 
          ? `${((record.totalUsed / record.totalIssued) * 100).toFixed(2)}%` 
          : '0%'
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_: React.ReactNode, record: CouponTemplate) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => showDetail(record)} />
          </Tooltip>
          {record.status !== 'EXPIRED' && record.status !== 'FINISHED' && (
            <Tooltip title="编辑">
              <Button type="link" size="small" icon={<EditOutlined />} onClick={() => showEditForm(record)} />
            </Tooltip>
          )}
          {record.status === 'ACTIVE' && (
            <Tooltip title="暂停">
              <Button 
                type="link" 
                size="small" 
                danger 
                icon={<StopOutlined />} 
                onClick={() => handlePause(record)} 
              />
            </Tooltip>
          )}
          {record.status === 'PAUSED' && (
            <Tooltip title="启用">
              <Button 
                type="link" 
                size="small" 
                icon={<PlayCircleOutlined />} 
                onClick={() => handleActivate(record)} 
              />
            </Tooltip>
          )}
          {(record.status === 'DRAFT' || record.status === 'PENDING') && (
            <Popconfirm
              title="确定要删除该优惠券吗?"
              onConfirm={() => handleDelete(record)}
              okText="确定"
              cancelText="取消"
            >
              <Button type="link" size="small" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Card title="优惠券管理">
      <Tabs activeKey={activeTab} onChange={handleTabChange}>
        <TabPane tab="优惠券列表" key="list">
          <div className="coupon-list">
            <div className="coupon-search" style={{ marginBottom: 16 }}>
              <Form form={form} layout="inline" onFinish={handleSearch}>
                <Row gutter={[24, 16]} style={{ width: '100%', marginBottom: 10 }}>
                  <Col span={6}>
                    <Form.Item 
                      name="name" 
                      label="优惠券名称" 
                      style={{ width: '100%' }}
                    >
                      <Input placeholder="请输入优惠券名称" allowClear />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item 
                      name="type" 
                      label="优惠券类型" 
                      style={{ width: '100%' }}
                    >
                      <Select placeholder="请选择优惠券类型" allowClear style={{ width: '100%' }}>
                        <Option value="DISCOUNT">折扣券</Option>
                        <Option value="CASH">满减券</Option>
                        <Option value="DIRECT">直减券</Option>
                        <Option value="FREE">免费券</Option>
                        <Option value="GIFT">赠品券</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item 
                      name="status" 
                      label="状态" 
                      style={{ width: '100%' }}
                    >
                      <Select placeholder="请选择状态" allowClear style={{ width: '100%' }}>
                        <Option value="DRAFT">草稿</Option>
                        <Option value="PENDING">待发布</Option>
                        <Option value="ACTIVE">进行中</Option>
                        <Option value="PAUSED">已暂停</Option>
                        <Option value="EXPIRED">已过期</Option>
                        <Option value="FINISHED">已结束</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item 
                      name="dateRange" 
                      label="创建时间"
                      style={{ width: '100%' }}
                    >
                      <RangePicker style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={24} style={{ textAlign: 'right', marginBottom: 24, marginTop: 16 }}>
                    <Space size="middle">
                      <Button onClick={handleReset}>重置</Button>
                      <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                        查询
                      </Button>
                      <Button type="primary" onClick={showAddForm} icon={<PlusOutlined />}>
                        新增优惠券
                      </Button>
                    </Space>
                  </Col>
                </Row>
              </Form>
            </div>

            <Table
              columns={columns}
              dataSource={coupons}
              rowKey="id"
              loading={loading}
              pagination={{
                ...pagination,
                total,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 条数据`,
              }}
              onChange={handleTableChange}
              scroll={{ x: 1500 }}
            />
          </div>
        </TabPane>
        <TabPane tab="用户优惠券" key="user">
          <UserCouponList
            loading={loading}
            dataSource={userCoupons}
            total={userCouponTotal}
            onSearch={handleUserCouponSearch}
            pagination={userCouponPagination}
          />
        </TabPane>
        <TabPane tab="数据统计" key="stats">
          <CouponStatsCard stats={stats} loading={statLoading} />
        </TabPane>
      </Tabs>

      {/* 优惠券表单弹窗 */}
      {formModal.visible && (
        <CouponFormModal
          visible={formModal.visible}
          title={formModal.title}
          initialValues={formModal.record}
          onCancel={handleFormCancel}
          onSubmit={handleFormSubmit}
          loading={formLoading}
        />
      )}

      {/* 优惠券详情弹窗 */}
      <Modal
        title="优惠券详情"
        open={detailVisible}
        onCancel={handleDetailClose}
        width={1000}
        footer={[
          <Button key="back" onClick={handleDetailClose}>
            关闭
          </Button>,
        ]}
      >
        {currentCoupon && <CouponDetail coupon={currentCoupon} />}
      </Modal>
    </Card>
  );
};

export default MarketingCoupons; 
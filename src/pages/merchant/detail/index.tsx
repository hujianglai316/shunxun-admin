import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Descriptions,
  Breadcrumb,
  Image,
  Tag,
  Row,
  Col,
  Space,
  Button,
  Divider,
  Tabs,
  Statistic,
  Table,
  Typography,
  message,
  Empty,
} from 'antd';
import {
  HomeOutlined,
  ShopOutlined,
  EditOutlined,
  RollbackOutlined,
  CreditCardOutlined,
  BankOutlined,
  FileTextOutlined,
  StarFilled,
  ClockCircleOutlined,
  TeamOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  PieChartOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import type { MerchantBasicInfo } from '@/types/merchant';
import { MerchantType, MerchantStatus } from '@/types/merchant';
import { getMerchantDetail, mockFinanceData, mockReviews, mockMerchantStats } from '@/mock/merchant';

// 导入商家设置相关组件
import BasicInfoForm from '../settings/components/BasicInfoForm';
import BusinessHoursForm from '../settings/components/BusinessHoursForm';
import FacilitiesForm from '../settings/components/FacilitiesForm';
import RefundRulesForm from '../settings/components/RefundRulesForm';
import CommissionRulesForm from '../settings/components/CommissionRulesForm';
import PaymentSettingsForm from '../settings/components/PaymentSettingsForm';
import BookingSettingsForm from '../settings/components/BookingSettingsForm';

const { TabPane } = Tabs;
const { Title, Paragraph, Text } = Typography;

// 模拟数据 - 从商家设置页面获取
const mockSettings = {
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

const MerchantDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [merchantData, setMerchantData] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState('basic');
  const [loading, setLoading] = useState(true);
  const [settingTab, setSettingTab] = useState('business_hours');

  useEffect(() => {
    // 模拟API请求
    const fetchMerchantDetail = async () => {
      try {
        setLoading(true);
        // 实际项目中这里应该是API请求
        const data = getMerchantDetail(Number(id));
        setMerchantData(data);
      } catch (error) {
        console.error('获取商家详情失败:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMerchantDetail();
    }
  }, [id]);

  const handleEdit = () => {
    navigate(`/merchant/edit/${id}`);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  const handleSettingTabChange = (key: string) => {
    setSettingTab(key);
  };

  const handleSaveSetting = async (type: string, values: any) => {
    try {
      // 这里添加实际的保存逻辑
      console.log('保存设置：', type, values);
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success('保存成功');
    } catch (error) {
      message.error('保存失败');
    }
  };

  const renderStatus = (status: MerchantStatus) => {
    const statusMap = {
      [MerchantStatus.ACTIVE]: { text: '正常', color: 'success' },
      [MerchantStatus.INACTIVE]: { text: '已禁用', color: 'default' },
      [MerchantStatus.PENDING]: { text: '待审核', color: 'warning' },
      [MerchantStatus.REJECTED]: { text: '已拒绝', color: 'error' },
    };
    const { text, color } = statusMap[status];
    return <Tag color={color}>{text}</Tag>;
  };

  const renderType = (type: MerchantType) => {
    const typeMap = {
      [MerchantType.HOTEL]: '酒店',
      [MerchantType.APARTMENT]: '公寓',
      [MerchantType.HOUSE]: '民宿',
    };
    return typeMap[type];
  };

  if (!merchantData) {
    return null;
  }

  // 获取商家财务数据
  const financeData = mockFinanceData.find(item => item.merchantId === Number(id));
  
  // 获取商家评价数据
  const reviewData = mockReviews.filter(item => item.merchantId === Number(id));
  
  // 获取商家统计数据
  const statsData = mockMerchantStats;

  // 渲染基本信息
  const renderBasicInfo = () => (
    <Card>
      <Descriptions column={{ xxl: 4, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }} bordered>
        <Descriptions.Item label="商家名称">{merchantData.name}</Descriptions.Item>
        <Descriptions.Item label="商家类型">{renderType(merchantData.type)}</Descriptions.Item>
        <Descriptions.Item label="状态">{renderStatus(merchantData.status)}</Descriptions.Item>
        <Descriptions.Item label="评分">
          <Space>
            <StarFilled style={{ color: '#faad14' }} />
            <span>{merchantData.rating?.toFixed(1) || '暂无'}</span>
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label="联系人">{merchantData.contact}</Descriptions.Item>
        <Descriptions.Item label="联系电话">{merchantData.phone}</Descriptions.Item>
        <Descriptions.Item label="联系邮箱">{mockSettings.basicInfo.contactEmail || '暂无'}</Descriptions.Item>
        <Descriptions.Item label="所在城市">{merchantData.city}</Descriptions.Item>
        <Descriptions.Item label="详细地址">{merchantData.address}</Descriptions.Item>
        <Descriptions.Item label="经度">{mockSettings.basicInfo.longitude}</Descriptions.Item>
        <Descriptions.Item label="纬度">{mockSettings.basicInfo.latitude}</Descriptions.Item>
        <Descriptions.Item label="营业执照号">{merchantData.businessLicense}</Descriptions.Item>
        <Descriptions.Item label="法人代表">{merchantData.legalPerson}</Descriptions.Item>
        <Descriptions.Item label="开业时间">{merchantData.openingTime}</Descriptions.Item>
        <Descriptions.Item label="创建时间">{merchantData.createTime}</Descriptions.Item>
      </Descriptions>

      <Divider />

      <Title level={5}>商家简介</Title>
      <Paragraph>{merchantData.description}</Paragraph>

      <Divider />

      <Title level={5}>商家公告</Title>
      <Paragraph>{mockSettings.basicInfo.notice || '暂无公告'}</Paragraph>

      <Divider />

      <Title level={5}>配套设施</Title>
      <Space wrap>
        {merchantData.facilities?.map((facility: string, index: number) => (
          <Tag key={index} color="blue">{facility}</Tag>
        ))}
      </Space>

      <Divider />

      <Title level={5}>商家图片</Title>
      {mockSettings.basicInfo.images && mockSettings.basicInfo.images.length > 0 ? (
        <Image.PreviewGroup>
          <Row gutter={16}>
            {mockSettings.basicInfo.images.map((img: string, index: number) => (
              <Col key={index} span={6} style={{ marginBottom: 16 }}>
                <Image 
                  src={img}
                  width="100%"
                  height={160}
                  style={{ objectFit: 'cover' }}
                />
              </Col>
            ))}
          </Row>
        </Image.PreviewGroup>
      ) : (
        <Empty description="暂无图片" />
      )}

      <Divider />

      <Title level={5}>入住信息</Title>
      <Descriptions column={{ xxl: 4, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }}>
        <Descriptions.Item label="营业时间">{merchantData.businessHours}</Descriptions.Item>
        <Descriptions.Item label="入住时间">{merchantData.checkInTime}</Descriptions.Item>
        <Descriptions.Item label="退房时间">{merchantData.checkOutTime}</Descriptions.Item>
        <Descriptions.Item label="房间数量">{merchantData.roomCount}间</Descriptions.Item>
      </Descriptions>
    </Card>
  );

  // 渲染财务信息
  const renderFinanceInfo = () => (
    <Card>
      {financeData ? (
        <>
          <Row gutter={[16, 16]}>
            <Col span={6}>
              <Card>
                <Statistic
                  title="总收入"
                  value={financeData.totalIncome}
                  precision={2}
                  prefix={<DollarOutlined />}
                  suffix="元"
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="总佣金"
                  value={financeData.totalCommission}
                  precision={2}
                  prefix={<DollarOutlined />}
                  suffix="元"
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="可用余额"
                  value={financeData.availableBalance}
                  precision={2}
                  prefix={<DollarOutlined />}
                  suffix="元"
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="冻结余额"
                  value={financeData.frozenBalance}
                  precision={2}
                  prefix={<DollarOutlined />}
                  suffix="元"
                />
              </Card>
            </Col>
          </Row>

          <Divider />

          <Title level={5}>结算信息</Title>
          <Descriptions bordered column={{ xxl: 4, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }}>
            <Descriptions.Item label="结算周期">
              {merchantData.settleInfo.settleType === 'monthly' ? '月结' : '其他'}
            </Descriptions.Item>
            <Descriptions.Item label="结算日">每月{merchantData.settleInfo.settleDay}日</Descriptions.Item>
            <Descriptions.Item label="佣金比例">{(merchantData.settleInfo.commissionRate * 100).toFixed(1)}%</Descriptions.Item>
            <Descriptions.Item label="上次结算时间">{merchantData.settleInfo.lastSettleTime}</Descriptions.Item>
            <Descriptions.Item label="上次结算金额">¥{merchantData.settleInfo.lastSettleAmount}</Descriptions.Item>
          </Descriptions>

          <Divider />

          <Title level={5}>银行账户</Title>
          <Descriptions bordered column={{ xxl: 3, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }}>
            <Descriptions.Item label="账户名称">{merchantData.bankAccount.accountName}</Descriptions.Item>
            <Descriptions.Item label="开户银行">{merchantData.bankAccount.bankName}</Descriptions.Item>
            <Descriptions.Item label="银行账号">{merchantData.bankAccount.accountNumber}</Descriptions.Item>
          </Descriptions>

          <Divider />

          <Title level={5}>交易记录</Title>
          <Table
            dataSource={financeData.transactions}
            rowKey="id"
            pagination={false}
            columns={[
              {
                title: '交易类型',
                dataIndex: 'type',
                key: 'type',
                render: (type) => {
                  const typeMap: Record<string, { text: string; color: string }> = {
                    income: { text: '收入', color: 'success' },
                    commission: { text: '佣金', color: 'warning' },
                    withdraw: { text: '提现', color: 'error' },
                  };
                  return <Tag color={typeMap[type].color}>{typeMap[type].text}</Tag>;
                },
              },
              {
                title: '金额',
                dataIndex: 'amount',
                key: 'amount',
                render: (amount) => (
                  <span style={{ color: amount > 0 ? 'green' : 'red' }}>
                    {amount > 0 ? '+' : ''}{amount.toFixed(2)}
                  </span>
                ),
              },
              {
                title: '订单号',
                dataIndex: 'orderNo',
                key: 'orderNo',
                render: (orderNo) => orderNo || '-',
              },
              {
                title: '交易时间',
                dataIndex: 'createTime',
                key: 'createTime',
              },
              {
                title: '备注',
                dataIndex: 'remark',
                key: 'remark',
              },
            ]}
          />
        </>
      ) : (
        <div>暂无财务数据</div>
      )}
    </Card>
  );

  // 渲染评价信息
  const renderReviews = () => (
    <Card>
      {reviewData.length > 0 ? (
        <>
          <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
            <Col span={8}>
              <Card>
                <Statistic
                  title="总评价数"
                  value={reviewData.length}
                  prefix={<StarFilled />}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic
                  title="平均评分"
                  value={reviewData.reduce((sum, item) => sum + item.rating.overall, 0) / reviewData.length}
                  precision={1}
                  prefix={<StarFilled style={{ color: '#faad14' }} />}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic
                  title="待回复"
                  value={reviewData.filter(item => item.status === 'pending').length}
                />
              </Card>
            </Col>
          </Row>

          {reviewData.map((review) => (
            <Card 
              key={review.id} 
              style={{ marginBottom: 16 }}
              title={
                <Space>
                  <Text strong>{review.userName}</Text>
                  <Text type="secondary">{review.createTime}</Text>
                  <Space>
                    <StarFilled style={{ color: '#faad14' }} />
                    <Text>{review.rating.overall.toFixed(1)}</Text>
                  </Space>
                </Space>
              }
              extra={
                <Tag color={review.status === 'replied' ? 'success' : 'warning'}>
                  {review.status === 'replied' ? '已回复' : '待回复'}
                </Tag>
              }
            >
              <Paragraph>{review.content}</Paragraph>
              
              {review.images && review.images.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <Image.PreviewGroup>
                    <Row gutter={8}>
                      {review.images.map((img, index) => (
                        <Col key={index} span={4}>
                          <Image src={img} width={100} height={100} style={{ objectFit: 'cover' }} />
                        </Col>
                      ))}
                    </Row>
                  </Image.PreviewGroup>
                </div>
              )}
              
              {review.merchantReply && (
                <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 4 }}>
                  <Space>
                    <Text type="secondary">商家回复（{review.merchantReply.operator}）:</Text>
                    <Text type="secondary">{review.merchantReply.createTime}</Text>
                  </Space>
                  <Paragraph>{review.merchantReply.content}</Paragraph>
                </div>
              )}
            </Card>
          ))}
        </>
      ) : (
        <div>暂无评价数据</div>
      )}
    </Card>
  );

  // 渲染统计信息
  const renderStats = () => (
    <Card>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总订单数"
              value={statsData.overview.totalOrders}
              prefix={<ShopOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总营业额"
              value={statsData.overview.totalAmount}
              precision={2}
              prefix={<DollarOutlined />}
              suffix="元"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="平均订单价值"
              value={statsData.overview.averageOrderValue}
              precision={2}
              prefix={<DollarOutlined />}
              suffix="元"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="入住率"
              value={statsData.overview.occupancyRate * 100}
              precision={1}
              prefix={<PieChartOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>

      <Divider />
      
      <Title level={5}>房型入住统计</Title>
      <Table
        dataSource={statsData.roomStats}
        rowKey="type"
        pagination={false}
        columns={[
          {
            title: '房型',
            dataIndex: 'type',
            key: 'type',
          },
          {
            title: '房间数量',
            dataIndex: 'count',
            key: 'count',
          },
          {
            title: '已预订',
            dataIndex: 'booked',
            key: 'booked',
          },
          {
            title: '入住率',
            dataIndex: 'rate',
            key: 'rate',
            render: (rate) => `${(rate * 100).toFixed(1)}%`,
          },
          {
            title: '营业额',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount) => `¥${amount.toLocaleString()}`,
          },
        ]}
      />
      
      <Divider />
      
      <Title level={5}>客户分析</Title>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card>
            <Statistic
              title="新客户"
              value={statsData.customerStats.newCustomers}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="回头客"
              value={statsData.customerStats.repeatCustomers}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="回头率"
              value={statsData.customerStats.repeatRate * 100}
              precision={1}
              prefix={<PieChartOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>
    </Card>
  );

  // 渲染合同信息
  const renderContracts = () => (
    <Card>
      <Table
        dataSource={merchantData.contracts}
        rowKey="id"
        pagination={false}
        columns={[
          {
            title: '合同名称',
            dataIndex: 'name',
            key: 'name',
          },
          {
            title: '签署时间',
            dataIndex: 'signTime',
            key: 'signTime',
          },
          {
            title: '到期时间',
            dataIndex: 'expireTime',
            key: 'expireTime',
          },
          {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
              <Tag color={status === 'active' ? 'success' : 'default'}>
                {status === 'active' ? '生效中' : '已过期'}
              </Tag>
            ),
          },
          {
            title: '操作',
            key: 'action',
            render: () => (
              <Space>
                <Button type="link" icon={<FileTextOutlined />}>查看</Button>
                <Button type="link" icon={<EnvironmentOutlined />}>下载</Button>
              </Space>
            ),
          },
        ]}
      />
    </Card>
  );

  // 渲染设置信息
  const renderSettings = () => (
    <Card>
      <Tabs activeKey={settingTab} onChange={handleSettingTabChange}>
        <TabPane tab="营业时间" key="business_hours">
          <BusinessHoursForm 
            data={mockSettings.businessHours}
            onSave={values => handleSaveSetting('business_hours', values)}
          />
        </TabPane>
        <TabPane tab="服务设施" key="facilities">
          <FacilitiesForm 
            data={mockSettings.facilities}
            onSave={values => handleSaveSetting('facilities', values)}
          />
        </TabPane>
        <TabPane tab="退款规则" key="refund_rules">
          <RefundRulesForm 
            data={mockSettings.refundRules}
            onSave={values => handleSaveSetting('refund_rules', values)}
          />
        </TabPane>
        <TabPane tab="佣金规则" key="commission_rules">
          <CommissionRulesForm 
            data={mockSettings.commissionRules}
            onSave={values => handleSaveSetting('commission_rules', values)}
          />
        </TabPane>
        <TabPane tab="支付设置" key="payment_settings">
          <PaymentSettingsForm 
            data={mockSettings.paymentSettings}
            onSave={values => handleSaveSetting('payment_settings', values)}
          />
        </TabPane>
        <TabPane tab="预订设置" key="booking_settings">
          <BookingSettingsForm 
            data={mockSettings.bookingSettings}
            onSave={values => handleSaveSetting('booking_settings', values)}
          />
        </TabPane>
      </Tabs>
    </Card>
  );

  return (
    <div className="merchant-detail">
      {/* 顶部导航和操作按钮 */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 16 
      }}>
        <Breadcrumb>
          <Breadcrumb.Item href="/">
            <HomeOutlined />
            <span>首页</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item href="/merchant/list">
            <ShopOutlined />
            <span>商家管理</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{merchantData?.name}</Breadcrumb.Item>
        </Breadcrumb>

        <Space>
          <Button icon={<EditOutlined />} type="primary" onClick={handleEdit}>
            编辑商家
          </Button>
          <Button icon={<RollbackOutlined />} onClick={handleBack}>
            返回列表
          </Button>
        </Space>
      </div>

      {/* 标题与状态 */}
      <Card style={{ marginBottom: 16 }}>
        <Row>
          <Col span={18}>
            <Title level={3}>{merchantData?.name}</Title>
            <Space size="large">
              <Space>
                <ShopOutlined />
                {renderType(merchantData?.type)}
              </Space>
              <Space>
                <EnvironmentOutlined />
                {merchantData?.city}
              </Space>
              <Space>
                <StarFilled style={{ color: '#faad14' }} />
                {merchantData?.rating?.toFixed(1) || '暂无评分'}
              </Space>
              <Space>
                <ClockCircleOutlined />
                {merchantData?.createTime}
              </Space>
            </Space>
          </Col>
          <Col span={6} style={{ textAlign: 'right' }}>
            {renderStatus(merchantData?.status)}
          </Col>
        </Row>
      </Card>

      {/* 选项卡内容 */}
      <Tabs activeKey={activeTab} onChange={handleTabChange}>
        <TabPane tab="基本信息" key="basic">
          {renderBasicInfo()}
        </TabPane>
        <TabPane tab="财务信息" key="finance">
          {renderFinanceInfo()}
        </TabPane>
        <TabPane tab="评价管理" key="reviews">
          {renderReviews()}
        </TabPane>
        <TabPane tab="数据统计" key="stats">
          {renderStats()}
        </TabPane>
        <TabPane tab="合同信息" key="contracts">
          {renderContracts()}
        </TabPane>
        <TabPane 
          tab={
            <span>
              <SettingOutlined />
              商家设置
            </span>
          } 
          key="settings"
        >
          {renderSettings()}
        </TabPane>
      </Tabs>
    </div>
  );
};

export default MerchantDetail; 
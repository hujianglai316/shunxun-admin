import React, { useState } from 'react';
import { Card, Row, Col, Statistic, Table, Space, DatePicker, Button, List, Tag, Progress, Avatar } from 'antd';
import { 
  UserOutlined, 
  ShopOutlined, 
  ShoppingCartOutlined, 
  RiseOutlined,
  FallOutlined,
  WalletOutlined,
  ExportOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  StarFilled
} from '@ant-design/icons';
import { Line, Column, Pie } from '@ant-design/charts';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState<[string, string]>(['2024-03-01', '2024-03-15']);

  // 核心指标数据
  const statisticsData = {
    totalUsers: 12580,
    totalMerchants: 368,
    totalOrders: 8965,
    todayOrders: 126,
    monthlyRevenue: 289654.32,
    orderConversion: 32.5,
    gmv: 1256789.45,
  };

  // 订单趋势数据
  const orderTrendData = [
    { date: '2024-03-01', value: 120, type: '订单数' },
    { date: '2024-03-02', value: 132, type: '订单数' },
    { date: '2024-03-03', value: 101, type: '订单数' },
    { date: '2024-03-04', value: 134, type: '订单数' },
    { date: '2024-03-05', value: 90, type: '订单数' },
    { date: '2024-03-06', value: 230, type: '订单数' },
    { date: '2024-03-07', value: 210, type: '订单数' },
    // 收入数据
    { date: '2024-03-01', value: 12000, type: '收入' },
    { date: '2024-03-02', value: 13200, type: '收入' },
    { date: '2024-03-03', value: 10100, type: '收入' },
    { date: '2024-03-04', value: 13400, type: '收入' },
    { date: '2024-03-05', value: 9000, type: '收入' },
    { date: '2024-03-06', value: 23000, type: '收入' },
    { date: '2024-03-07', value: 21000, type: '收入' },
  ];

  // 商家活跃度排行
  const merchantRankData = [
    { rank: 1, name: '瑞森酒店', orderCount: 156, revenue: 68800 },
    { rank: 2, name: '城市公寓', orderCount: 142, revenue: 52300 },
    { rank: 3, name: '阳光酒店', orderCount: 138, revenue: 48900 },
    { rank: 4, name: '星月公寓', orderCount: 125, revenue: 45600 },
    { rank: 5, name: '海景酒店', orderCount: 118, revenue: 42100 },
  ];

  // 待办事项
  const todoItems = [
    { id: 1, type: 'merchant/audit', title: '新商家入驻审核', count: 5, status: 'urgent' },
    { id: 2, type: 'content/complaints', title: '待处理投诉', count: 3, status: 'warning' },
    { id: 3, type: 'finance/settlement', title: '退款申请', count: 8, status: 'normal' },
    { id: 4, type: 'leads/list', title: '线索处理', count: 12, status: 'normal' },
  ];

  // 热门酒店数据
  const hotHotelsData = [
    { id: 1, name: '瑞森酒店', rating: 4.8, occupancy: 92, price: 688, bookings: 156 },
    { id: 2, name: '城市公寓', rating: 4.7, occupancy: 88, price: 523, bookings: 142 },
    { id: 3, name: '阳光酒店', rating: 4.6, occupancy: 85, price: 489, bookings: 138 },
    { id: 4, name: '星月公寓', rating: 4.5, occupancy: 82, price: 456, bookings: 125 },
    { id: 5, name: '海景酒店', rating: 4.4, occupancy: 80, price: 421, bookings: 118 },
  ];

  // 用户分布数据
  const userDistributionData = [
    { type: '北京', value: 2850 },
    { type: '上海', value: 2340 },
    { type: '广州', value: 1790 },
    { type: '深圳', value: 1620 },
    { type: '杭州', value: 980 },
    { type: '其他', value: 3000 },
  ];

  // 收入统计数据
  const revenueStatsData = [
    { type: '酒店收入', value: 156000 },
    { type: '租房收入', value: 92000 },
    { type: '服务费', value: 32000 },
    { type: '广告收入', value: 18000 },
    { type: '其他', value: 8000 },
  ];

  // 订单按日统计数据（柱状图）
  const ordersByDayData = [
    { date: '周一', count: 120 },
    { date: '周二', count: 132 },
    { date: '周三', count: 101 },
    { date: '周四', count: 134 },
    { date: '周五', count: 190 },
    { date: '周六', count: 230 },
    { date: '周日', count: 170 },
  ];

  // 订单趋势图表配置
  const orderColumnConfig = {
    data: ordersByDayData,
    xField: 'date',
    yField: 'count',
    color: '#1890ff',
    label: {
      position: 'top',
      style: {
        fill: '#1890ff',
      },
    },
    xAxis: {
      label: {
        autoRotate: true,
        autoHide: false,
      },
    },
  };

  // 用户分布图表配置
  const userPieConfig = {
    appendPadding: 10,
    data: userDistributionData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.75,
    color: ['#1890FF', '#2FC25B', '#FACC14', '#F04864', '#8543E0', '#13C2C2'],
    legend: {
      position: 'bottom',
      layout: 'horizontal',
    },
    label: {
      type: 'spider',
      labelHeight: 28,
      content: ({type, value, percent}: {type: string; value: number; percent: number}) => {
        return `${type}\n${(percent * 100).toFixed(1)}%`;
      },
    },
    statistic: {
      title: {
        style: {
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          fontSize: '16px',
        },
        content: '总用户',
      },
      content: {
        style: {
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#1890FF',
        },
        content: userDistributionData.reduce((sum, item) => sum + item.value, 0).toLocaleString(),
      },
    },
    interactions: [{ type: 'element-active' }],
  };

  // 收入统计图表配置
  const revenuePieConfig = {
    appendPadding: 10,
    data: revenueStatsData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.75,
    color: ['#52C41A', '#1890FF', '#FAAD14', '#F5222D', '#722ED1'],
    legend: {
      position: 'bottom',
      layout: 'horizontal',
    },
    label: {
      type: 'spider',
      labelHeight: 28,
      content: ({type, value}: {type: string; value: number}) => {
        return `${type}\n¥${value.toLocaleString()}`;
      },
    },
    statistic: {
      title: {
        style: {
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          fontSize: '16px',
        },
        content: '总收入',
      },
      content: {
        style: {
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#52C41A',
        },
        content: `¥${revenueStatsData.reduce((sum, item) => sum + item.value, 0).toLocaleString()}`,
      },
    },
    interactions: [{ type: 'element-active' }],
  };

  // 图表配置
  const lineConfig = {
    data: orderTrendData,
    xField: 'date',
    yField: 'value',
    seriesField: 'type',
    smooth: true,
    animation: {
      appear: {
        animation: 'wave-in',
        duration: 1500,
      },
    },
  };

  const handleTimeRangeChange = (dates: any, dateStrings: [string, string]) => {
    setTimeRange(dateStrings);
    // 这里可以添加获取新数据的逻辑
  };

  const handleExport = () => {
    // 导出逻辑
    console.log('导出数据');
  };

  const handleCardClick = (path: string) => {
    // 根据待办事项类型进行路由跳转
    switch(path) {
      case 'merchant/audit':
        navigate('/merchant/audit'); // 商家审核页面
        break;
      case 'content/complaints':
        navigate('/content/complaints'); // 投诉处理页面
        break;
      case 'finance/settlement':
        navigate('/finance/settlement?tab=refund'); // 退款申请页面（结算页面中的退款标签）
        break;
      case 'leads/list':
        navigate('/leads/list'); // 线索处理页面
        break;
      default:
        navigate(path);
    }
  };

  return (
    <div>
      {/* 核心指标卡片 - 红框样式 */}
      <Row gutter={0} style={{ marginBottom: 24, background: '#fff', padding: '16px', border: '1px solid #f0f0f0', borderRadius: '4px' }}>
        <Col span={6} style={{ borderRight: '1px solid #f0f0f0' }}>
          <div style={{ padding: '0 16px' }}>
            <div style={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.45)', marginBottom: '8px' }}>总用户数</div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <UserOutlined style={{ color: '#1890ff', fontSize: '20px', marginRight: '8px' }} />
              <span style={{ color: '#1890ff', fontSize: '24px', fontWeight: 'bold' }}>{statisticsData.totalUsers.toLocaleString()}</span>
            </div>
          </div>
        </Col>
        <Col span={6} style={{ borderRight: '1px solid #f0f0f0' }}>
          <div style={{ padding: '0 16px' }}>
            <div style={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.45)', marginBottom: '8px' }}>商家数量</div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <ShopOutlined style={{ color: '#52c41a', fontSize: '20px', marginRight: '8px' }} />
              <span style={{ color: '#52c41a', fontSize: '24px', fontWeight: 'bold' }}>{statisticsData.totalMerchants.toLocaleString()}</span>
            </div>
          </div>
        </Col>
        <Col span={6} style={{ borderRight: '1px solid #f0f0f0' }}>
          <div style={{ padding: '0 16px' }}>
            <div style={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.45)', marginBottom: '8px' }}>总订单数</div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <ShoppingCartOutlined style={{ color: '#faad14', fontSize: '20px', marginRight: '8px' }} />
              <span style={{ color: '#faad14', fontSize: '24px', fontWeight: 'bold' }}>{statisticsData.totalOrders.toLocaleString()}</span>
            </div>
          </div>
        </Col>
        <Col span={6}>
          <div style={{ padding: '0 16px' }}>
            <div style={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.45)', marginBottom: '8px' }}>平台GMV</div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <WalletOutlined style={{ color: '#722ed1', fontSize: '20px', marginRight: '8px' }} />
              <span style={{ color: '#722ed1', fontSize: '24px', fontWeight: 'bold' }}>{statisticsData.gmv.toLocaleString()} 元</span>
            </div>
          </div>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card>
            <Statistic
              title="今日订单数"
              value={128}
              precision={0}
              valueStyle={{ color: '#3f8600' }}
              prefix={<ArrowUpOutlined />}
              suffix="单"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="今日营业额"
              value={12800}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              prefix={<ArrowUpOutlined />}
              suffix="元"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="新增用户"
              value={56}
              precision={0}
              valueStyle={{ color: '#3f8600' }}
              prefix={<ArrowUpOutlined />}
              suffix="人"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="转化率"
              value={8.5}
              precision={2}
              valueStyle={{ color: '#cf1322' }}
              prefix={<ArrowDownOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={16}>
          <Card
            title="订单与收入趋势"
            extra={
              <Space>
                <RangePicker
                  defaultValue={[dayjs(timeRange[0]), dayjs(timeRange[1])]}
                  onChange={handleTimeRangeChange}
                />
                <Button icon={<ExportOutlined />} onClick={handleExport}>
                  导出
                </Button>
              </Space>
            }
          >
            <Line {...lineConfig} height={300} />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="待办事项">
            <List
              dataSource={todoItems}
              renderItem={item => (
                <List.Item
                  extra={
                    <Tag color={
                      item.status === 'urgent' ? 'error' :
                      item.status === 'warning' ? 'warning' : 
                      'default'
                    }>
                      {item.count}
                    </Tag>
                  }
                >
                  <List.Item.Meta
                    title={<a onClick={() => handleCardClick(`/${item.type}`)}>{item.title}</a>}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card title="热门酒店">
            <List
              itemLayout="horizontal"
              dataSource={hotHotelsData}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<ShopOutlined />} />}
                    title={<a>{item.name}</a>}
                    description={
                      <Space>
                        <span style={{ color: '#faad14' }}>
                          <StarFilled /> {item.rating}
                        </span>
                        <span>入住率: {item.occupancy}%</span>
                        <span>价格: ¥{item.price}</span>
                      </Space>
                    }
                  />
                  <div>预订量: {item.bookings}</div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="订单趋势">
            <Column {...orderColumnConfig} height={300} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
          <Card title="用户分布" bordered={true}>
            <div style={{ height: 320, padding: '0 20px' }}>
              <Pie {...userPieConfig} />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
          <Card title="收入统计" bordered={true}>
            <div style={{ height: 320, padding: '0 20px' }}>
              <Pie {...revenuePieConfig} />
            </div>
          </Card>
        </Col>
      </Row>

      {/* 商家活跃度排行 */}
      <Row style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card title="商家活跃度排行">
            <Table
              dataSource={merchantRankData}
              pagination={false}
              columns={[
                {
                  title: '排名',
                  dataIndex: 'rank',
                  key: 'rank',
                  render: (rank) => (
                    <Tag color={rank <= 3 ? 'gold' : 'default'}>
                      {rank}
                    </Tag>
                  ),
                },
                {
                  title: '商家名称',
                  dataIndex: 'name',
                  key: 'name',
                  render: (text) => <a>{text}</a>,
                },
                {
                  title: '订单数',
                  dataIndex: 'orderCount',
                  key: 'orderCount',
                  sorter: (a, b) => a.orderCount - b.orderCount,
                },
                {
                  title: '营业额',
                  dataIndex: 'revenue',
                  key: 'revenue',
                  sorter: (a, b) => a.revenue - b.revenue,
                  render: (revenue) => `¥${revenue.toLocaleString()}`,
                },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard; 
import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, DatePicker, Select, Table, Tag, Space, Alert, Tabs, Button, Tooltip } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, ExclamationCircleOutlined, CheckCircleOutlined, DownloadOutlined } from '@ant-design/icons';
import { Line, Pie, Column } from '@ant-design/plots';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

// mock 数据结构
const mockStats = {
  totalActivities: 156,
  activeActivities: 42,
  totalImpressions: 128560,
  totalClicks: 3250,
  totalLeads: 3245,
  totalConversions: 820,
  totalBudget: 290000,
  totalSpent: 187000,
  avgCTR: 0.025,
  avgCVR: 0.08,
  weekGrowth: {
    impressions: 15.2,
    clicks: 9.8,
    conversions: -3.5,
    spent: 12.6
  }
};

const mockTrend = [
  { date: '2024-01-01', impressions: 3500, clicks: 320, leads: 85, conversions: 12, spent: 1200 },
  { date: '2024-01-02', impressions: 3800, clicks: 350, leads: 92, conversions: 15, spent: 1300 },
  { date: '2024-01-03', impressions: 3200, clicks: 280, leads: 78, conversions: 10, spent: 1100 },
  { date: '2024-01-04', impressions: 4200, clicks: 420, leads: 105, conversions: 18, spent: 1500 },
  { date: '2024-01-05', impressions: 4500, clicks: 460, leads: 115, conversions: 22, spent: 1600 },
  { date: '2024-01-06', impressions: 4100, clicks: 380, leads: 98, conversions: 16, spent: 1400 },
  { date: '2024-01-07', impressions: 3900, clicks: 340, leads: 88, conversions: 14, spent: 1350 },
];

const mockTypeDist = [
  { type: '房源推广', count: 86, budget: 156000, spent: 98000 },
  { type: '品牌推广', count: 42, budget: 89000, spent: 65000 },
  { type: '活动推广', count: 28, budget: 45000, spent: 24000 },
];

const mockTopList = [
  { name: '春季特惠房源推广', type: '房源推广', impressions: 25000, clicks: 900, conversions: 120, spent: 12000, ctr: 0.036, cvr: 0.133 },
  { name: '品牌形象推广', type: '品牌推广', impressions: 18000, clicks: 700, conversions: 80, spent: 9500, ctr: 0.039, cvr: 0.114 },
  { name: '五一活动推广', type: '活动推广', impressions: 12000, clicks: 500, conversions: 60, spent: 8000, ctr: 0.042, cvr: 0.12 },
  { name: '暑期公寓推广', type: '房源推广', impressions: 11000, clicks: 420, conversions: 55, spent: 7000, ctr: 0.038, cvr: 0.131 },
  { name: '新品牌上线', type: '品牌推广', impressions: 9000, clicks: 350, conversions: 40, spent: 6000, ctr: 0.039, cvr: 0.114 },
];

// 异常监控数据
const mockAnomalies = [
  { name: '夏季度假酒店推广', type: '房源推广', issue: 'budget', severity: 'high', description: '预算消耗过快，预计3天内耗尽' },
  { name: '精品酒店品牌', type: '品牌推广', issue: 'performance', severity: 'medium', description: '点击率低于行业平均值45%' },
  { name: '周末特惠活动', type: '活动推广', issue: 'conversion', severity: 'high', description: '转化率突然下降60%' },
];

const typeOptions = [
  { label: '全部类型', value: '' },
  { label: '房源推广', value: '房源推广' },
  { label: '品牌推广', value: '品牌推广' },
  { label: '活动推广', value: '活动推广' },
];

const statusOptions = [
  { label: '全部状态', value: '' },
  { label: '进行中', value: 'running' },
  { label: '已暂停', value: 'paused' },
  { label: '已结束', value: 'ended' },
];

const PromotionAnalysis: React.FC = () => {
  const [dateRange, setDateRange] = useState([
    dayjs().subtract(6, 'day'),
    dayjs(),
  ]);
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);

  // 筛选后的榜单
  const filteredTopList = mockTopList.filter(item =>
    (!type || item.type === type)
  );

  // 模拟数据加载
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 600);
  }, [dateRange, type, status]);

  // 趋势数据转换为@ant-design/plots格式
  const trendChartData = mockTrend.reduce((acc: any[], curr) => {
    return acc.concat([
      { date: curr.date, type: '展示量', value: curr.impressions },
      { date: curr.date, type: '点击量', value: curr.clicks },
      { date: curr.date, type: '转化量', value: curr.conversions },
      { date: curr.date, type: '消耗', value: curr.spent },
    ]);
  }, []);

  // 类型分布图表数据
  const typeDistData = mockTypeDist.map(item => ({
    type: item.type,
    value: item.count
  }));

  // 预算使用分布数据
  const budgetDistData = mockTypeDist.map(item => ({
    type: item.type,
    value: item.spent,
    budget: item.budget,
    percentage: ((item.spent / item.budget) * 100).toFixed(1)
  }));

  return (
    <div className="space-y-4 p-4">
      {/* 筛选区 */}
      <Card bordered={false}>
        <Row gutter={16} align="middle">
          <Col>
            <span className="mr-2">时间范围：</span>
            <RangePicker
              value={dateRange as any}
              onChange={v => setDateRange(v as any)}
              allowClear={false}
              className="!w-64"
            />
          </Col>
          <Col>
            <span className="mr-2">活动类型：</span>
            <Select
              value={type}
              onChange={setType}
              options={typeOptions}
              className="!w-36"
            />
          </Col>
          <Col>
            <span className="mr-2">活动状态：</span>
            <Select
              value={status}
              onChange={setStatus}
              options={statusOptions}
              className="!w-36"
            />
          </Col>
          <Col flex="auto" style={{ textAlign: 'right' }}>
            <Button icon={<DownloadOutlined />}>
              导出数据
            </Button>
          </Col>
        </Row>
      </Card>

      {/* 异常警告区 */}
      {mockAnomalies.length > 0 && (
        <Alert
          type="warning"
          showIcon
          icon={<ExclamationCircleOutlined />}
          message={
            <span>
              系统检测到 <strong>{mockAnomalies.length}</strong> 个推广活动存在异常，请及时处理
            </span>
          }
          description={
            <ul className="mt-2">
              {mockAnomalies.map((item, index) => (
                <li key={index}>
                  <Tag color={item.severity === 'high' ? 'error' : 'warning'}>
                    {item.severity === 'high' ? '高风险' : '中风险'}
                  </Tag>{' '}
                  <strong>{item.name}</strong>（{item.type}）：{item.description}
                </li>
              ))}
            </ul>
          }
        />
      )}

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="概览分析" key="overview">
          {/* 数据概览 */}
          <Card title="数据概览" bordered={false} loading={loading} className="mb-4">
            <Row gutter={24}>
              <Col span={6}>
                <Statistic 
                  title="总推广活动" 
                  value={mockStats.totalActivities} 
                  suffix="个" 
                />
                <div className="mt-1 text-xs text-gray-500">其中进行中: {mockStats.activeActivities}个</div>
              </Col>
              <Col span={6}>
                <Statistic 
                  title="总预算/消耗" 
                  value={mockStats.totalSpent} 
                  suffix={` / ${mockStats.totalBudget}`} 
                  precision={0} 
                  prefix="¥" 
                />
                <div className="mt-1 text-xs text-gray-500">
                  消耗率: {((mockStats.totalSpent / mockStats.totalBudget) * 100).toFixed(1)}%
                </div>
              </Col>
              <Col span={6}>
                <Statistic 
                  title="总展示/点击" 
                  value={mockStats.totalImpressions} 
                  suffix={` / ${mockStats.totalClicks}`} 
                  precision={0} 
                />
                <div className="mt-1 text-xs text-gray-500">
                  点击率: {(mockStats.avgCTR * 100).toFixed(2)}%{' '}
                  <span className="text-green-500">
                    <ArrowUpOutlined /> {mockStats.weekGrowth.clicks}%
                  </span>
                </div>
              </Col>
              <Col span={6}>
                <Statistic 
                  title="总转化" 
                  value={mockStats.totalConversions} 
                  suffix="次" 
                />
                <div className="mt-1 text-xs text-gray-500">
                  转化率: {(mockStats.avgCVR * 100).toFixed(2)}%{' '}
                  <span className="text-red-500">
                    <ArrowDownOutlined /> {Math.abs(mockStats.weekGrowth.conversions)}%
                  </span>
                </div>
              </Col>
            </Row>
          </Card>

          {/* 趋势分析 */}
          <Card title="推广效果趋势" bordered={false} loading={loading} className="mb-4">
            <Line 
              data={trendChartData} 
              xField="date" 
              yField="value" 
              seriesField="type"
              smooth
              point={{
                size: 3,
                shape: 'circle',
                style: {
                  opacity: 0.8,
                },
              }}
              legend={{
                position: 'top',
              }}
              animation={{
                appear: {
                  duration: 1000,
                },
              }}
              height={300}
            />
          </Card>

          <Row gutter={16}>
            {/* 类型分布 */}
            <Col span={12}>
              <Card title="推广类型分布" bordered={false} loading={loading}>
                <Row gutter={16}>
                  <Col span={12}>
                    <Pie 
                      data={typeDistData} 
                      angleField="value" 
                      colorField="type" 
                      radius={0.8}
                      label={{
                        type: 'outer',
                        content: '{name} {percentage}',
                      }}
                      interactions={[
                        { type: 'pie-legend-active' },
                        { type: 'element-active' },
                      ]}
                      height={240}
                    />
                  </Col>
                  <Col span={12}>
                    <Column 
                      data={budgetDistData} 
                      xField="type" 
                      yField="value" 
                      label={{
                        position: 'top',
                        content: (data: { percentage: string }) => `${data.percentage}%`,
                      }}
                      height={240}
                    />
                  </Col>
                </Row>
              </Card>
            </Col>

            {/* TOP榜单 */}
            <Col span={12}>
              <Card title="活动TOP榜单" bordered={false} loading={loading}>
                <Table
                  dataSource={filteredTopList.slice(0, 3)}
                  rowKey="name"
                  pagination={false}
                  size="small"
                  columns={[
                    { 
                      title: '活动名称', 
                      dataIndex: 'name', 
                      key: 'name',
                      render: (text, record) => (
                        <Tooltip title={`${record.type} | 点击率: ${(record.ctr * 100).toFixed(2)}% | 转化率: ${(record.cvr * 100).toFixed(2)}%`}>
                          <span>{text}</span>
                        </Tooltip>
                      )
                    },
                    { 
                      title: '展示/点击', 
                      key: 'impressions',
                      render: (_, record) => (
                        <span>{record.impressions.toLocaleString()} / {record.clicks.toLocaleString()}</span>
                      )
                    },
                    { 
                      title: '消耗(元)', 
                      dataIndex: 'spent', 
                      key: 'spent',
                      render: (spent) => <span className="text-red-500">¥{spent.toLocaleString()}</span>
                    },
                  ]}
                />
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab="详细数据" key="details">
          <Card bordered={false} loading={loading}>
            <Table
              dataSource={filteredTopList}
              rowKey="name"
              pagination={{ pageSize: 10 }}
              columns={[
                { 
                  title: '活动名称', 
                  dataIndex: 'name', 
                  key: 'name',
                  width: 200,
                },
                { 
                  title: '类型', 
                  dataIndex: 'type', 
                  key: 'type', 
                  width: 100,
                  render: (t: string) => <Tag>{t}</Tag> 
                },
                { 
                  title: '展示量', 
                  dataIndex: 'impressions', 
                  key: 'impressions',
                  width: 100,
                  sorter: (a, b) => a.impressions - b.impressions,
                  render: (val) => val.toLocaleString()
                },
                { 
                  title: '点击量', 
                  dataIndex: 'clicks', 
                  key: 'clicks',
                  width: 100,
                  sorter: (a, b) => a.clicks - b.clicks,
                  render: (val) => val.toLocaleString()
                },
                { 
                  title: '点击率', 
                  key: 'ctr',
                  width: 100,
                  sorter: (a, b) => a.ctr - b.ctr,
                  render: (_, record) => `${(record.ctr * 100).toFixed(2)}%`
                },
                { 
                  title: '转化量', 
                  dataIndex: 'conversions', 
                  key: 'conversions',
                  width: 100,
                  sorter: (a, b) => a.conversions - b.conversions,
                  render: (val) => val.toLocaleString()
                },
                { 
                  title: '转化率', 
                  key: 'cvr',
                  width: 100,
                  sorter: (a, b) => a.cvr - b.cvr,
                  render: (_, record) => `${(record.cvr * 100).toFixed(2)}%`
                },
                { 
                  title: '消耗(元)', 
                  dataIndex: 'spent', 
                  key: 'spent',
                  width: 100,
                  sorter: (a, b) => a.spent - b.spent,
                  render: (val) => `¥${val.toLocaleString()}`
                },
              ]}
            />
          </Card>
        </TabPane>

        <TabPane tab="效果评估" key="evaluation">
          <Card bordered={false} loading={loading}>
            <Row gutter={16}>
              {filteredTopList.slice(0, 3).map((activity, index) => (
                <Col span={8} key={activity.name}>
                  <Card 
                    title={
                      <div className="flex items-center">
                        <span className="mr-2">
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                        </span>
                        <span className="truncate">{activity.name}</span>
                      </div>
                    } 
                    size="small"
                  >
                    <Statistic 
                      title="投入产出比" 
                      value={(activity.conversions * 100 / activity.spent).toFixed(2)} 
                      suffix="转化/百元" 
                      valueStyle={{ color: '#3f8600' }}
                      prefix={<CheckCircleOutlined />}
                    />
                    <div className="mt-4">
                      <div className="flex justify-between mb-1">
                        <span>点击率</span>
                        <span className={activity.ctr > mockStats.avgCTR ? 'text-green-500' : 'text-red-500'}>
                          {(activity.ctr * 100).toFixed(2)}%
                          {activity.ctr > mockStats.avgCTR ? 
                            <ArrowUpOutlined className="ml-1" /> : 
                            <ArrowDownOutlined className="ml-1" />
                          }
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>转化率</span>
                        <span className={activity.cvr > mockStats.avgCVR ? 'text-green-500' : 'text-red-500'}>
                          {(activity.cvr * 100).toFixed(2)}%
                          {activity.cvr > mockStats.avgCVR ? 
                            <ArrowUpOutlined className="ml-1" /> : 
                            <ArrowDownOutlined className="ml-1" />
                          }
                        </span>
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>

            <div className="mt-4">
              <Alert 
                message="效果优化建议" 
                type="info"
                showIcon
                description={
                  <ul className="mt-2">
                    <li>房源推广活动点击率高于平均水平15%，建议增加预算投入</li>
                    <li>品牌推广活动转化率低于行业标准，建议优化落地页体验</li>
                    <li>活动推广投入产出比最高，建议在节假日期间加大投放力度</li>
                  </ul>
                }
              />
            </div>
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default PromotionAnalysis; 
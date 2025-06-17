import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, DatePicker, Spin, Select, Button, Divider, Table, Space, Tag, message } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, DollarOutlined, AreaChartOutlined, PieChartOutlined } from '@ant-design/icons';
import { Line, Pie, Column } from '@ant-design/charts';
import type { RevenueStats, RevenueSource } from '../../../types/finance';

const { RangePicker } = DatePicker;
const { Option } = Select;

// 模拟数据
const mockRevenueStats: RevenueStats = {
  totalRevenue: 1258960.50,
  totalCommission: 125896.05,
  netRevenue: 1133064.45,
  comparedToLastPeriod: 0.12, // 12% 增长
  revenueSources: [
    { source: '酒店预订', amount: 685020.25, percentage: 0.54, orderCount: 3526, trend: 0.15 },
    { source: '长租公寓', amount: 432690.15, percentage: 0.34, orderCount: 584, trend: 0.08 },
    { source: '民宿短租', amount: 126950.10, percentage: 0.10, orderCount: 1247, trend: 0.21 },
    { source: '其他服务', amount: 14300.00, percentage: 0.02, orderCount: 215, trend: -0.05 },
  ],
  timeDistribution: [
    { date: '2023-05-01', revenue: 35680.25, commission: 3568.03 },
    { date: '2023-05-02', revenue: 42150.75, commission: 4215.08 },
    { date: '2023-05-03', revenue: 38920.50, commission: 3892.05 },
    { date: '2023-05-04', revenue: 41230.30, commission: 4123.03 },
    { date: '2023-05-05', revenue: 45680.20, commission: 4568.02 },
    { date: '2023-05-06', revenue: 52340.80, commission: 5234.08 },
    { date: '2023-05-07', revenue: 58760.30, commission: 5876.03 },
    { date: '2023-05-08', revenue: 49820.45, commission: 4982.05 },
    { date: '2023-05-09', revenue: 42380.60, commission: 4238.06 },
    { date: '2023-05-10', revenue: 39650.75, commission: 3965.08 },
    { date: '2023-05-11', revenue: 41890.30, commission: 4189.03 },
    { date: '2023-05-12', revenue: 45230.50, commission: 4523.05 },
    { date: '2023-05-13', revenue: 51680.70, commission: 5168.07 },
    { date: '2023-05-14', revenue: 56780.25, commission: 5678.03 },
    { date: '2023-05-15', revenue: 48960.50, commission: 4896.05 },
    { date: '2023-05-16', revenue: 43250.40, commission: 4325.04 },
    { date: '2023-05-17', revenue: 39820.35, commission: 3982.04 },
    { date: '2023-05-18', revenue: 42580.60, commission: 4258.06 },
    { date: '2023-05-19', revenue: 47820.30, commission: 4782.03 },
    { date: '2023-05-20', revenue: 53250.40, commission: 5325.04 },
    { date: '2023-05-21', revenue: 58950.60, commission: 5895.06 },
    { date: '2023-05-22', revenue: 49350.25, commission: 4935.03 },
    { date: '2023-05-23', revenue: 42580.30, commission: 4258.03 },
    { date: '2023-05-24', revenue: 38760.50, commission: 3876.05 },
    { date: '2023-05-25', revenue: 41230.75, commission: 4123.08 },
    { date: '2023-05-26', revenue: 46580.20, commission: 4658.02 },
    { date: '2023-05-27', revenue: 52870.35, commission: 5287.04 },
    { date: '2023-05-28', revenue: 58250.50, commission: 5825.05 },
    { date: '2023-05-29', revenue: 50120.45, commission: 5012.05 },
    { date: '2023-05-30', revenue: 43850.65, commission: 4385.07 },
    { date: '2023-05-31', revenue: 40260.30, commission: 4026.03 },
  ],
  businessTypeDistribution: [
    { type: '酒店', revenue: 756890.35, percentage: 0.60 },
    { type: '长租', revenue: 326850.25, percentage: 0.26 },
    { type: '民宿', revenue: 138650.90, percentage: 0.11 },
    { type: '其他', revenue: 36569.00, percentage: 0.03 },
  ],
};

const FinanceRevenue: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [statsData, setStatsData] = useState<RevenueStats>(mockRevenueStats);
  const [timeRange, setTimeRange] = useState<string>('month');
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);

  // 模拟数据加载
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setStatsData(mockRevenueStats);
      setLoading(false);
    }, 800);
  }, [timeRange, dateRange]);

  // 收入来源表格列定义
  const sourceColumns = [
    {
      title: '收入来源',
      dataIndex: 'source',
      key: 'source',
    },
    {
      title: '订单数',
      dataIndex: 'orderCount',
      key: 'orderCount',
      sorter: (a: RevenueSource, b: RevenueSource) => a.orderCount - b.orderCount,
    },
    {
      title: '收入金额',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `¥${amount.toFixed(2)}`,
      sorter: (a: RevenueSource, b: RevenueSource) => a.amount - b.amount,
    },
    {
      title: '占比',
      dataIndex: 'percentage',
      key: 'percentage',
      render: (percentage: number) => `${(percentage * 100).toFixed(2)}%`,
      sorter: (a: RevenueSource, b: RevenueSource) => a.percentage - b.percentage,
    },
    {
      title: '环比趋势',
      dataIndex: 'trend',
      key: 'trend',
      render: (trend: number) => (
        <Space>
          {trend >= 0 ? (
            <Tag color="green">
              <ArrowUpOutlined /> {(trend * 100).toFixed(2)}%
            </Tag>
          ) : (
            <Tag color="red">
              <ArrowDownOutlined /> {Math.abs(trend * 100).toFixed(2)}%
            </Tag>
          )}
        </Space>
      ),
      sorter: (a: RevenueSource, b: RevenueSource) => a.trend - b.trend,
    },
  ];

  // 收入趋势图表配置
  const revenueChartConfig = {
    data: statsData.timeDistribution,
    xField: 'date',
    yField: 'revenue',
    seriesField: 'type',
    legend: {
      position: 'top',
    },
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
    xAxis: {
      type: 'time',
      tickCount: 8,
    },
    yAxis: {
      label: {
        formatter: (v: string) => `¥${Number(v).toFixed(0)}`,
      },
    },
  };

  // 业务类型分布图表配置
  const businessTypeConfig = {
    data: statsData.businessTypeDistribution,
    angleField: 'revenue',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name}: {percentage}',
      formatter: (datum: any) => {
        return `${datum.type}: ${(datum.percentage * 100).toFixed(2)}%`;
      },
    },
    legend: {
      layout: 'horizontal',
      position: 'bottom',
    },
    interactions: [{ type: 'element-active' }],
  };

  // 收入来源分布图表配置
  const sourceDistributionConfig = {
    data: statsData.revenueSources,
    xField: 'source',
    yField: 'amount',
    label: {
      position: 'middle',
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    meta: {
      source: { alias: '收入来源' },
      amount: { alias: '收入金额', formatter: (v: number) => `¥${v.toFixed(2)}` },
    },
    color: ({ source }: any) => {
      const colors: Record<string, string> = {
        '酒店预订': '#1890ff',
        '长租公寓': '#52c41a',
        '民宿短租': '#faad14',
        '其他服务': '#f5222d',
      };
      return colors[source] || '#1890ff';
    },
  };

  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
  };

  const handleDateRangeChange = (dates: any) => {
    if (dates && dates.length === 2) {
      setDateRange(dates);
    } else {
      setDateRange(null);
    }
  };

  const handleExport = () => {
    message.success('数据导出功能将在后续版本开放');
  };

  return (
    <Spin spinning={loading}>
      <div className="finance-revenue">
        {/* 筛选器 */}
        <Card style={{ marginBottom: 16 }}>
          <Row gutter={16} align="middle">
            <Col span={4}>
              <span style={{ marginRight: 8 }}>时间范围:</span>
              <Select 
                defaultValue="month" 
                style={{ width: 120 }} 
                onChange={handleTimeRangeChange}
              >
                <Option value="today">今日</Option>
                <Option value="yesterday">昨日</Option>
                <Option value="week">本周</Option>
                <Option value="month">本月</Option>
                <Option value="quarter">本季度</Option>
                <Option value="year">本年</Option>
              </Select>
            </Col>
            <Col span={6}>
              <RangePicker onChange={handleDateRangeChange} style={{ width: '100%' }} />
            </Col>
            <Col span={14} style={{ textAlign: 'right' }}>
              <Button type="primary" onClick={handleExport} icon={<AreaChartOutlined />}>
                导出数据
              </Button>
            </Col>
          </Row>
        </Card>

        {/* 总览卡片 */}
        <Row gutter={16}>
          <Col span={8}>
            <Card>
              <Statistic
                title="总收入"
                value={statsData.totalRevenue}
                precision={2}
                valueStyle={{ color: '#1890ff' }}
                prefix={<DollarOutlined />}
                suffix="元"
              />
              <div style={{ marginTop: 8 }}>
                {statsData.comparedToLastPeriod >= 0 ? (
                  <span style={{ color: '#52c41a' }}>
                    <ArrowUpOutlined /> 环比增长 {(statsData.comparedToLastPeriod * 100).toFixed(2)}%
                  </span>
                ) : (
                  <span style={{ color: '#f5222d' }}>
                    <ArrowDownOutlined /> 环比下降 {Math.abs(statsData.comparedToLastPeriod * 100).toFixed(2)}%
                  </span>
                )}
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="平台佣金"
                value={statsData.totalCommission}
                precision={2}
                valueStyle={{ color: '#52c41a' }}
                prefix={<DollarOutlined />}
                suffix="元"
              />
              <div style={{ marginTop: 8 }}>
                平均佣金率: {((statsData.totalCommission / statsData.totalRevenue) * 100).toFixed(2)}%
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="净收入"
                value={statsData.netRevenue}
                precision={2}
                valueStyle={{ color: '#722ed1' }}
                prefix={<DollarOutlined />}
                suffix="元"
              />
              <div style={{ marginTop: 8 }}>
                净利润率: {((statsData.netRevenue / statsData.totalRevenue) * 100).toFixed(2)}%
              </div>
            </Card>
          </Col>
        </Row>

        {/* 收入趋势图表 */}
        <Card title="收入趋势" style={{ marginTop: 16 }}>
          <div style={{ height: 400 }}>
            <Line {...revenueChartConfig} />
          </div>
        </Card>

        {/* 收入来源和业务类型分布 */}
        <Row gutter={16} style={{ marginTop: 16 }}>
          <Col span={12}>
            <Card title="收入来源分布" className="chart-card">
              <div style={{ height: 300 }}>
                <Column {...sourceDistributionConfig} />
              </div>
              <Divider />
              <Table
                columns={sourceColumns}
                dataSource={statsData.revenueSources}
                rowKey="source"
                pagination={false}
                size="small"
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card title="业务类型分布" className="chart-card">
              <div style={{ height: 300 }}>
                <Pie {...businessTypeConfig} />
              </div>
              <Divider />
              <Table
                columns={[
                  { title: '业务类型', dataIndex: 'type', key: 'type' },
                  { 
                    title: '收入金额', 
                    dataIndex: 'revenue', 
                    key: 'revenue',
                    render: (revenue: number) => `¥${revenue.toFixed(2)}`,
                  },
                  { 
                    title: '占比', 
                    dataIndex: 'percentage', 
                    key: 'percentage',
                    render: (percentage: number) => `${(percentage * 100).toFixed(2)}%`,
                  },
                ]}
                dataSource={statsData.businessTypeDistribution}
                rowKey="type"
                pagination={false}
                size="small"
              />
            </Card>
          </Col>
        </Row>
      </div>
    </Spin>
  );
};

export default FinanceRevenue; 
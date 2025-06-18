import React, { useState } from 'react';
import { Card, Form, Row, Col, Select, DatePicker, Button, Space, Tabs } from 'antd';
import type { StatsData, StatsSearchParams, RankingData } from '../../../types/merchant';
import { StatsPeriod, StatsMetric, RankingType } from '../../../types/merchant';
import StatsOverview from './components/StatsOverview';
import StatsTrend from './components/StatsTrend';
import RankingList from './components/RankingList';

const { Option } = Select;
const { RangePicker } = DatePicker;

// 模拟数据
const mockStatsData: StatsData = {
  current: {
    [StatsMetric.ORDER_COUNT]: { value: 100, change: 11.1 },
    [StatsMetric.ORDER_AMOUNT]: { value: 10000, change: 11.1 },
    [StatsMetric.COMMISSION]: { value: 500, change: 11.1 },
    [StatsMetric.REFUND_COUNT]: { value: 5, change: 25 },
    [StatsMetric.REFUND_AMOUNT]: { value: 500, change: 25 },
    [StatsMetric.NEW_CUSTOMER]: { value: 50, change: 11.1 },
    [StatsMetric.REPEAT_CUSTOMER]: { value: 20, change: 11.1 },
    [StatsMetric.REVIEW_COUNT]: { value: 30, change: 20 },
    [StatsMetric.AVERAGE_RATING]: { value: 4.5, change: 4.7 }
  },
  previous: {
    [StatsMetric.ORDER_COUNT]: { value: 90, change: 0 },
    [StatsMetric.ORDER_AMOUNT]: { value: 9000, change: 0 },
    [StatsMetric.COMMISSION]: { value: 450, change: 0 },
    [StatsMetric.REFUND_COUNT]: { value: 4, change: 0 },
    [StatsMetric.REFUND_AMOUNT]: { value: 400, change: 0 },
    [StatsMetric.NEW_CUSTOMER]: { value: 45, change: 0 },
    [StatsMetric.REPEAT_CUSTOMER]: { value: 18, change: 0 },
    [StatsMetric.REVIEW_COUNT]: { value: 25, change: 0 },
    [StatsMetric.AVERAGE_RATING]: { value: 4.3, change: 0 }
  },
  trend: [
    {
      date: '2024-03-15',
      [StatsMetric.ORDER_COUNT]: { value: 15, change: 0 },
      [StatsMetric.ORDER_AMOUNT]: { value: 1500, change: 0 },
      [StatsMetric.COMMISSION]: { value: 75, change: 0 },
      [StatsMetric.REFUND_COUNT]: { value: 1, change: 0 },
      [StatsMetric.REFUND_AMOUNT]: { value: 100, change: 0 },
      [StatsMetric.NEW_CUSTOMER]: { value: 8, change: 0 },
      [StatsMetric.REPEAT_CUSTOMER]: { value: 3, change: 0 },
      [StatsMetric.REVIEW_COUNT]: { value: 5, change: 0 },
      [StatsMetric.AVERAGE_RATING]: { value: 4.4, change: 0 }
    }
    // 更多数据...
  ]
};

const mockRankingData: RankingData = {
  type: RankingType.ORDER_AMOUNT,
  period: StatsPeriod.LAST_7_DAYS,
  list: [
    {
      merchantId: 1,
      merchantName: '瑞森酒店',
      value: 50000,
      change: 10,
      trend: [4800, 5200, 4900, 5100, 5300, 4700, 5000],
    },
    {
      merchantId: 2,
      merchantName: '海景公寓',
      value: 45000,
      change: 5,
      trend: [4300, 4500, 4200, 4600, 4400, 4800, 4500],
    },
    // 更多数据...
  ],
};

const MerchantStats: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedMetrics, setSelectedMetrics] = useState<StatsMetric[]>([
    StatsMetric.ORDER_COUNT,
    StatsMetric.ORDER_AMOUNT,
  ]);

  const handleSearch = (values: StatsSearchParams) => {
    console.log('搜索条件：', values);
    setLoading(true);
    // 这里添加实际的搜索逻辑
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handlePeriodChange = (period: StatsPeriod) => {
    if (period === StatsPeriod.CUSTOM) {
      form.setFieldsValue({ timeRange: null });
    } else {
      form.setFieldsValue({ timeRange: undefined });
    }
  };

  const renderSearchForm = () => (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSearch}
      initialValues={{ period: StatsPeriod.LAST_7_DAYS }}
    >
      <Row gutter={16}>
        <Col span={6}>
          <Form.Item name="period" label="时间范围">
            <Select onChange={handlePeriodChange}>
              <Option value={StatsPeriod.TODAY}>今日</Option>
              <Option value={StatsPeriod.YESTERDAY}>昨日</Option>
              <Option value={StatsPeriod.LAST_7_DAYS}>近7天</Option>
              <Option value={StatsPeriod.LAST_30_DAYS}>近30天</Option>
              <Option value={StatsPeriod.THIS_MONTH}>本月</Option>
              <Option value={StatsPeriod.LAST_MONTH}>上月</Option>
              <Option value={StatsPeriod.CUSTOM}>自定义</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues?.period !== currentValues?.period
            }
          >
            {({ getFieldValue }) =>
              getFieldValue('period') === StatsPeriod.CUSTOM ? (
                <Form.Item name="timeRange" label="自定义时间">
                  <RangePicker style={{ width: '100%' }} />
                </Form.Item>
              ) : null
            }
          </Form.Item>
        </Col>
        <Col span={10}>
          <Form.Item name="metrics" label="统计指标">
            <Select
              mode="multiple"
              placeholder="请选择统计指标"
              value={selectedMetrics}
              onChange={setSelectedMetrics}
              style={{ width: '100%' }}
            >
              <Option value={StatsMetric.ORDER_COUNT}>订单数</Option>
              <Option value={StatsMetric.ORDER_AMOUNT}>订单金额</Option>
              <Option value={StatsMetric.COMMISSION}>佣金</Option>
              <Option value={StatsMetric.REFUND_COUNT}>退款数</Option>
              <Option value={StatsMetric.REFUND_AMOUNT}>退款金额</Option>
              <Option value={StatsMetric.NEW_CUSTOMER}>新客户数</Option>
              <Option value={StatsMetric.REPEAT_CUSTOMER}>复购客户数</Option>
              <Option value={StatsMetric.REVIEW_COUNT}>评价数</Option>
              <Option value={StatsMetric.AVERAGE_RATING}>平均评分</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24} style={{ textAlign: 'right' }}>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              查询
            </Button>
            <Button onClick={() => form.resetFields()}>重置</Button>
          </Space>
        </Col>
      </Row>
    </Form>
  );

  const items = [
    {
      key: 'overview',
      label: '数据概览',
      children: <StatsOverview data={mockStatsData.current} />,
    },
    {
      key: 'trend',
      label: '趋势分析',
      children: <StatsTrend data={mockStatsData.trend} metrics={selectedMetrics} />,
    },
    {
      key: 'ranking',
      label: '排行榜',
      children: <RankingList data={mockRankingData} />,
    },
  ];

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>{renderSearchForm()}</Card>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={items}
      />
    </div>
  );
};

export default MerchantStats; 
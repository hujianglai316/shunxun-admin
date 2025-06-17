import React from 'react';
import { Row, Col, Statistic, Card, Tooltip } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import type { StatsOverviewData } from '../types';

const mockData: StatsOverviewData = {
  totalActivities: 156,
  activeActivities: 42,
  totalImpressions: 128560,
  totalLeads: 3245,
  weekGrowth: {
    activities: 15,
    impressions: 23,
    leads: -5
  }
};

const StatsOverview: React.FC = () => {
  return (
    <Row gutter={[24, 24]}>
      <Col span={6}>
        <Tooltip title="所有状态的推广活动总数">
          <Statistic
            title="总推广活动"
            value={mockData.totalActivities}
            suffix="个"
          />
        </Tooltip>
      </Col>
      <Col span={6}>
        <Tooltip title="当前正在进行中的推广活动数量">
          <Statistic
            title="进行中活动"
            value={mockData.activeActivities}
            suffix="个"
            valueStyle={{ color: '#52c41a' }}
            prefix={<ArrowUpOutlined />}
          />
        </Tooltip>
      </Col>
      <Col span={6}>
        <Tooltip title="所有推广活动的总展示次数">
          <Statistic
            title="总展示次数"
            value={mockData.totalImpressions}
            suffix="次"
            precision={0}
            valueStyle={{ color: '#1890ff' }}
            prefix={<ArrowUpOutlined />}
          />
        </Tooltip>
      </Col>
      <Col span={6}>
        <Tooltip title="所有推广活动产生的总线索数">
          <Statistic
            title="总获取线索"
            value={mockData.totalLeads}
            suffix="条"
            valueStyle={mockData.weekGrowth.leads >= 0 ? { color: '#52c41a' } : { color: '#ff4d4f' }}
            prefix={mockData.weekGrowth.leads >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
          />
        </Tooltip>
      </Col>
      
      <Col span={24}>
        <Card size="small" title="周同比数据" bordered={false}>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Statistic
                title="活动数增长"
                value={mockData.weekGrowth.activities}
                suffix="%"
                valueStyle={{ color: '#52c41a' }}
                prefix={<ArrowUpOutlined />}
              />
            </Col>
            <Col span={8}>
              <Statistic
                title="展示量增长"
                value={mockData.weekGrowth.impressions}
                suffix="%"
                valueStyle={{ color: '#1890ff' }}
                prefix={<ArrowUpOutlined />}
              />
            </Col>
            <Col span={8}>
              <Statistic
                title="线索量增长"
                value={mockData.weekGrowth.leads}
                suffix="%"
                valueStyle={{ color: '#ff4d4f' }}
                prefix={<ArrowDownOutlined />}
              />
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
};

export default StatsOverview; 
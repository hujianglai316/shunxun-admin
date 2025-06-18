import React from 'react';
import { Card, Row, Col, Statistic, Progress, Tooltip } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { StatsMetric } from '../../../../types/merchant';
import type { StatsMetricData } from '../../../../types/merchant';

interface ExtendedStatsMetricData extends StatsMetricData {
  target?: number;
}

interface StatsOverviewProps {
  data: {
    [key in StatsMetric]: ExtendedStatsMetricData;
  };
}

const StatsOverview: React.FC<StatsOverviewProps> = ({ data }) => {
  const renderMetricName = (metric: StatsMetric) => {
    const nameMap = {
      [StatsMetric.ORDER_COUNT]: '订单数',
      [StatsMetric.ORDER_AMOUNT]: '订单金额',
      [StatsMetric.COMMISSION]: '佣金',
      [StatsMetric.REFUND_COUNT]: '退款数',
      [StatsMetric.REFUND_AMOUNT]: '退款金额',
      [StatsMetric.NEW_CUSTOMER]: '新客户数',
      [StatsMetric.REPEAT_CUSTOMER]: '复购客户数',
      [StatsMetric.REVIEW_COUNT]: '评价数',
      [StatsMetric.AVERAGE_RATING]: '平均评分',
    };
    return nameMap[metric];
  };

  const renderValue = (metric: StatsMetric, value: number) => {
    if (metric === StatsMetric.AVERAGE_RATING) {
      return value.toFixed(1);
    }
    if (
      metric === StatsMetric.ORDER_AMOUNT ||
      metric === StatsMetric.COMMISSION ||
      metric === StatsMetric.REFUND_AMOUNT
    ) {
      return `¥${value.toFixed(2)}`;
    }
    return value;
  };

  const renderChange = (change: number) => {
    const color = change >= 0 ? '#52c41a' : '#ff4d4f';
    const Icon = change >= 0 ? ArrowUpOutlined : ArrowDownOutlined;
    return (
      <span style={{ color }}>
        <Icon /> {Math.abs(change)}%
      </span>
    );
  };

  const renderProgress = (value: number, target?: number) => {
    if (!target) return null;
    const percent = Math.min(Math.round((value / target) * 100), 100);
    return (
      <Tooltip title={`目标: ${target}`}>
        <Progress
          percent={percent}
          size="small"
          strokeColor={{
            '0%': '#108ee9',
            '100%': '#87d068',
          }}
          showInfo={false}
        />
      </Tooltip>
    );
  };

  return (
    <Row gutter={[16, 16]}>
      {Object.entries(data).map(([metric, stats]) => (
        <Col key={metric} xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Statistic
              title={renderMetricName(metric as StatsMetric)}
              value={renderValue(metric as StatsMetric, stats.value)}
              suffix={renderChange(stats.change)}
            />
            {stats.target && renderProgress(stats.value, stats.target)}
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default StatsOverview; 
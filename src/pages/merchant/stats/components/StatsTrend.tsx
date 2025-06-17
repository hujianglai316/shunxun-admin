import React, { useMemo } from 'react';
import { Card, Empty } from 'antd';
import { Line } from '@ant-design/plots';
import { StatsMetric } from '../../../../types/merchant';
import type { StatsData, StatsMetricData, StatsTrendItem } from '../../../../types/merchant';

interface StatsTrendProps {
  data: StatsData['trend'];
  metrics: StatsMetric[];
}

interface ChartDataItem {
  date: string;
  value: number;
  metric: string;
}

const StatsTrend: React.FC<StatsTrendProps> = ({ data, metrics }) => {
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

  const chartData = useMemo<ChartDataItem[]>(() => {
    if (!data || !metrics || metrics.length === 0) return [];

    return metrics.flatMap(metric =>
      data.map((item: StatsTrendItem) => ({
        date: item.date,
        value: item[metric].value,
        metric: renderMetricName(metric),
      }))
    );
  }, [data, metrics]);

  if (!data || data.length === 0) {
    return (
      <Card title="趋势分析">
        <Empty description="暂无数据" />
      </Card>
    );
  }

  const config = {
    data: chartData,
    xField: 'date',
    yField: 'value',
    seriesField: 'metric',
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
    xAxis: {
      type: 'time',
      tickCount: 5,
    },
    yAxis: {
      label: {
        formatter: (value: number) => {
          // 根据指标类型格式化数值
          const isAmount = metrics.some(
            metric =>
              metric === StatsMetric.ORDER_AMOUNT ||
              metric === StatsMetric.COMMISSION ||
              metric === StatsMetric.REFUND_AMOUNT
          );
          if (isAmount) {
            return `¥${value}`;
          }
          return value;
        },
      },
    },
    tooltip: {
      showMarkers: true,
      shared: true,
    },
    legend: {
      position: 'top',
    },
    point: {
      size: 3,
      shape: 'circle',
      style: {
        fillOpacity: 1,
      },
    },
  };

  return (
    <Card title="趋势分析">
      <Line {...config} height={400} />
    </Card>
  );
};

export default StatsTrend; 
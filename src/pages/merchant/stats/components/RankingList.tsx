import React from 'react';
import { Card, Table, Tag, Space, Tooltip } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, MinusOutlined } from '@ant-design/icons';
import type { RankingData } from '../../../../types/merchant';
import { StatsPeriod, RankingType } from '../../../../types/merchant';

interface RankingListProps {
  data: RankingData;
}

const RankingList: React.FC<RankingListProps> = ({ data }) => {
  const renderRankingType = (type: RankingType) => {
    const typeMap = {
      [RankingType.ORDER_COUNT]: '订单数排行',
      [RankingType.ORDER_AMOUNT]: '订单金额排行',
      [RankingType.CUSTOMER_COUNT]: '客户数排行',
      [RankingType.REVIEW_RATING]: '评分排行',
      [RankingType.GROWTH_RATE]: '增长率排行',
    };
    return typeMap[type];
  };

  const renderPeriod = (period: StatsPeriod) => {
    const periodMap = {
      [StatsPeriod.TODAY]: '今日',
      [StatsPeriod.YESTERDAY]: '昨日',
      [StatsPeriod.LAST_7_DAYS]: '近7天',
      [StatsPeriod.LAST_30_DAYS]: '近30天',
      [StatsPeriod.THIS_MONTH]: '本月',
      [StatsPeriod.LAST_MONTH]: '上月',
      [StatsPeriod.CUSTOM]: '自定义',
    };
    return periodMap[period];
  };

  const renderValue = (value: number, type: RankingType) => {
    if (type === RankingType.ORDER_AMOUNT) {
      return `¥${value.toFixed(2)}`;
    }
    if (type === RankingType.REVIEW_RATING) {
      return value.toFixed(1);
    }
    if (type === RankingType.GROWTH_RATE) {
      return `${value.toFixed(1)}%`;
    }
    return value;
  };

  const renderChange = (change: number) => {
    if (change === 0) {
      return (
        <Tag color="default">
          <MinusOutlined /> 持平
        </Tag>
      );
    }
    const isPositive = change > 0;
    const Icon = isPositive ? ArrowUpOutlined : ArrowDownOutlined;
    const color = isPositive ? 'success' : 'error';
    return (
      <Tag color={color}>
        <Icon /> {Math.abs(change)}%
      </Tag>
    );
  };

  const renderTrend = (trend: number[]) => {
    if (!trend || trend.length === 0) return null;

    const min = Math.min(...trend);
    const max = Math.max(...trend);
    const range = max - min;
    const height = 20;

    return (
      <Tooltip
        title={
          <div>
            {trend.map((value, index) => (
              <div key={index}>
                第{index + 1}天：{value}
              </div>
            ))}
          </div>
        }
      >
        <svg width={60} height={height} style={{ display: 'block' }}>
          {trend.map((value, index) => {
            const x = (index * 60) / trend.length;
            const y = range === 0 ? height / 2 : height - ((value - min) / range) * height;
            const nextValue = trend[index + 1];
            if (nextValue !== undefined) {
              const nextX = ((index + 1) * 60) / trend.length;
              const nextY = range === 0 ? height / 2 : height - ((nextValue - min) / range) * height;
              return (
                <line
                  key={index}
                  x1={x}
                  y1={y}
                  x2={nextX}
                  y2={nextY}
                  stroke="#1890ff"
                  strokeWidth={1}
                />
              );
            }
            return null;
          })}
        </svg>
      </Tooltip>
    );
  };

  const columns = [
    {
      title: '排名',
      dataIndex: 'index',
      key: 'index',
      width: 80,
      render: (_: any, __: any, index: number) => {
        const rankColors = ['#f5222d', '#fa8c16', '#faad14'];
        const color = rankColors[index] || '#595959';
        return (
          <span style={{ color, fontWeight: index < 3 ? 'bold' : 'normal' }}>
            {index + 1}
          </span>
        );
      },
    },
    {
      title: '商家名称',
      dataIndex: 'merchantName',
      key: 'merchantName',
      ellipsis: true,
    },
    {
      title: '数值',
      dataIndex: 'value',
      key: 'value',
      width: 120,
      render: (value: number) => renderValue(value, data.type),
    },
    {
      title: '变化',
      dataIndex: 'change',
      key: 'change',
      width: 100,
      render: renderChange,
    },
    {
      title: '趋势',
      dataIndex: 'trend',
      key: 'trend',
      width: 100,
      render: renderTrend,
    },
  ];

  return (
    <Card
      title={
        <Space>
          {renderRankingType(data.type)}
          <Tag>{renderPeriod(data.period)}</Tag>
        </Space>
      }
    >
      <Table
        columns={columns}
        dataSource={data.list}
        rowKey="merchantId"
        pagination={false}
        size="small"
      />
    </Card>
  );
};

export default RankingList; 
import React from 'react';
import { Descriptions, Tag, Divider, Row, Col, Card, Statistic } from 'antd';
import { Line } from '@ant-design/plots';

interface PromotionMonitor {
  id: string;
  merchantName: string;
  promotionName: string;
  type: 'property' | 'brand' | 'activity';
  budget: number;
  spent: number;
  status: 'running' | 'paused' | 'ended';
  startTime: string;
  endTime: string;
  metrics: {
    impressions: number;
    clicks: number;
    conversions: number;
    ctr: number;
    cvr: number;
  };
}

interface Props {
  record: PromotionMonitor;
}

const MonitorList: React.FC<Props> = ({ record }) => {
  const getTypeTag = (type: string) => {
    const typeMap = {
      property: { color: 'blue', text: '房源推广' },
      brand: { color: 'purple', text: '品牌推广' },
      activity: { color: 'orange', text: '活动推广' },
    };
    const { color, text } = typeMap[type as keyof typeof typeMap];
    return <Tag color={color}>{text}</Tag>;
  };

  const getStatusTag = (status: string) => {
    const statusMap = {
      running: { color: 'success', text: '进行中' },
      paused: { color: 'warning', text: '已暂停' },
      ended: { color: 'default', text: '已结束' },
    };
    const { color, text } = statusMap[status as keyof typeof statusMap];
    return <Tag color={color}>{text}</Tag>;
  };

  // 模拟趋势数据
  const trendData = [
    { date: '2024-03-15', type: '展示量', value: 3500 },
    { date: '2024-03-16', type: '展示量', value: 4200 },
    { date: '2024-03-17', type: '展示量', value: 4800 },
    { date: '2024-03-15', type: '点击量', value: 120 },
    { date: '2024-03-16', type: '点击量', value: 160 },
    { date: '2024-03-17', type: '点击量', value: 170 },
    { date: '2024-03-15', type: '转化量', value: 8 },
    { date: '2024-03-16', type: '转化量', value: 10 },
    { date: '2024-03-17', type: '转化量', value: 12 },
  ];

  return (
    <div>
      <Descriptions title="基本信息" column={2}>
        <Descriptions.Item label="商家名称">{record.merchantName}</Descriptions.Item>
        <Descriptions.Item label="活动名称">{record.promotionName}</Descriptions.Item>
        <Descriptions.Item label="推广类型">{getTypeTag(record.type)}</Descriptions.Item>
        <Descriptions.Item label="状态">{getStatusTag(record.status)}</Descriptions.Item>
        <Descriptions.Item label="开始时间">{record.startTime}</Descriptions.Item>
        <Descriptions.Item label="结束时间">{record.endTime}</Descriptions.Item>
      </Descriptions>

      <Divider />

      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card>
            <Statistic
              title="预算使用"
              value={record.spent}
              suffix={` / ${record.budget}`}
              precision={2}
              prefix="¥"
            />
            <div style={{ marginTop: 8 }}>
              使用率：{((record.spent / record.budget) * 100).toFixed(1)}%
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="点击率(CTR)"
              value={record.metrics.ctr}
              precision={2}
              suffix="%"
            />
            <div style={{ marginTop: 8 }}>
              点击：{record.metrics.clicks.toLocaleString()}
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="转化率(CVR)"
              value={record.metrics.cvr}
              precision={2}
              suffix="%"
            />
            <div style={{ marginTop: 8 }}>
              转化：{record.metrics.conversions.toLocaleString()}
            </div>
          </Card>
        </Col>
      </Row>

      <Card title="效果趋势" style={{ marginTop: 16 }}>
        <Line
          data={trendData}
          xField="date"
          yField="value"
          seriesField="type"
          smooth
          animation={{
            appear: {
              animation: 'path-in',
              duration: 1000,
            },
          }}
        />
      </Card>
    </div>
  );
};

export default MonitorList; 
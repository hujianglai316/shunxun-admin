import React from 'react';
import { Row, Col, Statistic, Progress, Tooltip } from 'antd';
import type { TypeDistributionData } from '../types';

const mockData: TypeDistributionData[] = [
  {
    type: '房源推广',
    count: 86,
    budget: 156000,
    status: { active: 35, paused: 28, ended: 23 }
  },
  {
    type: '品牌推广',
    count: 42,
    budget: 89000,
    status: { active: 18, paused: 12, ended: 12 }
  },
  {
    type: '活动推广',
    count: 28,
    budget: 45000,
    status: { active: 12, paused: 8, ended: 8 }
  }
];

const TypeDistribution: React.FC = () => {
  const total = mockData.reduce((sum, item) => sum + item.count, 0);
  const totalBudget = mockData.reduce((sum, item) => sum + item.budget, 0);

  const colors = {
    '房源推广': '#1890ff',
    '品牌推广': '#722ed1',
    '活动推广': '#fa8c16'
  };

  return (
    <div className="space-y-6">
      {mockData.map((item) => {
        const percentage = Math.round((item.count / total) * 100);
        const activePercentage = Math.round((item.status.active / item.count) * 100);
        
        return (
          <div key={item.type} className="space-y-2">
            <Row gutter={16} align="middle">
              <Col span={8}>
                <Tooltip title={`${item.type}活动总数`}>
                  <Statistic
                    title={item.type}
                    value={item.count}
                    suffix="个"
                    valueStyle={{ color: colors[item.type] }}
                  />
                </Tooltip>
              </Col>
              <Col span={8}>
                <Tooltip title="占总活动比例">
                  <Progress
                    percent={percentage}
                    strokeColor={colors[item.type]}
                    size="small"
                  />
                </Tooltip>
              </Col>
              <Col span={8}>
                <Tooltip title="活动预算">
                  <Statistic
                    value={item.budget}
                    suffix="元"
                    valueStyle={{ fontSize: '14px' }}
                  />
                </Tooltip>
              </Col>
            </Row>
            
            <Row gutter={16}>
              <Col span={8}>
                <Tooltip title="进行中">
                  <Statistic
                    value={item.status.active}
                    suffix="个"
                    valueStyle={{ fontSize: '14px', color: '#52c41a' }}
                  />
                </Tooltip>
              </Col>
              <Col span={8}>
                <Tooltip title="已暂停">
                  <Statistic
                    value={item.status.paused}
                    suffix="个"
                    valueStyle={{ fontSize: '14px', color: '#faad14' }}
                  />
                </Tooltip>
              </Col>
              <Col span={8}>
                <Tooltip title="已结束">
                  <Statistic
                    value={item.status.ended}
                    suffix="个"
                    valueStyle={{ fontSize: '14px', color: '#ff4d4f' }}
                  />
                </Tooltip>
              </Col>
            </Row>
          </div>
        );
      })}
    </div>
  );
};

export default TypeDistribution; 
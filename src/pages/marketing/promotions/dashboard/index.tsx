import React from 'react';
import { Card } from 'antd';
import StatsOverview from './components/StatsOverview';
import TrendChart from './components/TrendChart';
import TypeDistribution from './components/TypeDistribution';

const PromotionsDashboard: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <Card title="数据概览" bordered={false}>
          <StatsOverview />
        </Card>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <Card title="推广趋势" bordered={false}>
          <TrendChart />
        </Card>
        <Card title="推广类型分布" bordered={false}>
          <TypeDistribution />
        </Card>
      </div>
    </div>
  );
};

export default PromotionsDashboard; 
import React from 'react';
import { Line } from '@ant-design/plots';
import type { TrendData } from '../types';

const mockData: TrendData[] = [
  { date: '2024-01-01', impressions: 3500, clicks: 320, leads: 85, conversions: 12 },
  { date: '2024-01-02', impressions: 3800, clicks: 350, leads: 92, conversions: 15 },
  { date: '2024-01-03', impressions: 3200, clicks: 280, leads: 78, conversions: 10 },
  { date: '2024-01-04', impressions: 4200, clicks: 420, leads: 105, conversions: 18 },
  { date: '2024-01-05', impressions: 4500, clicks: 460, leads: 115, conversions: 22 },
  { date: '2024-01-06', impressions: 4100, clicks: 380, leads: 98, conversions: 16 },
  { date: '2024-01-07', impressions: 3900, clicks: 340, leads: 88, conversions: 14 },
];

const TrendChart: React.FC = () => {
  const transformedData = mockData.reduce((acc: any[], curr) => {
    return acc.concat([
      { date: curr.date, type: '展示量', value: curr.impressions },
      { date: curr.date, type: '点击量', value: curr.clicks },
      { date: curr.date, type: '线索量', value: curr.leads },
      { date: curr.date, type: '转化量', value: curr.conversions },
    ]);
  }, []);

  const config = {
    data: transformedData,
    xField: 'date',
    yField: 'value',
    seriesField: 'type',
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
    legend: {
      position: 'top',
    },
    point: {
      size: 3,
      shape: 'circle',
      style: {
        opacity: 0.8,
      },
    },
    tooltip: {
      showCrosshairs: true,
      shared: true,
    },
  };

  return <Line {...config} height={300} />;
};

export default TrendChart; 
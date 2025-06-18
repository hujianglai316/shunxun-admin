export interface StatsOverviewData {
  totalActivities: number;
  activeActivities: number;
  totalImpressions: number;
  totalLeads: number;
  weekGrowth: {
    activities: number;
    impressions: number;
    leads: number;
  };
}

export interface TrendData {
  date: string;
  impressions: number;
  clicks: number;
  leads: number;
  conversions: number;
}

export interface TypeDistributionData {
  type: '房源推广' | '品牌推广' | '活动推广';
  count: number;
  budget: number;
  status: {
    active: number;
    paused: number;
    ended: number;
  };
} 
// 广告位置类型
export type AdPositionType = '开屏广告' | 'banner广告' | '底部广告' | '商家产品广告';

// 广告状态
export type AdStatus = '待发布' | '投放中' | '已暂停' | '已结束' | '已下线';

// 广告投放时段类型
export interface AdSchedule {
  startTime: string;
  endTime: string;
  daysOfWeek: number[]; // 1-7 代表周一到周日
}

// 广告基础信息
export interface AdBaseInfo {
  id: string;
  title: string;
  position: AdPositionType;
  status: AdStatus;
  startDate: string;
  endDate: string;
  schedule: AdSchedule[];
  priority: number; // 优先级
  targetUrl: string; // 跳转链接
}

// 广告素材信息
export interface AdCreative {
  imageUrl: string;
  size: {
    width: number;
    height: number;
  };
  fileSize: number;
  format: string;
}

// 广告统计数据
export interface AdStats {
  impressions: number; // 展示次数
  clicks: number; // 点击次数
  ctr: number; // 点击率
  conversions: number; // 转化次数
  conversionRate: number; // 转化率
}

// 广告详细信息
export interface AdDetail extends AdBaseInfo {
  creative: AdCreative;
  stats: AdStats;
  createTime: string;
  updateTime: string;
  creator: string;
  remarks: string;
}

// 广告列表项
export interface AdListItem extends AdBaseInfo {
  creative: {
    imageUrl: string;
  };
  stats: {
    impressions: number;
    clicks: number;
  };
}

// 广告筛选条件
export interface AdFilter {
  position?: AdPositionType;
  status?: AdStatus;
  dateRange?: [string, string];
  keyword?: string;
} 
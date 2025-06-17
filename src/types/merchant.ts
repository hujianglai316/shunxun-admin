export enum MerchantType {
  HOTEL = 'hotel',
  APARTMENT = 'apartment',
  HOUSE = 'house',
}

export enum PlatformType {
  HOTEL = 'hotel',
  RENTAL = 'rental',
}

export enum MerchantStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  REJECTED = 'rejected',
}

export enum MerchantAuditStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum ReviewStatus {
  PENDING = 'pending',
  REPLIED = 'replied',
  HIDDEN = 'hidden',
}

export enum RatingType {
  OVERALL = 'overall',
  CLEANLINESS = 'cleanliness',
  SERVICE = 'service',
  LOCATION = 'location',
  FACILITIES = 'facilities',
  VALUE = 'value',
}

export interface MerchantBasicInfo {
  id: number;
  name: string;
  type: MerchantType;
  contact: string;
  phone: string;
  address: string;
  status: MerchantStatus;
  createTime: string;
  updateTime: string;
  platformType: PlatformType;
  city?: string;
  roomCount?: number;
  rating?: number;
  commissionRate?: number;
  totalOrders?: number;
  totalAmount?: number;
}

export interface MerchantAuditRecord {
  id: number;
  merchantName: string;
  type: MerchantType;
  status: MerchantAuditStatus;
  submitTime: string;
  auditTime?: string;
  auditor?: string;
  remark?: string;
}

export interface ReviewRecord {
  id: number;
  userName: string;
  orderNo: string;
  content: string;
  rating: Record<RatingType, number>;
  images?: string[];
  status: ReviewStatus;
  createTime: string;
  merchantReply?: {
    content: string;
    operator: string;
    createTime: string;
  };
}

export interface ReviewStats {
  totalCount: number;
  averageRating: Record<RatingType, number>;
  ratingDistribution: Record<number, number>;
  hasImageCount: number;
  hasReplyCount: number;
  pendingCount: number;
  recentTrend: Array<{
    date: string;
    count: number;
    averageRating: number;
  }>;
}

export enum StatsMetric {
  ORDER_COUNT = 'order_count',
  ORDER_AMOUNT = 'order_amount',
  COMMISSION = 'commission',
  REFUND_COUNT = 'refund_count',
  REFUND_AMOUNT = 'refund_amount',
  NEW_CUSTOMER = 'new_customer',
  REPEAT_CUSTOMER = 'repeat_customer',
  REVIEW_COUNT = 'review_count',
  AVERAGE_RATING = 'average_rating',
}

export interface StatsMetricData {
  value: number;
  change: number;
  trend?: Array<{
    date: string;
    value: number;
  }>;
}

export enum StatsPeriod {
  TODAY = 'today',
  YESTERDAY = 'yesterday',
  WEEK = 'week',
  MONTH = 'month',
  QUARTER = 'quarter',
  YEAR = 'year',
}

export enum RankingType {
  ORDER_COUNT = 'order_count',
  ORDER_AMOUNT = 'order_amount',
  COMMISSION = 'commission',
  RATING = 'rating',
  REVIEW_COUNT = 'review_count',
}

export interface RankingData {
  id: number;
  name: string;
  value: number;
  rank: number;
  change: number;
  type: RankingType;
} 

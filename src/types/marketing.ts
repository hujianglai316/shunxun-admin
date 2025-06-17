// 营销管理模块类型定义

// 优惠券类型
export type CouponType = 
  | 'DISCOUNT'    // 折扣券 (例如：8折)
  | 'CASH'        // 满减券 (例如：满100减20)
  | 'DIRECT'      // 直减券 (例如：立减10元)
  | 'FREE'        // 免费券 (例如：免费住一晚)
  | 'GIFT';       // 赠品券 (例如：赠送早餐)

// 优惠券状态
export type CouponStatus =
  | 'DRAFT'      // 草稿
  | 'PENDING'    // 待发布
  | 'ACTIVE'     // 已发布(进行中)
  | 'PAUSED'     // 已暂停
  | 'EXPIRED'    // 已过期
  | 'FINISHED';  // 已结束(手动)

// 发放方式
export type DistributionType =
  | 'CODE'       // 兑换码
  | 'DIRECT'     // 直接发放
  | 'ACTIVITY'   // 活动奖励
  | 'MANUAL';    // 人工发放

// 使用渠道
export type UseChannel =
  | 'ALL'         // 全部渠道
  | 'APP'         // 仅APP
  | 'MINI'        // 仅小程序
  | 'WEB'         // 仅网页
  | 'OFFLINE';    // 线下渠道

// 使用范围
export type UseScope =
  | 'ALL'         // 全部商品
  | 'CATEGORY'    // 指定分类
  | 'PRODUCT'     // 指定商品
  | 'MERCHANT';   // 指定商家

// 用户领取状态
export type UserCouponStatus =
  | 'UNUSED'      // 未使用
  | 'USED'        // 已使用
  | 'EXPIRED';    // 已过期

// 优惠券规则限制条件
export interface CouponRule {
  minAmount?: number;          // 最低消费金额
  maxDiscount?: number;        // 最高优惠金额
  useTimeStart?: string;       // 使用开始时间
  useTimeEnd?: string;         // 使用结束时间
  userLevel?: string[];        // 可用用户等级
  perLimit: number;            // 每人限领数量
  totalLimit: number;          // 总发放数量
  newUserOnly?: boolean;       // 仅新用户可用
  excludePromotion?: boolean;  // 不可与其他促销同用
  useChannels: UseChannel[];   // 使用渠道
  useScope: UseScope;          // 使用范围
  scopeIds?: string[];         // 范围内ID列表
  weekendOnly?: boolean;       // 仅周末可用
  holidayOnly?: boolean;       // 仅节假日可用
  description?: string;        // 使用说明
}

// 优惠券模版定义
export interface CouponTemplate {
  id: string;
  name: string;                 // 优惠券名称
  type: CouponType;             // 优惠券类型
  value: number;                // 优惠券面值(折扣为0-1之间小数)
  status: CouponStatus;         // 状态
  startTime: string;            // 活动开始时间
  endTime: string;              // 活动结束时间
  validDays: number;            // 领取后有效天数
  distributionType: DistributionType; // 发放方式
  code?: string;                // 兑换码(适用于CODE类型)
  rule: CouponRule;             // 使用规则
  createdAt: string;            // 创建时间
  createdBy: string;            // 创建人
  updatedAt: string;            // 更新时间
  updatedBy: string;            // 更新人
  totalIssued: number;          // 已发放数量
  totalUsed: number;            // 已使用数量
  totalExpired: number;         // 已过期数量
}

// 用户优惠券
export interface UserCoupon {
  id: string;
  userId: string;               // 用户ID
  userName: string;             // 用户名称
  templateId: string;           // 优惠券模板ID
  couponName: string;           // 优惠券名称
  couponType: CouponType;       // 优惠券类型
  couponValue: number;          // 优惠券面值
  status: UserCouponStatus;     // 状态
  obtainTime: string;           // 领取时间
  validStartTime: string;       // 有效期开始
  validEndTime: string;         // 有效期结束
  usedTime?: string;            // 使用时间
  usedOrderId?: string;         // 使用订单号
  distributionType: DistributionType; // 获取方式
  source?: string;              // 来源说明
}

// 优惠券统计数据
export interface CouponStats {
  activeCoupons: number;        // 进行中的优惠券活动
  totalIssued: number;          // 总发放数量
  totalUsed: number;            // 总使用数量
  usageRate: number;            // 使用率
  totalValue: number;           // 优惠总金额
  avgDiscount: number;          // 平均优惠金额
  topCoupons: {                 // 热门优惠券TOP5
    id: string;
    name: string;
    issuedCount: number;
    usedCount: number;
    usageRate: number;
  }[];
}

// 优惠券搜索参数
export interface CouponSearchParams {
  name?: string;                // 优惠券名称
  type?: CouponType;            // 优惠券类型
  status?: CouponStatus;        // 状态
  dateRange?: [string, string]; // 时间范围
  distributionType?: DistributionType; // 发放方式
  page: number;
  pageSize: number;
}

// 用户优惠券搜索参数
export interface UserCouponSearchParams {
  userId?: string;              // 用户ID
  userName?: string;            // 用户名称
  templateId?: string;          // 优惠券模板ID
  status?: UserCouponStatus;    // 状态
  dateRange?: [string, string]; // 时间范围
  page: number;
  pageSize: number;
} 
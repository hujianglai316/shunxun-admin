// 交易类型
export type TransactionType = 
  | 'ORDER_INCOME'    // 订单收入
  | 'WITHDRAWAL'      // 提现
  | 'REFUND'          // 退款
  | 'COMMISSION'      // 平台佣金
  | 'ADJUSTMENT'      // 手动调整
  | 'PLATFORM_FEE'    // 平台服务费
  | 'TAX';            // 税费

// 交易状态
export type TransactionStatus = 
  | 'PENDING'      // 待处理
  | 'PROCESSING'   // 处理中
  | 'COMPLETED'    // 已完成
  | 'FAILED'       // 失败
  | 'CANCELLED';   // 已取消

// 结算周期
export type SettlementCycle = 'DAILY' | 'WEEKLY' | 'MONTHLY';

// 发票状态
export type InvoiceStatus = 
  | 'PENDING'    // 待开票
  | 'PROCESSING' // 开票中
  | 'COMPLETED'  // 已开票
  | 'REJECTED';  // 已拒绝

// 发票类型
export type InvoiceType = 
  | 'PERSONAL'  // 个人发票
  | 'COMPANY';  // 企业发票

// 银行账户信息
export interface BankAccount {
  id: string;
  accountName: string;     // 开户名
  accountNumber: string;   // 银行账号
  bankName: string;        // 开户行
  bankBranch: string;      // 开户支行
  province: string;        // 省份
  city: string;            // 城市
  isVerified: boolean;     // 是否已验证
}

// 商家账户信息
export interface MerchantAccount {
  merchantId: string;
  balance: number;            // 可用余额
  frozenAmount: number;       // 冻结金额
  totalIncome: number;        // 总收入
  totalWithdrawal: number;    // 总提现
  commissionRate: number;     // 佣金比例(0-1)
  settlementCycle: SettlementCycle;
  minWithdrawalAmount: number; // 最小提现金额
  bankAccount: BankAccount;
}

// 财务统计信息
export interface FinanceStatistics {
  todayIncome: number;         // 今日收入
  monthIncome: number;         // 本月收入
  pendingSettlement: number;   // 待结算金额
  lastSettlementAmount: number; // 上次结算金额
  totalRevenue: number;        // 总收入
  totalCommission: number;     // 总佣金
  orderCount: number;          // 订单数量
}

// 交易记录
export interface Transaction {
  id: string;
  merchantId?: string;
  merchantName?: string;
  type: TransactionType;
  amount: number;           // 交易金额
  balance: number;          // 交易后余额
  orderId: string;          // 关联订单号
  status: TransactionStatus;
  description: string;      // 交易描述
  operatorId: string;       // 操作人ID
  operatorName: string;     // 操作人姓名
  createdAt: string;        // 创建时间
  updatedAt: string;        // 更新时间
}

// 结算记录
export interface Settlement {
  id: string;
  merchantId: string;
  merchantName: string;
  amount: number;           // 结算金额
  commissionAmount: number; // 佣金金额
  orderCount: number;       // 结算订单数
  cycle: SettlementCycle;   // 结算周期
  periodStart: string;      // 结算周期开始
  periodEnd: string;        // 结算周期结束
  status: TransactionStatus;
  bankAccount: Partial<BankAccount>;
  createdAt: string;
  completedAt?: string;
  operatorId?: string;
  operatorName?: string;
  remark?: string;
}

// 发票信息
export interface Invoice {
  id: string;
  merchantId?: string;
  merchantName?: string;
  userId?: string;
  userName?: string;
  orderIds: string[];       // 关联订单ID列表
  type: InvoiceType;        // 发票类型
  title: string;            // 发票抬头
  taxNumber?: string;       // 税号
  amount: number;           // 发票金额
  content: string;          // 发票内容
  email: string;            // 接收邮箱
  status: InvoiceStatus;    // 发票状态
  rejectionReason?: string; // 拒绝原因
  invoiceNumber?: string;   // 发票号码
  invoiceUrl?: string;      // 电子发票链接
  createdAt: string;        // 申请时间
  updatedAt: string;        // 更新时间
  completedAt?: string;     // 完成时间
  operatorId?: string;      // 处理人ID
  operatorName?: string;    // 处理人姓名
}

// 收入来源明细
export interface RevenueSource {
  source: string;           // 收入来源
  amount: number;           // 金额
  percentage: number;       // 占比(0-1)
  orderCount: number;       // 订单数
  trend: number;            // 环比趋势(百分比)
}

// 收入统计
export interface RevenueStats {
  totalRevenue: number;            // 总收入
  totalCommission: number;         // 总佣金
  netRevenue: number;              // 净收入
  comparedToLastPeriod: number;    // 环比(百分比)
  revenueSources: RevenueSource[]; // 收入来源明细
  timeDistribution: {              // 时间分布
    date: string;
    revenue: number;
    commission: number;
  }[];
  businessTypeDistribution: {      // 业务类型分布
    type: string;
    revenue: number;
    percentage: number;
  }[];
}

// 财务搜索参数
export interface FinanceSearchParams {
  type?: TransactionType;
  status?: TransactionStatus;
  dateRange?: [string, string];
  orderId?: string;
  merchantId?: string;
  userId?: string;
  page: number;
  pageSize: number;
} 
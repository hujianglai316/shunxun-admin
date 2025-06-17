import { MerchantBasicInfo, MerchantType, MerchantStatus } from '../types/merchant';

// 平台类型枚举
export enum PlatformType {
  HOTEL = 'hotel',
  RENTAL = 'rental',
}

// 商家模拟数据
export const mockMerchants: MerchantBasicInfo[] = [
  {
    id: 1,
    name: '北京国际酒店',
    type: MerchantType.HOTEL,
    contact: '张经理',
    phone: '13800138001',
    address: '北京市朝阳区建国门外大街1号',
    status: MerchantStatus.ACTIVE,
    createTime: '2023-10-15 10:00:00',
    updateTime: '2023-10-15 10:00:00',
    platformType: PlatformType.HOTEL,
    city: '北京市',
    roomCount: 120,
    rating: 4.8,
    commissionRate: 0.1,
    totalOrders: 356,
    totalAmount: 458900,
  },
  {
    id: 2,
    name: '上海浦东丽思卡尔顿酒店',
    type: MerchantType.HOTEL,
    contact: '李总监',
    phone: '13900139002',
    address: '上海市浦东新区陆家嘴世纪大道8号',
    status: MerchantStatus.ACTIVE,
    createTime: '2023-09-20 14:30:00',
    updateTime: '2023-09-20 14:30:00',
    platformType: PlatformType.HOTEL,
    city: '上海市',
    roomCount: 285,
    rating: 4.9,
    commissionRate: 0.12,
    totalOrders: 489,
    totalAmount: 876500,
  },
  {
    id: 3,
    name: '广州白云万怡酒店',
    type: MerchantType.HOTEL,
    contact: '王经理',
    phone: '13600136003',
    address: '广州市白云区白云大道北1号',
    status: MerchantStatus.ACTIVE,
    createTime: '2023-11-05 09:15:00',
    updateTime: '2023-11-05 09:15:00',
    platformType: PlatformType.HOTEL,
    city: '广州市',
    roomCount: 176,
    rating: 4.6,
    commissionRate: 0.09,
    totalOrders: 278,
    totalAmount: 356800,
  },
  {
    id: 4,
    name: '深圳湾公寓',
    type: MerchantType.APARTMENT,
    contact: '刘总',
    phone: '13700137004',
    address: '深圳市南山区后海大道2088号',
    status: MerchantStatus.INACTIVE,
    createTime: '2023-08-12 11:20:00',
    updateTime: '2023-08-12 11:20:00',
    platformType: PlatformType.RENTAL,
    city: '深圳市',
    roomCount: 68,
    rating: 4.5,
    commissionRate: 0.08,
    totalOrders: 156,
    totalAmount: 289600,
  },
  {
    id: 5,
    name: '杭州西湖民宿',
    type: MerchantType.HOUSE,
    contact: '陈老板',
    phone: '13500135005',
    address: '杭州市西湖区龙井路18号',
    status: MerchantStatus.PENDING,
    createTime: '2023-12-01 16:45:00',
    updateTime: '2023-12-01 16:45:00',
    platformType: PlatformType.HOTEL,
    city: '杭州市',
    roomCount: 12,
    rating: 4.7,
    commissionRate: 0.1,
    totalOrders: 98,
    totalAmount: 146800,
  },
  {
    id: 6,
    name: '成都锦江公寓',
    type: MerchantType.APARTMENT,
    contact: '赵经理',
    phone: '13400134006',
    address: '成都市锦江区人民南路二段80号',
    status: MerchantStatus.ACTIVE,
    createTime: '2023-10-10 10:10:00',
    updateTime: '2023-10-10 10:10:00',
    platformType: PlatformType.RENTAL,
    city: '成都市',
    roomCount: 45,
    rating: 4.4,
    commissionRate: 0.09,
    totalOrders: 132,
    totalAmount: 198600,
  },
  {
    id: 7,
    name: '重庆解放碑智选假日酒店',
    type: MerchantType.HOTEL,
    contact: '钱总',
    phone: '13300133007',
    address: '重庆市渝中区民权路28号',
    status: MerchantStatus.ACTIVE,
    createTime: '2023-11-15 08:30:00',
    updateTime: '2023-11-15 08:30:00',
    platformType: PlatformType.HOTEL,
    city: '重庆市',
    roomCount: 98,
    rating: 4.5,
    commissionRate: 0.1,
    totalOrders: 245,
    totalAmount: 312500,
  },
  {
    id: 8,
    name: '厦门鼓浪屿海景民宿',
    type: MerchantType.HOUSE,
    contact: '孙老板',
    phone: '13200132008',
    address: '厦门市思明区鼓浪屿龙头路10号',
    status: MerchantStatus.REJECTED,
    createTime: '2023-07-28 14:20:00',
    updateTime: '2023-07-28 14:20:00',
    platformType: PlatformType.HOTEL,
    city: '厦门市',
    roomCount: 8,
    rating: 4.6,
    commissionRate: 0.08,
    totalOrders: 76,
    totalAmount: 128400,
  }
];

// 商家详情模拟数据
export const getMerchantDetail = (id: number) => {
  const basicInfo = mockMerchants.find(item => item.id === id);
  if (!basicInfo) return null;
  
  return {
    ...basicInfo,
    businessLicense: 'BL12345678',
    legalPerson: basicInfo.contact,
    openingTime: '2020-01-01',
    description: `${basicInfo.name}是一家高品质的${
      basicInfo.type === MerchantType.HOTEL ? '酒店' : 
      basicInfo.type === MerchantType.APARTMENT ? '公寓' : '民宿'
    }，位于${basicInfo.city}市中心地带，交通便利，环境优美。`,
    facilities: ['wifi', 'parking', 'restaurant', 'gym', 'swimming'],
    bankAccount: {
      accountName: `${basicInfo.name}有限公司`,
      bankName: '中国建设银行',
      accountNumber: '6222********1234',
    },
    settleInfo: {
      settleType: 'monthly',
      settleDay: 10,
      commissionRate: basicInfo.commissionRate || 0.1,
      lastSettleTime: '2023-12-10',
      lastSettleAmount: 12580,
    },
    contracts: [
      {
        id: 1,
        name: '平台合作协议',
        signTime: '2023-01-01',
        expireTime: '2025-12-31',
        status: 'active',
      }
    ],
    businessHours: '00:00-24:00',
    checkInTime: '14:00',
    checkOutTime: '12:00',
  };
};

// 商家审核记录模拟数据
export const mockAuditRecords = [
  {
    id: 1,
    merchantId: 1,
    merchantName: '北京国际酒店',
    type: 'register',
    status: 'approved',
    submitTime: '2023-10-10 10:00:00',
    auditTime: '2023-10-11 09:30:00',
    auditor: 'admin',
    remark: '资料齐全，符合要求',
  },
  {
    id: 2,
    merchantId: 2,
    merchantName: '上海浦东丽思卡尔顿酒店',
    type: 'register',
    status: 'approved',
    submitTime: '2023-09-15 14:00:00',
    auditTime: '2023-09-16 10:20:00',
    auditor: 'admin',
    remark: '资料齐全，符合要求',
  },
  {
    id: 3,
    merchantId: 5,
    merchantName: '杭州西湖民宿',
    type: 'register',
    status: 'pending',
    submitTime: '2023-12-01 16:45:00',
    auditTime: null,
    auditor: null,
    remark: null,
  },
  {
    id: 4,
    merchantId: 8,
    merchantName: '厦门鼓浪屿海景民宿',
    type: 'register',
    status: 'rejected',
    submitTime: '2023-07-25 14:20:00',
    auditTime: '2023-07-28 09:10:00',
    auditor: 'admin',
    remark: '营业执照信息不清晰，请重新上传',
  },
];

// 商家财务数据模拟
export const mockFinanceData = [
  {
    id: 1,
    merchantId: 1,
    merchantName: '北京国际酒店',
    totalIncome: 458900,
    totalCommission: 45890,
    availableBalance: 412300,
    frozenBalance: 710,
    settledAmount: 389600,
    unsettledAmount: 22700,
    totalOrders: 356,
    transactions: [
      {
        id: 101,
        type: 'income',
        amount: 1288,
        orderNo: 'O202403150001',
        createTime: '2024-03-15 10:30:00',
        status: 'success',
        remark: '订单收入',
      },
      {
        id: 102,
        type: 'commission',
        amount: -128.8,
        orderNo: 'O202403150001',
        createTime: '2024-03-15 10:30:00',
        status: 'success',
        remark: '平台佣金',
      },
      {
        id: 103,
        type: 'withdraw',
        amount: -10000,
        orderNo: null,
        createTime: '2024-03-10 14:20:00',
        status: 'success',
        remark: '商家提现',
      }
    ],
    withdrawRecords: [
      {
        id: 1001,
        amount: 10000,
        applyTime: '2024-03-10 14:00:00',
        auditTime: '2024-03-10 14:15:00',
        completeTime: '2024-03-10 14:20:00',
        status: 'success',
        bankInfo: '中国建设银行(1234)',
        auditor: 'admin',
        remark: null,
      }
    ],
    settlementRecords: [
      {
        id: 2001,
        period: '2024-02',
        amount: 38500,
        orderCount: 32,
        commissionAmount: 3850,
        settleTime: '2024-03-10 00:00:00',
        status: 'completed',
        remark: null,
      }
    ]
  }
];

// 商家评价数据模拟
export const mockReviews = [
  {
    id: 1,
    merchantId: 1,
    merchantName: '北京国际酒店',
    orderId: 10001,
    orderNo: 'O202403100001',
    userId: 1001,
    userName: '张先生',
    roomType: '豪华大床房',
    content: '酒店位置很好，就在市中心，出行非常方便。房间干净整洁，设施齐全，服务也很周到。',
    rating: {
      overall: 4.8,
      cleanliness: 5.0,
      service: 4.5,
      location: 5.0,
      facilities: 4.5,
      value: 4.5
    },
    images: [
      'https://example.com/review/img1.jpg',
      'https://example.com/review/img2.jpg'
    ],
    createTime: '2024-03-12 10:20:00',
    status: 'replied',
    merchantReply: {
      content: '感谢您的入住和评价，期待您的再次光临！',
      operator: '店长',
      createTime: '2024-03-12 14:30:00'
    }
  },
  {
    id: 2,
    merchantId: 1,
    merchantName: '北京国际酒店',
    orderId: 10002,
    orderNo: 'O202403080005',
    userId: 1002,
    userName: '李女士',
    roomType: '行政套房',
    content: '这次入住体验非常好，房间宽敞明亮，床很舒适，睡得很好。早餐品种丰富，味道也不错。',
    rating: {
      overall: 4.9,
      cleanliness: 5.0,
      service: 5.0,
      location: 4.5,
      facilities: 5.0,
      value: 4.5
    },
    images: [],
    createTime: '2024-03-10 09:15:00',
    status: 'pending',
    merchantReply: null
  }
];

// 商家统计数据模拟
export const mockMerchantStats = {
  overview: {
    totalOrders: 356,
    totalAmount: 458900,
    totalCommission: 45890,
    averageOrderValue: 1289,
    orderCompletionRate: 0.97,
    occupancyRate: 0.86
  },
  trends: {
    orders: [
      { date: '2024-03-01', count: 12, amount: 15456 },
      { date: '2024-03-02', count: 15, amount: 19350 },
      { date: '2024-03-03', count: 10, amount: 12890 },
      { date: '2024-03-04', count: 14, amount: 18046 },
      { date: '2024-03-05', count: 16, amount: 20624 },
      { date: '2024-03-06', count: 18, amount: 23202 },
      { date: '2024-03-07', count: 20, amount: 25780 },
    ],
    ratings: [
      { date: '2024-03-01', rating: 4.7, count: 5 },
      { date: '2024-03-02', rating: 4.8, count: 6 },
      { date: '2024-03-03', rating: 4.9, count: 4 },
      { date: '2024-03-04', rating: 4.7, count: 5 },
      { date: '2024-03-05', rating: 4.8, count: 7 },
      { date: '2024-03-06', rating: 4.6, count: 8 },
      { date: '2024-03-07', rating: 4.7, count: 9 },
    ]
  },
  roomStats: [
    { type: '豪华大床房', count: 20, booked: 18, rate: 0.9, amount: 152800 },
    { type: '豪华双床房', count: 25, booked: 22, rate: 0.88, amount: 169400 },
    { type: '行政套房', count: 10, booked: 8, rate: 0.8, amount: 82560 },
    { type: '总统套房', count: 2, booked: 1, rate: 0.5, amount: 28600 }
  ],
  customerStats: {
    newCustomers: 128,
    repeatCustomers: 228,
    repeatRate: 0.64,
    ageDistribution: [
      { range: '18-24', count: 35, percent: 0.1 },
      { range: '25-34', count: 142, percent: 0.4 },
      { range: '35-44', count: 107, percent: 0.3 },
      { range: '45-54', count: 53, percent: 0.15 },
      { range: '55+', count: 18, percent: 0.05 }
    ],
    sourceDistribution: [
      { source: '直接访问', count: 89, percent: 0.25 },
      { source: '搜索引擎', count: 128, percent: 0.36 },
      { source: '社交媒体', count: 71, percent: 0.2 },
      { source: '广告推广', count: 46, percent: 0.13 },
      { source: '其他', count: 21, percent: 0.06 }
    ]
  }
}; 
export enum UserType {
  ADMIN = 'admin',       // 平台管理员
  MERCHANT = 'merchant', // 商家用户
  CUSTOMER = 'customer', // 客户
}

export enum UserStatus {
  ACTIVE = 'active',       // 正常
  INACTIVE = 'inactive',   // 已禁用
  PENDING = 'pending',     // 待审核
}

export enum MerchantUserRole {
  OWNER = 'owner',         // 店主/业主
  MANAGER = 'manager',     // 经理
  OPERATOR = 'operator',   // 运营
  FINANCE = 'finance',     // 财务
  CUSTOMER_SERVICE = 'cs', // 客服
}

export enum AdminUserRole {
  SUPER_ADMIN = 'super_admin',    // 超级管理员
  ADMIN = 'admin',                // 管理员
  AUDITOR = 'auditor',            // 审核员
  FINANCE = 'finance',            // 财务
  OPERATION = 'operation',        // 运营
  CUSTOMER_SERVICE = 'cs',        // 客服
  VIEWER = 'viewer',              // 只读用户
}

export enum PlatformType {
  HOTEL = 'hotel',   // 酒店平台
  RENTAL = 'rental', // 租房平台
}

// 权限定义
export enum Permission {
  // 商家管理权限
  MERCHANT_VIEW = 'merchant:view',
  MERCHANT_ADD = 'merchant:add',
  MERCHANT_EDIT = 'merchant:edit',
  MERCHANT_DELETE = 'merchant:delete',
  MERCHANT_AUDIT = 'merchant:audit',
  
  // 用户管理权限
  USER_VIEW = 'user:view',
  USER_ADD = 'user:add',
  USER_EDIT = 'user:edit',
  USER_DELETE = 'user:delete',
  
  // 订单管理权限
  ORDER_VIEW = 'order:view',
  ORDER_PROCESS = 'order:process',
  ORDER_REFUND = 'order:refund',
  
  // 财务管理权限
  FINANCE_VIEW = 'finance:view',
  FINANCE_SETTLEMENT = 'finance:settlement',
  FINANCE_INVOICE = 'finance:invoice',
  FINANCE_WITHDRAW = 'finance:withdraw',
  
  // 内容管理权限
  CONTENT_VIEW = 'content:view',
  CONTENT_ADD = 'content:add',
  CONTENT_EDIT = 'content:edit',
  CONTENT_DELETE = 'content:delete',
  CONTENT_AUDIT = 'content:audit',
  
  // 系统管理权限
  SYSTEM_ACCOUNT = 'system:account',
  SYSTEM_ROLE = 'system:role',
  SYSTEM_CONFIG = 'system:config',
  SYSTEM_LOG = 'system:log',
}

// 基本用户信息
export interface UserBasicInfo {
  id: string;
  username: string;
  nickname?: string;
  avatar?: string;
  phone: string;
  email?: string;
  status: UserStatus;
  userType: UserType;
  createTime: string;
  lastLoginTime?: string;
}

// 管理员用户
export interface AdminUser extends UserBasicInfo {
  role: AdminUserRole;
  permissions: Permission[];
  department?: string;
  position?: string;
}

// 商家用户
export interface MerchantUser extends UserBasicInfo {
  merchantId: string;
  merchantName: string;
  role: MerchantUserRole;
  platformType: PlatformType;
}

// 角色定义
export interface Role {
  id: string;
  name: string;
  code: string;
  description?: string;
  permissions: Permission[];
  dataScope?: DataScope;
  isDefault?: boolean;
  createTime: string;
  updateTime: string;
}

// 数据权限范围
export enum DataScopeType {
  ALL = 'all',                     // 全部数据
  DEPARTMENT = 'department',       // 部门数据
  DEPARTMENT_AND_BELOW = 'department_and_below', // 部门及以下数据
  PERSONAL = 'personal',           // 个人数据
  CUSTOM = 'custom',               // 自定义数据
}

// 数据权限
export interface DataScope {
  type: DataScopeType;
  departments?: string[]; // 适用于自定义数据范围
} 
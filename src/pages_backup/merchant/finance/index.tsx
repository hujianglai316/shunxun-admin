import React, { useState, useEffect } from 'react';
import { Card, Button, Space, message } from 'antd';
import AccountDetail from './components/AccountDetail';
import WithdrawalForm from './components/WithdrawalForm';
import BankAccountForm from './components/BankAccountForm';
import SettlementForm from './components/SettlementForm';
import TransactionList from './components/TransactionList';
import { TransactionType, TransactionStatus } from '../../../types/finance';
import type {
  MerchantAccount,
  Transaction,
  FinanceStatistics,
  FinanceSearchParams,
  BankAccount,
  SettlementCycle,
} from '../../../types/finance';

// 模拟数据
const mockAccount: MerchantAccount = {
  id: 1,
  merchantId: 1001,
  balance: 10000.00,
  frozenAmount: 2000.00,
  totalIncome: 50000.00,
  totalWithdrawal: 40000.00,
  commissionRate: 0.05,
  minWithdrawalAmount: 100,
  settlementCycle: 'WEEKLY' as SettlementCycle,
  bankAccount: {
    id: 1,
    accountName: '张三',
    bankName: '工商银行',
    bankBranch: '北京市朝阳支行',
    accountNumber: '6222021234567890123',
    province: '北京市',
    city: '北京市',
  },
  createdAt: '2024-01-01 00:00:00',
  updatedAt: '2024-03-15 10:00:00',
};

const mockStatistics: FinanceStatistics = {
  todayIncome: 1500.00,
  monthIncome: 15000.00,
  totalIncome: 50000.00,
  pendingSettlement: 3000.00,
  lastSettlementAmount: 5000.00,
  lastSettlementDate: '2024-03-14',
};

const mockTransactions: Transaction[] = [
  {
    id: 1,
    merchantId: 1001,
    type: TransactionType.ORDER_INCOME,
    status: TransactionStatus.COMPLETED,
    amount: 688.00,
    balance: 10000.00,
    orderId: 'SX20240315001',
    description: '订单收入',
    createdAt: '2024-03-15 10:00:00',
    updatedAt: '2024-03-15 10:00:00',
  },
  {
    id: 2,
    merchantId: 1001,
    type: TransactionType.WITHDRAWAL,
    status: TransactionStatus.PROCESSING,
    amount: -2000.00,
    balance: 8000.00,
    description: '提现申请',
    operatorId: 1,
    operatorName: '张三',
    createdAt: '2024-03-15 11:00:00',
    updatedAt: '2024-03-15 11:00:00',
  },
  // 更多交易记录...
];

const MerchantFinance: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [withdrawalVisible, setWithdrawalVisible] = useState(false);
  const [bankAccountVisible, setBankAccountVisible] = useState(false);
  const [settlementVisible, setSettlementVisible] = useState(false);
  const [account, setAccount] = useState<MerchantAccount>(mockAccount);
  const [statistics, setStatistics] = useState<FinanceStatistics>(mockStatistics);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [total, setTotal] = useState(100);

  // 模拟加载数据
  useEffect(() => {
    // 实际项目中这里会调用API获取数据
  }, []);

  // 处理提现申请
  const handleWithdrawal = async (values: { amount: number; remark?: string }) => {
    try {
      setLoading(true);
      // 实际项目中这里会调用API
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success('提现申请提交成功');
      setWithdrawalVisible(false);
      // 刷新数据
    } catch (error) {
      message.error('提现申请失败');
    } finally {
      setLoading(false);
    }
  };

  // 处理银行账户信息更新
  const handleBankAccountUpdate = async (values: BankAccount) => {
    try {
      setLoading(true);
      // 实际项目中这里会调用API
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success('银行账户信息更新成功');
      setBankAccountVisible(false);
      // 刷新数据
    } catch (error) {
      message.error('银行账户信息更新失败');
    } finally {
      setLoading(false);
    }
  };

  // 处理结算设置更新
  const handleSettlementUpdate = async (values: {
    settlementCycle: SettlementCycle;
    commissionRate: number;
    minWithdrawalAmount: number;
  }) => {
    try {
      setLoading(true);
      // 实际项目中这里会调用API
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success('结算设置更新成功');
      setSettlementVisible(false);
      // 刷新数据
    } catch (error) {
      message.error('结算设置更新失败');
    } finally {
      setLoading(false);
    }
  };

  // 处理交易记录搜索
  const handleTransactionSearch = (params: FinanceSearchParams) => {
    setLoading(true);
    // 实际项目中这里会调用API
    setTimeout(() => {
      setLoading(false);
      // 更新数据
    }, 1000);
  };

  return (
    <div className="merchant-finance">
      <Card
        title="账户概览"
        extra={
          <Space>
            <Button type="primary" onClick={() => setWithdrawalVisible(true)}>
              申请提现
            </Button>
            <Button onClick={() => setBankAccountVisible(true)}>
              修改收款账户
            </Button>
            <Button onClick={() => setSettlementVisible(true)}>
              结算设置
            </Button>
          </Space>
        }
      >
        <AccountDetail
          account={account}
          statistics={statistics}
          loading={loading}
        />
      </Card>

      <Card title="交易记录" style={{ marginTop: 16 }}>
        <TransactionList
          data={transactions}
          loading={loading}
          total={total}
          pagination={pagination}
          onSearch={handleTransactionSearch}
        />
      </Card>

      <WithdrawalForm
        visible={withdrawalVisible}
        onCancel={() => setWithdrawalVisible(false)}
        onSubmit={handleWithdrawal}
        account={account}
        loading={loading}
      />

      <BankAccountForm
        visible={bankAccountVisible}
        onCancel={() => setBankAccountVisible(false)}
        onSubmit={handleBankAccountUpdate}
        initialValues={account.bankAccount}
        loading={loading}
      />

      <SettlementForm
        visible={settlementVisible}
        onCancel={() => setSettlementVisible(false)}
        onSubmit={handleSettlementUpdate}
        account={account}
        loading={loading}
      />
    </div>
  );
};

export default MerchantFinance; 
import React from 'react';
import { Card, Row, Col, Statistic, Descriptions, Tag } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import type { MerchantAccount, FinanceStatistics } from '../../../../types/finance';

interface AccountDetailProps {
  account: MerchantAccount;
  statistics: FinanceStatistics;
  loading?: boolean;
}

const AccountDetail: React.FC<AccountDetailProps> = ({ account, statistics, loading }) => {
  const { bankAccount } = account;

  return (
    <div className="account-detail">
      <Row gutter={16}>
        <Col span={8}>
          <Card loading={loading}>
            <Statistic
              title="账户余额"
              value={account.balance}
              precision={2}
              prefix="¥"
              valueStyle={{ color: '#1890ff' }}
            />
            <div style={{ marginTop: 8 }}>
              <span style={{ marginRight: 16 }}>
                冻结金额：¥{account.frozenAmount.toFixed(2)}
              </span>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card loading={loading}>
            <Statistic
              title="今日收入"
              value={statistics.todayIncome}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              prefix={<><ArrowUpOutlined /> ¥</>}
            />
            <div style={{ marginTop: 8 }}>
              本月收入：¥{statistics.monthIncome.toFixed(2)}
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card loading={loading}>
            <Statistic
              title="待结算金额"
              value={statistics.pendingSettlement}
              precision={2}
              valueStyle={{ color: '#cf1322' }}
              prefix={<><ArrowDownOutlined /> ¥</>}
            />
            <div style={{ marginTop: 8 }}>
              上次结算：¥{statistics.lastSettlementAmount.toFixed(2)}
            </div>
          </Card>
        </Col>
      </Row>

      <Card title="账户信息" style={{ marginTop: 16 }} loading={loading}>
        <Descriptions bordered column={2}>
          <Descriptions.Item label="商家ID">{account.merchantId}</Descriptions.Item>
          <Descriptions.Item label="佣金比例">
            {(account.commissionRate * 100).toFixed(1)}%
          </Descriptions.Item>
          <Descriptions.Item label="最小提现金额">
            ¥{account.minWithdrawalAmount}
          </Descriptions.Item>
          <Descriptions.Item label="结算周期">
            {account.settlementCycle === 'DAILY' && <Tag color="green">日结</Tag>}
            {account.settlementCycle === 'WEEKLY' && <Tag color="blue">周结</Tag>}
            {account.settlementCycle === 'MONTHLY' && <Tag color="purple">月结</Tag>}
          </Descriptions.Item>
          <Descriptions.Item label="累计收入">
            ¥{account.totalIncome.toFixed(2)}
          </Descriptions.Item>
          <Descriptions.Item label="累计提现">
            ¥{account.totalWithdrawal.toFixed(2)}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="收款账户" style={{ marginTop: 16 }} loading={loading}>
        <Descriptions bordered column={2}>
          <Descriptions.Item label="开户名">{bankAccount.accountName}</Descriptions.Item>
          <Descriptions.Item label="开户行">{bankAccount.bankName}</Descriptions.Item>
          <Descriptions.Item label="开户支行">{bankAccount.bankBranch}</Descriptions.Item>
          <Descriptions.Item label="银行账号">
            {bankAccount.accountNumber.replace(/(\d{4})(?=\d)/g, '$1 ')}
          </Descriptions.Item>
          <Descriptions.Item label="开户地区">
            {bankAccount.province} {bankAccount.city}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default AccountDetail; 
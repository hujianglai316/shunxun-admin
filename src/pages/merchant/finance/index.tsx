import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Tabs, 
  Row, 
  Col, 
  Statistic, 
  Button, 
  Form, 
  DatePicker, 
  Select,
  Input,
  Space,
  Modal,
  Descriptions,
  Tag
} from 'antd';
import { 
  DollarOutlined, 
  ArrowUpOutlined, 
  ArrowDownOutlined,
  SearchOutlined,
  ExportOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import { mockFinanceData } from '@/mock/merchant';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Option } = Select;

const MerchantFinance: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [financeData, setFinanceData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [transactionDetailVisible, setTransactionDetailVisible] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<any>(null);

  useEffect(() => {
    setLoading(true);
    // 模拟API请求
    setTimeout(() => {
      setFinanceData(mockFinanceData);
      setLoading(false);
    }, 500);
  }, []);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  const handleViewTransaction = (record: any) => {
    setCurrentTransaction(record);
    setTransactionDetailVisible(true);
  };

  const handleExport = () => {
    console.log('导出数据');
  };

  // 收入支出总览
  const renderOverview = () => {
    if (financeData.length === 0) return <div>暂无数据</div>;

    const totalIncome = financeData.reduce((sum, item) => sum + item.totalIncome, 0);
    const totalCommission = financeData.reduce((sum, item) => sum + item.totalCommission, 0);
    const totalProfit = totalIncome - totalCommission;
    const totalOrders = financeData.reduce((sum, item) => sum + item.totalOrders, 0);

    return (
      <>
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="总收入"
                value={totalIncome}
                precision={2}
                valueStyle={{ color: '#3f8600' }}
                prefix={<DollarOutlined />}
                suffix="元"
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="总佣金"
                value={totalCommission}
                precision={2}
                valueStyle={{ color: '#cf1322' }}
                prefix={<DollarOutlined />}
                suffix="元"
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="净利润"
                value={totalProfit}
                precision={2}
                valueStyle={{ color: '#3f8600' }}
                prefix={<DollarOutlined />}
                suffix="元"
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="总订单数"
                value={totalOrders}
                valueStyle={{ color: '#1890ff' }}
                suffix="单"
              />
            </Card>
          </Col>
        </Row>

        <Card title="商家财务概览" extra={<Button icon={<ExportOutlined />} onClick={handleExport}>导出</Button>}>
          <Table
            rowKey="id"
            dataSource={financeData}
            loading={loading}
            pagination={false}
            columns={[
              {
                title: '商家名称',
                dataIndex: 'merchantName',
                key: 'merchantName',
              },
              {
                title: '总收入',
                dataIndex: 'totalIncome',
                key: 'totalIncome',
                sorter: (a, b) => a.totalIncome - b.totalIncome,
                render: (val) => `¥${val.toLocaleString()}`,
              },
              {
                title: '总佣金',
                dataIndex: 'totalCommission',
                key: 'totalCommission',
                sorter: (a, b) => a.totalCommission - b.totalCommission,
                render: (val) => `¥${val.toLocaleString()}`,
              },
              {
                title: '可用余额',
                dataIndex: 'availableBalance',
                key: 'availableBalance',
                sorter: (a, b) => a.availableBalance - b.availableBalance,
                render: (val) => `¥${val.toLocaleString()}`,
              },
              {
                title: '冻结余额',
                dataIndex: 'frozenBalance',
                key: 'frozenBalance',
                render: (val) => `¥${val.toLocaleString()}`,
              },
              {
                title: '已结算金额',
                dataIndex: 'settledAmount',
                key: 'settledAmount',
                render: (val) => `¥${val.toLocaleString()}`,
              },
              {
                title: '未结算金额',
                dataIndex: 'unsettledAmount',
                key: 'unsettledAmount',
                render: (val) => `¥${val.toLocaleString()}`,
              },
              {
                title: '总订单数',
                dataIndex: 'totalOrders',
                key: 'totalOrders',
                sorter: (a, b) => a.totalOrders - b.totalOrders,
              },
            ]}
          />
        </Card>
      </>
    );
  };

  // 交易记录
  const renderTransactions = () => {
    if (financeData.length === 0) return <div>暂无数据</div>;
    
    // 合并所有商家的交易记录
    const allTransactions = financeData.reduce((transactions, merchant) => {
      const merchantTransactions = merchant.transactions.map(transaction => ({
        ...transaction,
        merchantName: merchant.merchantName,
        merchantId: merchant.merchantId,
      }));
      return [...transactions, ...merchantTransactions];
    }, []);

    return (
      <>
        <Card>
          <Form layout="inline" style={{ marginBottom: 16 }}>
            <Form.Item label="商家名称">
              <Select style={{ width: 160 }} placeholder="选择商家" allowClear>
                {financeData.map(merchant => (
                  <Option key={merchant.merchantId} value={merchant.merchantId}>
                    {merchant.merchantName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="交易类型">
              <Select style={{ width: 120 }} placeholder="选择类型" allowClear>
                <Option value="income">收入</Option>
                <Option value="commission">佣金</Option>
                <Option value="withdraw">提现</Option>
              </Select>
            </Form.Item>
            <Form.Item label="交易时间">
              <RangePicker />
            </Form.Item>
            <Form.Item>
              <Button type="primary" icon={<SearchOutlined />}>
                搜索
              </Button>
            </Form.Item>
            <Form.Item>
              <Button icon={<ExportOutlined />} onClick={handleExport}>
                导出
              </Button>
            </Form.Item>
          </Form>

          <Table
            rowKey="id"
            dataSource={allTransactions}
            loading={loading}
            pagination={{
              defaultPageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条记录`,
            }}
            columns={[
              {
                title: '交易编号',
                dataIndex: 'id',
                key: 'id',
              },
              {
                title: '商家名称',
                dataIndex: 'merchantName',
                key: 'merchantName',
              },
              {
                title: '交易类型',
                dataIndex: 'type',
                key: 'type',
                render: (type) => {
                  const typeMap: Record<string, { text: string; color: string }> = {
                    income: { text: '收入', color: 'success' },
                    commission: { text: '佣金', color: 'warning' },
                    withdraw: { text: '提现', color: 'error' },
                  };
                  return <Tag color={typeMap[type].color}>{typeMap[type].text}</Tag>;
                },
              },
              {
                title: '金额',
                dataIndex: 'amount',
                key: 'amount',
                sorter: (a, b) => a.amount - b.amount,
                render: (amount) => (
                  <span style={{ color: amount > 0 ? 'green' : 'red' }}>
                    {amount > 0 ? '+' : ''}{amount.toFixed(2)}
                  </span>
                ),
              },
              {
                title: '订单号',
                dataIndex: 'orderNo',
                key: 'orderNo',
                render: (orderNo) => orderNo || '-',
              },
              {
                title: '交易时间',
                dataIndex: 'createTime',
                key: 'createTime',
                sorter: (a, b) => new Date(a.createTime).getTime() - new Date(b.createTime).getTime(),
              },
              {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                render: (status) => {
                  const statusMap: Record<string, { text: string; color: string }> = {
                    success: { text: '成功', color: 'success' },
                    pending: { text: '处理中', color: 'processing' },
                    failed: { text: '失败', color: 'error' },
                  };
                  return <Tag color={statusMap[status].color}>{statusMap[status].text}</Tag>;
                },
              },
              {
                title: '操作',
                key: 'action',
                render: (_, record) => (
                  <Button type="link" onClick={() => handleViewTransaction(record)}>
                    详情
                  </Button>
                ),
              },
            ]}
          />
        </Card>

        <Modal
          title="交易详情"
          open={transactionDetailVisible}
          onCancel={() => setTransactionDetailVisible(false)}
          footer={[
            <Button key="close" onClick={() => setTransactionDetailVisible(false)}>
              关闭
            </Button>,
            <Button 
              key="download" 
              type="primary" 
              icon={<DownloadOutlined />}
              onClick={() => console.log('下载凭证')}
            >
              下载凭证
            </Button>,
          ]}
        >
          {currentTransaction && (
            <Descriptions bordered column={1}>
              <Descriptions.Item label="交易编号">{currentTransaction.id}</Descriptions.Item>
              <Descriptions.Item label="商家名称">{currentTransaction.merchantName}</Descriptions.Item>
              <Descriptions.Item label="交易类型">
                {(() => {
                  const typeMap: Record<string, { text: string; color: string }> = {
                    income: { text: '收入', color: 'success' },
                    commission: { text: '佣金', color: 'warning' },
                    withdraw: { text: '提现', color: 'error' },
                  };
                  return <Tag color={typeMap[currentTransaction.type].color}>
                    {typeMap[currentTransaction.type].text}
                  </Tag>;
                })()}
              </Descriptions.Item>
              <Descriptions.Item label="金额">
                <span style={{ color: currentTransaction.amount > 0 ? 'green' : 'red', fontWeight: 'bold' }}>
                  {currentTransaction.amount > 0 ? '+' : ''}{currentTransaction.amount.toFixed(2)}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="订单号">{currentTransaction.orderNo || '-'}</Descriptions.Item>
              <Descriptions.Item label="交易时间">{currentTransaction.createTime}</Descriptions.Item>
              <Descriptions.Item label="交易状态">
                {(() => {
                  const statusMap: Record<string, { text: string; color: string }> = {
                    success: { text: '成功', color: 'success' },
                    pending: { text: '处理中', color: 'processing' },
                    failed: { text: '失败', color: 'error' },
                  };
                  return <Tag color={statusMap[currentTransaction.status].color}>
                    {statusMap[currentTransaction.status].text}
                  </Tag>;
                })()}
              </Descriptions.Item>
              <Descriptions.Item label="备注">{currentTransaction.remark || '-'}</Descriptions.Item>
            </Descriptions>
          )}
        </Modal>
      </>
    );
  };

  // 结算记录
  const renderSettlements = () => {
    if (financeData.length === 0) return <div>暂无数据</div>;
    
    // 合并所有商家的结算记录
    const allSettlements = financeData.reduce((settlements, merchant) => {
      const merchantSettlements = merchant.settlementRecords?.map(settlement => ({
        ...settlement,
        merchantName: merchant.merchantName,
        merchantId: merchant.merchantId,
      })) || [];
      return [...settlements, ...merchantSettlements];
    }, []);

    return (
      <Card>
        <Form layout="inline" style={{ marginBottom: 16 }}>
          <Form.Item label="商家名称">
            <Select style={{ width: 160 }} placeholder="选择商家" allowClear>
              {financeData.map(merchant => (
                <Option key={merchant.merchantId} value={merchant.merchantId}>
                  {merchant.merchantName}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="结算状态">
            <Select style={{ width: 120 }} placeholder="选择状态" allowClear>
              <Option value="completed">已完成</Option>
              <Option value="pending">处理中</Option>
              <Option value="failed">失败</Option>
            </Select>
          </Form.Item>
          <Form.Item label="结算时间">
            <RangePicker />
          </Form.Item>
          <Form.Item>
            <Button type="primary" icon={<SearchOutlined />}>
              搜索
            </Button>
          </Form.Item>
          <Form.Item>
            <Button icon={<ExportOutlined />} onClick={handleExport}>
              导出
            </Button>
          </Form.Item>
        </Form>

        <Table
          rowKey="id"
          dataSource={allSettlements}
          loading={loading}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
          columns={[
            {
              title: '结算编号',
              dataIndex: 'id',
              key: 'id',
            },
            {
              title: '商家名称',
              dataIndex: 'merchantName',
              key: 'merchantName',
            },
            {
              title: '结算周期',
              dataIndex: 'period',
              key: 'period',
            },
            {
              title: '结算金额',
              dataIndex: 'amount',
              key: 'amount',
              sorter: (a, b) => a.amount - b.amount,
              render: (amount) => `¥${amount.toLocaleString()}`,
            },
            {
              title: '订单数量',
              dataIndex: 'orderCount',
              key: 'orderCount',
            },
            {
              title: '佣金金额',
              dataIndex: 'commissionAmount',
              key: 'commissionAmount',
              render: (amount) => `¥${amount.toLocaleString()}`,
            },
            {
              title: '结算时间',
              dataIndex: 'settleTime',
              key: 'settleTime',
              sorter: (a, b) => new Date(a.settleTime).getTime() - new Date(b.settleTime).getTime(),
            },
            {
              title: '结算状态',
              dataIndex: 'status',
              key: 'status',
              render: (status) => {
                const statusMap: Record<string, { text: string; color: string }> = {
                  completed: { text: '已完成', color: 'success' },
                  pending: { text: '处理中', color: 'processing' },
                  failed: { text: '失败', color: 'error' },
                };
                return <Tag color={statusMap[status].color}>{statusMap[status].text}</Tag>;
              },
            },
            {
              title: '备注',
              dataIndex: 'remark',
              key: 'remark',
              render: (remark) => remark || '-',
            },
          ]}
        />
      </Card>
    );
  };

  // 提现记录
  const renderWithdrawals = () => {
    if (financeData.length === 0) return <div>暂无数据</div>;
    
    // 合并所有商家的提现记录
    const allWithdrawals = financeData.reduce((withdrawals, merchant) => {
      const merchantWithdrawals = merchant.withdrawRecords?.map(withdrawal => ({
        ...withdrawal,
        merchantName: merchant.merchantName,
        merchantId: merchant.merchantId,
      })) || [];
      return [...withdrawals, ...merchantWithdrawals];
    }, []);

    return (
      <Card>
        <Form layout="inline" style={{ marginBottom: 16 }}>
          <Form.Item label="商家名称">
            <Select style={{ width: 160 }} placeholder="选择商家" allowClear>
              {financeData.map(merchant => (
                <Option key={merchant.merchantId} value={merchant.merchantId}>
                  {merchant.merchantName}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="提现状态">
            <Select style={{ width: 120 }} placeholder="选择状态" allowClear>
              <Option value="success">成功</Option>
              <Option value="pending">处理中</Option>
              <Option value="failed">失败</Option>
            </Select>
          </Form.Item>
          <Form.Item label="申请时间">
            <RangePicker />
          </Form.Item>
          <Form.Item>
            <Button type="primary" icon={<SearchOutlined />}>
              搜索
            </Button>
          </Form.Item>
          <Form.Item>
            <Button icon={<ExportOutlined />} onClick={handleExport}>
              导出
            </Button>
          </Form.Item>
        </Form>

        <Table
          rowKey="id"
          dataSource={allWithdrawals}
          loading={loading}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
          columns={[
            {
              title: '提现编号',
              dataIndex: 'id',
              key: 'id',
            },
            {
              title: '商家名称',
              dataIndex: 'merchantName',
              key: 'merchantName',
            },
            {
              title: '提现金额',
              dataIndex: 'amount',
              key: 'amount',
              sorter: (a, b) => a.amount - b.amount,
              render: (amount) => `¥${amount.toLocaleString()}`,
            },
            {
              title: '申请时间',
              dataIndex: 'applyTime',
              key: 'applyTime',
              sorter: (a, b) => new Date(a.applyTime).getTime() - new Date(b.applyTime).getTime(),
            },
            {
              title: '审核时间',
              dataIndex: 'auditTime',
              key: 'auditTime',
              render: (text) => text || '-',
            },
            {
              title: '完成时间',
              dataIndex: 'completeTime',
              key: 'completeTime',
              render: (text) => text || '-',
            },
            {
              title: '银行信息',
              dataIndex: 'bankInfo',
              key: 'bankInfo',
            },
            {
              title: '状态',
              dataIndex: 'status',
              key: 'status',
              render: (status) => {
                const statusMap: Record<string, { text: string; color: string }> = {
                  success: { text: '成功', color: 'success' },
                  pending: { text: '处理中', color: 'processing' },
                  failed: { text: '失败', color: 'error' },
                };
                return <Tag color={statusMap[status].color}>{statusMap[status].text}</Tag>;
              },
            },
            {
              title: '审核人',
              dataIndex: 'auditor',
              key: 'auditor',
              render: (text) => text || '-',
            },
            {
              title: '备注',
              dataIndex: 'remark',
              key: 'remark',
              render: (text) => text || '-',
            },
          ]}
        />
      </Card>
    );
  };

  return (
    <div className="merchant-finance">
      <Tabs activeKey={activeTab} onChange={handleTabChange}>
        <TabPane tab="财务概览" key="overview">
          {renderOverview()}
        </TabPane>
        <TabPane tab="交易记录" key="transactions">
          {renderTransactions()}
        </TabPane>
        <TabPane tab="结算记录" key="settlements">
          {renderSettlements()}
        </TabPane>
        <TabPane tab="提现记录" key="withdrawals">
          {renderWithdrawals()}
        </TabPane>
      </Tabs>
    </div>
  );
};

export default MerchantFinance; 
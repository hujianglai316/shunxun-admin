import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Form, DatePicker, Select, Input, Row, Col, Space, Tag, Modal, Descriptions, Statistic, Spin, Typography, message } from 'antd';
import { SearchOutlined, FileExcelOutlined, CheckCircleOutlined, CloseCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import type { Settlement, TransactionStatus, SettlementCycle, BankAccount } from '../../../types/finance';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Text } = Typography;

// 模拟结算数据
const mockSettlements: Settlement[] = [
  {
    id: 'S2023051001',
    merchantId: 'M10001',
    merchantName: '北京星程酒店(西单店)',
    amount: 42560.50,
    commissionAmount: 4256.05,
    orderCount: 126,
    cycle: 'DAILY',
    periodStart: '2023-05-09',
    periodEnd: '2023-05-09',
    status: 'COMPLETED',
    bankAccount: {
      accountName: '北京星程酒店管理有限公司',
      bankName: '招商银行',
      accountNumber: '6225880137659874',
    },
    createdAt: '2023-05-10 00:00:00',
    completedAt: '2023-05-10 10:15:23',
    operatorId: 'admin001',
    operatorName: '张三',
  },
  {
    id: 'S2023050901',
    merchantId: 'M10002',
    merchantName: '上海豪华公寓(静安寺店)',
    amount: 35680.75,
    commissionAmount: 3568.08,
    orderCount: 18,
    cycle: 'DAILY',
    periodStart: '2023-05-08',
    periodEnd: '2023-05-08',
    status: 'COMPLETED',
    bankAccount: {
      accountName: '上海豪华公寓管理有限公司',
      bankName: '工商银行',
      accountNumber: '6222021001015492',
    },
    createdAt: '2023-05-09 00:00:00',
    completedAt: '2023-05-09 09:30:15',
    operatorId: 'admin002',
    operatorName: '李四',
  },
  {
    id: 'S2023050801',
    merchantId: 'M10003',
    merchantName: '杭州西湖民宿',
    amount: 28350.25,
    commissionAmount: 2835.03,
    orderCount: 45,
    cycle: 'DAILY',
    periodStart: '2023-05-07',
    periodEnd: '2023-05-07',
    status: 'COMPLETED',
    bankAccount: {
      accountName: '杭州西湖民宿管理有限公司',
      bankName: '中国银行',
      accountNumber: '6217001830000598',
    },
    createdAt: '2023-05-08 00:00:00',
    completedAt: '2023-05-08 11:20:45',
    operatorId: 'admin001',
    operatorName: '张三',
  },
  {
    id: 'S2023050701',
    merchantId: 'M10004',
    merchantName: '广州尚泰酒店(珠江新城店)',
    amount: 38620.90,
    commissionAmount: 3862.09,
    orderCount: 87,
    cycle: 'DAILY',
    periodStart: '2023-05-06',
    periodEnd: '2023-05-06',
    status: 'COMPLETED',
    bankAccount: {
      accountName: '广州尚泰酒店管理有限公司',
      bankName: '建设银行',
      accountNumber: '6227001215950068',
    },
    createdAt: '2023-05-07 00:00:00',
    completedAt: '2023-05-07 10:05:30',
    operatorId: 'admin003',
    operatorName: '王五',
  },
  {
    id: 'S2023051101',
    merchantId: 'M10005',
    merchantName: '成都锦江酒店',
    amount: 45680.30,
    commissionAmount: 4568.03,
    orderCount: 132,
    cycle: 'DAILY',
    periodStart: '2023-05-10',
    periodEnd: '2023-05-10',
    status: 'PROCESSING',
    bankAccount: {
      accountName: '成都锦江酒店管理有限公司',
      bankName: '交通银行',
      accountNumber: '6222620110015936',
    },
    createdAt: '2023-05-11 00:00:00',
    operatorId: 'admin001',
    operatorName: '张三',
  },
  {
    id: 'S2023051102',
    merchantId: 'M10006',
    merchantName: '深圳海景公寓',
    amount: 52360.45,
    commissionAmount: 5236.05,
    orderCount: 26,
    cycle: 'DAILY',
    periodStart: '2023-05-10',
    periodEnd: '2023-05-10',
    status: 'PENDING',
    bankAccount: {
      accountName: '深圳海景公寓管理有限公司',
      bankName: '平安银行',
      accountNumber: '6230580000138294',
    },
    createdAt: '2023-05-11 00:00:00',
  },
];

const FinanceSettlement: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [detailVisible, setDetailVisible] = useState<boolean>(false);
  const [currentSettlement, setCurrentSettlement] = useState<Settlement | null>(null);
  const [confirmModalVisible, setConfirmModalVisible] = useState<boolean>(false);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);

  // 加载数据
  useEffect(() => {
    fetchSettlements();
  }, [pagination.current, pagination.pageSize]);

  const fetchSettlements = (params = {}) => {
    setLoading(true);
    // 模拟接口请求
    setTimeout(() => {
      setSettlements(mockSettlements);
      setTotal(mockSettlements.length);
      setLoading(false);
    }, 800);
  };

  const handleSearch = (values: any) => {
    console.log('Search values:', values);
    fetchSettlements(values);
  };

  const handleTableChange = (newPagination: any) => {
    setPagination(newPagination);
  };

  const handleResetForm = () => {
    form.resetFields();
  };

  const handleViewDetail = (record: Settlement) => {
    setCurrentSettlement(record);
    setDetailVisible(true);
  };

  const handleDetailClose = () => {
    setDetailVisible(false);
    setCurrentSettlement(null);
  };

  const handleConfirmSettlement = (record: Settlement) => {
    setCurrentSettlement(record);
    setConfirmModalVisible(true);
  };

  const handleConfirmModalOk = () => {
    setConfirmLoading(true);
    // 模拟提交确认结算请求
    setTimeout(() => {
      const updatedSettlements = settlements.map(item => {
        if (item.id === currentSettlement?.id) {
          return {
            ...item,
            status: 'COMPLETED' as TransactionStatus,
            completedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
          };
        }
        return item;
      });
      setSettlements(updatedSettlements);
      setConfirmLoading(false);
      setConfirmModalVisible(false);
      message.success('结算确认成功');
    }, 1500);
  };

  const handleConfirmModalCancel = () => {
    setConfirmModalVisible(false);
  };

  // 渲染状态标签
  const renderStatusTag = (status: TransactionStatus) => {
    const statusMap: Record<TransactionStatus, { color: string; text: string }> = {
      PENDING: { color: 'warning', text: '待处理' },
      PROCESSING: { color: 'processing', text: '处理中' },
      COMPLETED: { color: 'success', text: '已完成' },
      FAILED: { color: 'error', text: '失败' },
      CANCELLED: { color: 'default', text: '已取消' },
    };
    const { color, text } = statusMap[status];
    return <Tag color={color}>{text}</Tag>;
  };

  // 渲染结算周期
  const renderCycle = (cycle: SettlementCycle) => {
    const cycleMap: Record<SettlementCycle, string> = {
      DAILY: '日结',
      WEEKLY: '周结',
      MONTHLY: '月结',
    };
    return cycleMap[cycle];
  };

  // 表格列定义
  const columns = [
    {
      title: '结算单号',
      dataIndex: 'id',
      key: 'id',
      width: 150,
    },
    {
      title: '商家名称',
      dataIndex: 'merchantName',
      key: 'merchantName',
      ellipsis: true,
    },
    {
      title: '结算金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      render: (amount: number) => `¥${amount.toFixed(2)}`,
    },
    {
      title: '佣金金额',
      dataIndex: 'commissionAmount',
      key: 'commissionAmount',
      width: 120,
      render: (amount: number) => `¥${amount.toFixed(2)}`,
    },
    {
      title: '订单数',
      dataIndex: 'orderCount',
      key: 'orderCount',
      width: 100,
    },
    {
      title: '结算周期',
      dataIndex: 'cycle',
      key: 'cycle',
      width: 100,
      render: renderCycle,
    },
    {
      title: '结算周期',
      dataIndex: 'periodStart',
      key: 'period',
      width: 200,
      render: (_: any, record: Settlement) => `${record.periodStart} ~ ${record.periodEnd}`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: renderStatusTag,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: Settlement) => (
        <Space size="small">
          <Button type="link" size="small" onClick={() => handleViewDetail(record)}>
            查看
          </Button>
          {record.status === 'PENDING' && (
            <Button type="link" size="small" onClick={() => handleConfirmSettlement(record)}>
              确认结算
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="finance-settlement">
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={6}>
            <Statistic 
              title="今日待结算" 
              value={52360.45} 
              precision={2} 
              prefix="¥"
              valueStyle={{ color: '#1890ff' }}
            />
          </Col>
          <Col span={6}>
            <Statistic 
              title="本月已结算" 
              value={825630.80} 
              precision={2} 
              prefix="¥"
              valueStyle={{ color: '#52c41a' }}
            />
          </Col>
          <Col span={6}>
            <Statistic 
              title="今日结算笔数" 
              value={26} 
              valueStyle={{ color: '#722ed1' }}
            />
          </Col>
          <Col span={6}>
            <Statistic 
              title="本月结算笔数" 
              value={412} 
              valueStyle={{ color: '#fa8c16' }}
            />
          </Col>
        </Row>
      </Card>

      <Card title="结算管理">
        <Form
          form={form}
          onFinish={handleSearch}
          layout="vertical"
          initialValues={{
            status: undefined,
            dateRange: undefined,
            merchantName: undefined,
            settlementId: undefined,
          }}
        >
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item name="settlementId" label="结算单号">
                <Input placeholder="请输入结算单号" allowClear />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="merchantName" label="商家名称">
                <Input placeholder="请输入商家名称" allowClear />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="status" label="结算状态">
                <Select placeholder="请选择结算状态" allowClear>
                  <Option value="PENDING">待处理</Option>
                  <Option value="PROCESSING">处理中</Option>
                  <Option value="COMPLETED">已完成</Option>
                  <Option value="FAILED">失败</Option>
                  <Option value="CANCELLED">已取消</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="dateRange" label="结算日期">
                <RangePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{ textAlign: 'right', marginBottom: 16 }}>
              <Space>
                <Button onClick={handleResetForm}>重置</Button>
                <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                  查询
                </Button>
                <Button icon={<FileExcelOutlined />}>导出结算单</Button>
              </Space>
            </Col>
          </Row>
        </Form>

        <Table
          columns={columns}
          dataSource={settlements}
          rowKey="id"
          loading={loading}
          pagination={{
            ...pagination,
            total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
          onChange={handleTableChange}
          scroll={{ x: 1500 }}
        />
      </Card>

      {/* 结算详情弹窗 */}
      <Modal
        title="结算详情"
        open={detailVisible}
        onCancel={handleDetailClose}
        width={800}
        footer={[
          <Button key="close" onClick={handleDetailClose}>
            关闭
          </Button>,
        ]}
      >
        {currentSettlement && (
          <Spin spinning={false}>
            <Descriptions bordered column={2} style={{ marginBottom: 20 }}>
              <Descriptions.Item label="结算单号" span={2}>{currentSettlement.id}</Descriptions.Item>
              <Descriptions.Item label="商家ID">{currentSettlement.merchantId}</Descriptions.Item>
              <Descriptions.Item label="商家名称">{currentSettlement.merchantName}</Descriptions.Item>
              <Descriptions.Item label="结算金额">¥{currentSettlement.amount.toFixed(2)}</Descriptions.Item>
              <Descriptions.Item label="佣金金额">¥{currentSettlement.commissionAmount.toFixed(2)}</Descriptions.Item>
              <Descriptions.Item label="订单数量">{currentSettlement.orderCount}</Descriptions.Item>
              <Descriptions.Item label="结算周期">{renderCycle(currentSettlement.cycle)}</Descriptions.Item>
              <Descriptions.Item label="结算周期" span={2}>
                {currentSettlement.periodStart} ~ {currentSettlement.periodEnd}
              </Descriptions.Item>
              <Descriptions.Item label="结算状态">{renderStatusTag(currentSettlement.status)}</Descriptions.Item>
              <Descriptions.Item label="创建时间">{currentSettlement.createdAt}</Descriptions.Item>
              {currentSettlement.completedAt && (
                <Descriptions.Item label="完成时间" span={2}>{currentSettlement.completedAt}</Descriptions.Item>
              )}
              {currentSettlement.operatorName && (
                <Descriptions.Item label="操作人" span={2}>{currentSettlement.operatorName}</Descriptions.Item>
              )}
              {currentSettlement.remark && (
                <Descriptions.Item label="备注" span={2}>{currentSettlement.remark}</Descriptions.Item>
              )}
            </Descriptions>
            
            <Card title="收款账户信息" size="small">
              <Descriptions bordered column={2}>
                <Descriptions.Item label="开户名">{currentSettlement.bankAccount?.accountName}</Descriptions.Item>
                <Descriptions.Item label="开户行">{currentSettlement.bankAccount?.bankName}</Descriptions.Item>
                <Descriptions.Item label="银行账号" span={2}>
                  {currentSettlement.bankAccount?.accountNumber?.replace(/(\d{4})(?=\d)/g, '$1 ')}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Spin>
        )}
      </Modal>

      {/* 确认结算弹窗 */}
      <Modal
        title="确认结算"
        open={confirmModalVisible}
        onCancel={handleConfirmModalCancel}
        confirmLoading={confirmLoading}
        onOk={handleConfirmModalOk}
      >
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <InfoCircleOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 16 }} />
          <Typography.Title level={4}>确认为以下商家进行结算？</Typography.Title>
        </div>
        {currentSettlement && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="商家名称">{currentSettlement.merchantName}</Descriptions.Item>
            <Descriptions.Item label="结算金额">¥{currentSettlement.amount.toFixed(2)}</Descriptions.Item>
            <Descriptions.Item label="结算周期">
              {currentSettlement.periodStart} ~ {currentSettlement.periodEnd}
            </Descriptions.Item>
            <Descriptions.Item label="收款账户">
              {currentSettlement.bankAccount?.accountName} ({currentSettlement.bankAccount?.bankName})
            </Descriptions.Item>
          </Descriptions>
        )}
        <div style={{ marginTop: 16 }}>
          <Text type="secondary">
            注意：结算确认后，系统将自动向商家银行账户发起转账，请确认信息无误！
          </Text>
        </div>
      </Modal>
    </div>
  );
};

export default FinanceSettlement; 
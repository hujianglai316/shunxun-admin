import React from 'react';
import { Table, Tag, Space, DatePicker, Select, Input, Form, Button, Row, Col } from 'antd';
import type { Transaction, TransactionType, TransactionStatus, FinanceSearchParams } from '../../../../types/finance';

interface TransactionListProps {
  data: Transaction[];
  loading?: boolean;
  total: number;
  onSearch: (params: FinanceSearchParams) => void;
  pagination: {
    current: number;
    pageSize: number;
  };
}

const { RangePicker } = DatePicker;
const { Option } = Select;

const TransactionList: React.FC<TransactionListProps> = ({
  data,
  loading,
  total,
  onSearch,
  pagination,
}) => {
  const [form] = Form.useForm();

  const handleSearch = (values: any) => {
    onSearch({
      ...values,
      page: pagination.current,
      pageSize: pagination.pageSize,
    });
  };

  const handleTableChange = (newPagination: any) => {
    onSearch({
      ...form.getFieldsValue(),
      page: newPagination.current,
      pageSize: newPagination.pageSize,
    });
  };

  const renderTransactionType = (type: TransactionType) => {
    const typeMap: Record<TransactionType, { text: string; color: string }> = {
      ORDER_INCOME: { text: '订单收入', color: 'success' },
      WITHDRAWAL: { text: '提现', color: 'warning' },
      REFUND: { text: '退款', color: 'error' },
      COMMISSION: { text: '平台佣金', color: 'default' },
      ADJUSTMENT: { text: '手动调整', color: 'processing' },
    };
    const { text, color } = typeMap[type];
    return <Tag color={color}>{text}</Tag>;
  };

  const renderTransactionStatus = (status: TransactionStatus) => {
    const statusMap: Record<TransactionStatus, { text: string; color: string }> = {
      PENDING: { text: '待处理', color: 'warning' },
      PROCESSING: { text: '处理中', color: 'processing' },
      COMPLETED: { text: '已完成', color: 'success' },
      FAILED: { text: '失败', color: 'error' },
      CANCELLED: { text: '已取消', color: 'default' },
    };
    const { text, color } = statusMap[status];
    return <Tag color={color}>{text}</Tag>;
  };

  const columns = [
    {
      title: '交易时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
    },
    {
      title: '交易类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: renderTransactionType,
    },
    {
      title: '交易金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      render: (amount: number) => (
        <span style={{ color: amount >= 0 ? '#52c41a' : '#f5222d' }}>
          {amount >= 0 ? '+' : ''}{amount.toFixed(2)}
        </span>
      ),
    },
    {
      title: '交易后余额',
      dataIndex: 'balance',
      key: 'balance',
      width: 120,
      render: (balance: number) => `¥${balance.toFixed(2)}`,
    },
    {
      title: '订单号',
      dataIndex: 'orderId',
      key: 'orderId',
      width: 200,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: renderTransactionStatus,
    },
    {
      title: '操作人',
      dataIndex: 'operatorName',
      key: 'operatorName',
      width: 120,
    },
    {
      title: '备注',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
  ];

  return (
    <div className="transaction-list">
      <Form
        form={form}
        onFinish={handleSearch}
        layout="vertical"
        initialValues={{
          type: undefined,
          status: undefined,
          dateRange: undefined,
          orderId: undefined,
        }}
      >
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item name="type" label="交易类型">
              <Select allowClear placeholder="请选择交易类型">
                <Option value="ORDER_INCOME">订单收入</Option>
                <Option value="WITHDRAWAL">提现</Option>
                <Option value="REFUND">退款</Option>
                <Option value="COMMISSION">平台佣金</Option>
                <Option value="ADJUSTMENT">手动调整</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="status" label="交易状态">
              <Select allowClear placeholder="请选择交易状态">
                <Option value="PENDING">待处理</Option>
                <Option value="PROCESSING">处理中</Option>
                <Option value="COMPLETED">已完成</Option>
                <Option value="FAILED">失败</Option>
                <Option value="CANCELLED">已取消</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="dateRange" label="交易时间">
              <RangePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="orderId" label="订单号">
              <Input placeholder="请输入订单号" allowClear />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{ textAlign: 'right', marginBottom: 16 }}>
            <Space>
              <Button onClick={() => form.resetFields()}>重置</Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                查询
              </Button>
            </Space>
          </Col>
        </Row>
      </Form>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={{
          total,
          current: pagination.current,
          pageSize: pagination.pageSize,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`,
        }}
        onChange={handleTableChange}
        scroll={{ x: 1200 }}
      />
    </div>
  );
};

export default TransactionList; 
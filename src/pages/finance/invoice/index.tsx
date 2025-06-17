import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Form, DatePicker, Select, Input, Row, Col, Space, Tag, Modal, Descriptions, Badge, message, Tabs, Upload, Tooltip, Popconfirm } from 'antd';
import { SearchOutlined, FileExcelOutlined, UploadOutlined, EyeOutlined, CheckCircleOutlined, CloseCircleOutlined, DownloadOutlined } from '@ant-design/icons';
import type { Invoice, InvoiceStatus, InvoiceType } from '../../../types/finance';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;
const { TextArea } = Input;

// 模拟发票数据
const mockInvoices: Invoice[] = [
  {
    id: 'I202305100001',
    merchantId: 'M10001',
    merchantName: '北京星程酒店(西单店)',
    orderIds: ['O202305080123', 'O202305090456'],
    type: 'COMPANY',
    title: '北京星程酒店管理有限公司',
    taxNumber: '91110105MA00FGXY7H',
    amount: 12680.50,
    content: '住宿服务费',
    email: 'finance@bjhotel.com',
    status: 'PENDING',
    createdAt: '2023-05-10 14:28:35',
    updatedAt: '2023-05-10 14:28:35',
  },
  {
    id: 'I202305090002',
    merchantId: 'M10002',
    merchantName: '上海豪华公寓(静安寺店)',
    orderIds: ['O202305070789'],
    type: 'COMPANY',
    title: '上海豪华公寓管理有限公司',
    taxNumber: '91310105MA00HJKL8J',
    amount: 8350.75,
    content: '住宿服务费',
    email: 'finance@shanghaiapt.com',
    status: 'PROCESSING',
    createdAt: '2023-05-09 09:15:42',
    updatedAt: '2023-05-10 10:20:18',
    operatorId: 'admin001',
    operatorName: '张三',
  },
  {
    id: 'I202305080003',
    userId: 'U10023',
    userName: '李梅',
    orderIds: ['O202305050246'],
    type: 'PERSONAL',
    title: '李梅',
    amount: 2450.00,
    content: '住宿服务费',
    email: 'limei@example.com',
    status: 'COMPLETED',
    createdAt: '2023-05-08 15:35:28',
    updatedAt: '2023-05-09 11:42:35',
    completedAt: '2023-05-09 11:42:35',
    invoiceNumber: 'E202305090246',
    invoiceUrl: 'https://example.com/invoices/E202305090246.pdf',
    operatorId: 'admin002',
    operatorName: '李四',
  },
  {
    id: 'I202305070004',
    merchantId: 'M10003',
    merchantName: '杭州西湖民宿',
    orderIds: ['O202305030358', 'O202305040567'],
    type: 'COMPANY',
    title: '杭州西湖民宿管理有限公司',
    taxNumber: '91330105MA00LMNP9K',
    amount: 5680.25,
    content: '住宿服务费',
    email: 'finance@hzminsu.com',
    status: 'REJECTED',
    rejectionReason: '税号信息有误，请核对后重新提交',
    createdAt: '2023-05-07 10:28:15',
    updatedAt: '2023-05-08 09:35:42',
    operatorId: 'admin003',
    operatorName: '王五',
  },
  {
    id: 'I202305060005',
    userId: 'U10045',
    userName: '张伟',
    orderIds: ['O202305020157'],
    type: 'PERSONAL',
    title: '张伟',
    amount: 1850.50,
    content: '住宿服务费',
    email: 'zhangwei@example.com',
    status: 'COMPLETED',
    createdAt: '2023-05-06 16:42:35',
    updatedAt: '2023-05-07 10:15:28',
    completedAt: '2023-05-07 10:15:28',
    invoiceNumber: 'E202305070157',
    invoiceUrl: 'https://example.com/invoices/E202305070157.pdf',
    operatorId: 'admin001',
    operatorName: '张三',
  },
];

const FinanceInvoice: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [detailVisible, setDetailVisible] = useState<boolean>(false);
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null);
  const [auditVisible, setAuditVisible] = useState<boolean>(false);
  const [auditForm] = Form.useForm();
  const [auditLoading, setAuditLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('all');

  // 加载数据
  useEffect(() => {
    fetchInvoices();
  }, [pagination.current, pagination.pageSize, activeTab]);

  const fetchInvoices = (params = {}) => {
    setLoading(true);
    // 模拟接口请求
    setTimeout(() => {
      let filteredInvoices = [...mockInvoices];
      
      // 根据状态选项卡筛选
      if (activeTab !== 'all') {
        filteredInvoices = filteredInvoices.filter(invoice => invoice.status === activeTab);
      }
      
      setInvoices(filteredInvoices);
      setTotal(filteredInvoices.length);
      setLoading(false);
    }, 800);
  };

  const handleSearch = (values: any) => {
    console.log('Search values:', values);
    fetchInvoices(values);
  };

  const handleTableChange = (newPagination: any) => {
    setPagination(newPagination);
  };

  const handleResetForm = () => {
    form.resetFields();
  };

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    setPagination({ ...pagination, current: 1 });
  };

  const handleViewDetail = (record: Invoice) => {
    setCurrentInvoice(record);
    setDetailVisible(true);
  };

  const handleDetailClose = () => {
    setDetailVisible(false);
    setCurrentInvoice(null);
  };

  const handleAudit = (record: Invoice) => {
    setCurrentInvoice(record);
    setAuditVisible(true);
    auditForm.resetFields();
  };

  const handleAuditSubmit = () => {
    auditForm.validateFields().then(values => {
      setAuditLoading(true);
      
      // 模拟审核提交
      setTimeout(() => {
        const { action, rejectionReason } = values;
        const updatedInvoices = invoices.map(item => {
          if (item.id === currentInvoice?.id) {
            if (action === 'approve') {
              return {
                ...item,
                status: 'PROCESSING' as InvoiceStatus,
                updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
                operatorId: 'admin001',
                operatorName: '张三',
              };
            } else {
              return {
                ...item,
                status: 'REJECTED' as InvoiceStatus,
                rejectionReason,
                updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
                operatorId: 'admin001',
                operatorName: '张三',
              };
            }
          }
          return item;
        });
        
        setInvoices(updatedInvoices);
        setAuditLoading(false);
        setAuditVisible(false);
        message.success(`发票${action === 'approve' ? '审核通过' : '驳回'}成功`);
      }, 1000);
    });
  };

  const handleAuditCancel = () => {
    setAuditVisible(false);
  };

  const handleComplete = (record: Invoice) => {
    // 模拟完成开票
    setLoading(true);
    setTimeout(() => {
      const updatedInvoices = invoices.map(item => {
        if (item.id === record.id) {
          return {
            ...item,
            status: 'COMPLETED' as InvoiceStatus,
            completedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
            invoiceNumber: `E${new Date().getTime().toString().substring(0, 10)}`,
            invoiceUrl: 'https://example.com/invoices/sample.pdf',
            updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
            operatorId: 'admin001',
            operatorName: '张三',
          };
        }
        return item;
      });
      
      setInvoices(updatedInvoices);
      setLoading(false);
      message.success('发票开具成功');
    }, 1000);
  };

  // 渲染状态标签
  const renderStatusTag = (status: InvoiceStatus) => {
    const statusMap: Record<InvoiceStatus, { color: string; text: string }> = {
      PENDING: { color: 'warning', text: '待审核' },
      PROCESSING: { color: 'processing', text: '开票中' },
      COMPLETED: { color: 'success', text: '已开票' },
      REJECTED: { color: 'error', text: '已驳回' },
    };
    const { color, text } = statusMap[status];
    return <Tag color={color}>{text}</Tag>;
  };

  // 渲染发票类型
  const renderInvoiceType = (type: InvoiceType) => {
    return type === 'COMPANY' ? '企业发票' : '个人发票';
  };

  // 表格列定义
  const columns = [
    {
      title: '发票申请号',
      dataIndex: 'id',
      key: 'id',
      width: 150,
    },
    {
      title: '申请人',
      key: 'applicant',
      width: 150,
      render: (_: any, record: Invoice) => record.merchantName || record.userName,
    },
    {
      title: '发票类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: renderInvoiceType,
    },
    {
      title: '发票抬头',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: '发票金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      render: (amount: number) => `¥${amount.toFixed(2)}`,
    },
    {
      title: '申请时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: renderStatusTag,
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: any, record: Invoice) => (
        <Space size="small">
          <Button type="link" size="small" onClick={() => handleViewDetail(record)}>
            <EyeOutlined /> 查看
          </Button>
          
          {record.status === 'PENDING' && (
            <Button type="link" size="small" onClick={() => handleAudit(record)}>
              <CheckCircleOutlined /> 审核
            </Button>
          )}
          
          {record.status === 'PROCESSING' && (
            <Popconfirm
              title="确认已开具此发票?"
              onConfirm={() => handleComplete(record)}
              okText="确认"
              cancelText="取消"
            >
              <Button type="link" size="small">
                <UploadOutlined /> 完成开票
              </Button>
            </Popconfirm>
          )}
          
          {record.status === 'COMPLETED' && record.invoiceUrl && (
            <Tooltip title="下载电子发票">
              <Button type="link" size="small" href={record.invoiceUrl} target="_blank">
                <DownloadOutlined /> 下载
              </Button>
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="finance-invoice">
      <Card>
        <Tabs activeKey={activeTab} onChange={handleTabChange}>
          <TabPane tab="全部" key="all">
            <Badge count={total} style={{ marginLeft: 8 }} />
          </TabPane>
          <TabPane tab="待审核" key="PENDING">
            <Badge count={mockInvoices.filter(i => i.status === 'PENDING').length} style={{ marginLeft: 8 }} />
          </TabPane>
          <TabPane tab="开票中" key="PROCESSING">
            <Badge count={mockInvoices.filter(i => i.status === 'PROCESSING').length} style={{ marginLeft: 8 }} />
          </TabPane>
          <TabPane tab="已开票" key="COMPLETED">
            <Badge count={mockInvoices.filter(i => i.status === 'COMPLETED').length} style={{ marginLeft: 8 }} />
          </TabPane>
          <TabPane tab="已驳回" key="REJECTED">
            <Badge count={mockInvoices.filter(i => i.status === 'REJECTED').length} style={{ marginLeft: 8 }} />
          </TabPane>
        </Tabs>

        <Form
          form={form}
          onFinish={handleSearch}
          layout="vertical"
          style={{ marginTop: 16 }}
        >
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item name="invoiceId" label="发票申请号">
                <Input placeholder="请输入发票申请号" allowClear />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="applicant" label="申请人">
                <Input placeholder="请输入商家名称/用户名" allowClear />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="type" label="发票类型">
                <Select placeholder="请选择发票类型" allowClear>
                  <Option value="COMPANY">企业发票</Option>
                  <Option value="PERSONAL">个人发票</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="dateRange" label="申请时间">
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
                <Button icon={<FileExcelOutlined />}>导出数据</Button>
              </Space>
            </Col>
          </Row>
        </Form>

        <Table
          columns={columns}
          dataSource={invoices}
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
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* 发票详情弹窗 */}
      <Modal
        title="发票详情"
        open={detailVisible}
        onCancel={handleDetailClose}
        width={800}
        footer={[
          <Button key="close" onClick={handleDetailClose}>
            关闭
          </Button>,
        ]}
      >
        {currentInvoice && (
          <div>
            <Descriptions bordered column={2} style={{ marginBottom: 20 }}>
              <Descriptions.Item label="发票申请号" span={2}>{currentInvoice.id}</Descriptions.Item>
              <Descriptions.Item label="申请人">
                {currentInvoice.merchantName || currentInvoice.userName}
              </Descriptions.Item>
              <Descriptions.Item label="申请人ID">
                {currentInvoice.merchantId || currentInvoice.userId}
              </Descriptions.Item>
              <Descriptions.Item label="发票类型">{renderInvoiceType(currentInvoice.type)}</Descriptions.Item>
              <Descriptions.Item label="发票状态">{renderStatusTag(currentInvoice.status)}</Descriptions.Item>
              <Descriptions.Item label="发票抬头" span={2}>{currentInvoice.title}</Descriptions.Item>
              
              {currentInvoice.taxNumber && (
                <Descriptions.Item label="税号" span={2}>{currentInvoice.taxNumber}</Descriptions.Item>
              )}
              
              <Descriptions.Item label="发票金额">¥{currentInvoice.amount.toFixed(2)}</Descriptions.Item>
              <Descriptions.Item label="发票内容">{currentInvoice.content}</Descriptions.Item>
              <Descriptions.Item label="接收邮箱" span={2}>{currentInvoice.email}</Descriptions.Item>
              <Descriptions.Item label="申请时间" span={2}>{currentInvoice.createdAt}</Descriptions.Item>
              
              {currentInvoice.invoiceNumber && (
                <Descriptions.Item label="发票号码" span={2}>{currentInvoice.invoiceNumber}</Descriptions.Item>
              )}
              
              {currentInvoice.completedAt && (
                <Descriptions.Item label="开票时间" span={2}>{currentInvoice.completedAt}</Descriptions.Item>
              )}
              
              {currentInvoice.operatorName && (
                <Descriptions.Item label="处理人" span={2}>{currentInvoice.operatorName}</Descriptions.Item>
              )}
              
              {currentInvoice.rejectionReason && (
                <Descriptions.Item label="驳回原因" span={2}>{currentInvoice.rejectionReason}</Descriptions.Item>
              )}
            </Descriptions>
            
            <Card title="关联订单" size="small">
              <Table
                columns={[
                  { title: '订单号', dataIndex: 'id', key: 'id' },
                ]}
                dataSource={currentInvoice.orderIds.map(id => ({ id }))}
                rowKey="id"
                pagination={false}
                size="small"
              />
            </Card>
            
            {currentInvoice.status === 'COMPLETED' && currentInvoice.invoiceUrl && (
              <div style={{ marginTop: 16, textAlign: 'center' }}>
                <Button type="primary" href={currentInvoice.invoiceUrl} target="_blank" icon={<DownloadOutlined />}>
                  下载电子发票
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* 发票审核弹窗 */}
      <Modal
        title="发票审核"
        open={auditVisible}
        onCancel={handleAuditCancel}
        footer={null}
        width={600}
      >
        {currentInvoice && (
          <Form form={auditForm} layout="vertical" onFinish={handleAuditSubmit}>
            <Descriptions bordered column={1} size="small" style={{ marginBottom: 20 }}>
              <Descriptions.Item label="发票申请号">{currentInvoice.id}</Descriptions.Item>
              <Descriptions.Item label="申请人">
                {currentInvoice.merchantName || currentInvoice.userName}
              </Descriptions.Item>
              <Descriptions.Item label="发票类型">{renderInvoiceType(currentInvoice.type)}</Descriptions.Item>
              <Descriptions.Item label="发票抬头">{currentInvoice.title}</Descriptions.Item>
              {currentInvoice.taxNumber && (
                <Descriptions.Item label="税号">{currentInvoice.taxNumber}</Descriptions.Item>
              )}
              <Descriptions.Item label="发票金额">¥{currentInvoice.amount.toFixed(2)}</Descriptions.Item>
            </Descriptions>
            
            <Form.Item name="action" label="审核结果" rules={[{ required: true, message: '请选择审核结果' }]}>
              <Select placeholder="请选择审核结果">
                <Option value="approve">通过</Option>
                <Option value="reject">驳回</Option>
              </Select>
            </Form.Item>
            
            <Form.Item 
              noStyle 
              shouldUpdate={(prevValues, currentValues) => prevValues.action !== currentValues.action}
            >
              {({ getFieldValue }) => 
                getFieldValue('action') === 'reject' ? (
                  <Form.Item 
                    name="rejectionReason" 
                    label="驳回原因" 
                    rules={[{ required: true, message: '请输入驳回原因' }]}
                  >
                    <TextArea rows={4} placeholder="请输入驳回原因" />
                  </Form.Item>
                ) : null
              }
            </Form.Item>
            
            <Form.Item style={{ textAlign: 'right', marginBottom: 0, marginTop: 24 }}>
              <Space>
                <Button onClick={handleAuditCancel}>取消</Button>
                <Button type="primary" htmlType="submit" loading={auditLoading}>
                  提交
                </Button>
              </Space>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default FinanceInvoice; 
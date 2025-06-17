import React, { useState } from 'react';
import { Card, Table, Button, Input, Space, Tag, DatePicker, Select, Drawer, Form, Modal } from 'antd';
import { SearchOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;

interface PromotionAudit {
  id: string;
  merchantName: string;
  promotionName: string;
  type: 'property' | 'brand' | 'activity';
  budget: number;
  status: 'pending' | 'approved' | 'rejected';
  submitTime: string;
}

const PromotionAudit: React.FC = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<PromotionAudit>();
  const [form] = Form.useForm();

  const handleAuditSubmit = (status: 'approved' | 'rejected') => {
    form.validateFields().then(values => {
      console.log('Audit:', currentRecord?.id, status, values);
      setDrawerVisible(false);
      form.resetFields();
    });
  };

  const columns: ColumnsType<PromotionAudit> = [
    {
      title: '商家名称',
      dataIndex: 'merchantName',
      key: 'merchantName',
      width: 180,
    },
    {
      title: '活动名称',
      dataIndex: 'promotionName',
      key: 'promotionName',
      width: 200,
    },
    {
      title: '推广类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type: string) => {
        const typeMap = {
          property: { color: 'blue', text: '房源推广' },
          brand: { color: 'purple', text: '品牌推广' },
          activity: { color: 'orange', text: '活动推广' },
        };
        const { color, text } = typeMap[type as keyof typeof typeMap];
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '预算金额',
      dataIndex: 'budget',
      key: 'budget',
      width: 120,
      render: (budget: number) => `¥${budget.toLocaleString()}`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const statusMap = {
          pending: { color: 'processing', text: '待审核' },
          approved: { color: 'success', text: '已通过' },
          rejected: { color: 'error', text: '已拒绝' },
        };
        const { color, text } = statusMap[status as keyof typeof statusMap];
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '提交时间',
      dataIndex: 'submitTime',
      key: 'submitTime',
      width: 180,
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleView(record)}>
            查看
          </Button>
          {record.status === 'pending' && (
            <>
              <Button type="link" onClick={() => handleAudit(record, 'approved')}>
                通过
              </Button>
              <Button type="link" danger onClick={() => handleAudit(record, 'rejected')}>
                拒绝
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  const handleView = (record: PromotionAudit) => {
    setCurrentRecord(record);
    setDrawerVisible(true);
  };

  const handleAudit = (record: PromotionAudit, status: 'approved' | 'rejected') => {
    Modal.confirm({
      title: status === 'approved' ? '确认通过' : '确认拒绝',
      icon: <ExclamationCircleOutlined />,
      content: `确定要${status === 'approved' ? '通过' : '拒绝'}该活动吗？`,
      onOk() {
        console.log('Audit:', record.id, status);
      },
    });
  };

  const mockData: PromotionAudit[] = [
    {
      id: '1',
      merchantName: '北京房源中介',
      promotionName: '春季特惠房源推广',
      type: 'property',
      budget: 5000,
      status: 'pending',
      submitTime: '2024-03-20 10:00:00',
    },
    {
      id: '2',
      merchantName: '上海租房平台',
      promotionName: '品牌形象推广',
      type: 'brand',
      budget: 10000,
      status: 'pending',
      submitTime: '2024-03-20 11:30:00',
    },
  ];

  return (
    <Card title="活动审核管理">
      <div style={{ marginBottom: 16 }}>
        <Space size={8}>
          <Input
            placeholder="商家名称/活动名称"
            prefix={<SearchOutlined />}
            style={{ width: 220 }}
          />
          <Select placeholder="推广类型" style={{ width: 120 }}>
            <Option value="property">房源推广</Option>
            <Option value="brand">品牌推广</Option>
            <Option value="activity">活动推广</Option>
          </Select>
          <Select placeholder="审核状态" style={{ width: 120 }}>
            <Option value="pending">待审核</Option>
            <Option value="approved">已通过</Option>
            <Option value="rejected">已拒绝</Option>
          </Select>
          <RangePicker style={{ width: 240 }} />
        </Space>
      </div>

      <Table<PromotionAudit>
        columns={columns}
        dataSource={mockData}
        rowKey="id"
        pagination={{
          total: mockData.length,
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`,
        }}
      />

      <Drawer
        title="审核详情"
        placement="right"
        width={600}
        onClose={() => setDrawerVisible(false)}
        visible={drawerVisible}
      >
        {currentRecord && (
          <div>
            <Form form={form} layout="vertical">
              <Form.Item label="商家名称">
                <Input value={currentRecord.merchantName} readOnly />
              </Form.Item>
              <Form.Item label="活动名称">
                <Input value={currentRecord.promotionName} readOnly />
              </Form.Item>
              <Form.Item label="推广类型">
                <Input value={currentRecord.type === 'property' ? '房源推广' : currentRecord.type === 'brand' ? '品牌推广' : '活动推广'} readOnly />
              </Form.Item>
              <Form.Item label="预算金额">
                <Input value={`¥${currentRecord.budget.toLocaleString()}`} readOnly />
              </Form.Item>
              <Form.Item label="提交时间">
                <Input value={currentRecord.submitTime} readOnly />
              </Form.Item>
              {currentRecord.status === 'pending' && (
                <>
                  <Form.Item
                    name="remark"
                    label="审核意见"
                    rules={[{ required: true, message: '请输入审核意见' }]}
                  >
                    <TextArea rows={4} placeholder="请输入审核意见" />
                  </Form.Item>
                  <Form.Item>
                    <Space>
                      <Button type="primary" onClick={() => handleAuditSubmit('approved')}>
                        通过
                      </Button>
                      <Button danger onClick={() => handleAuditSubmit('rejected')}>
                        拒绝
                      </Button>
                    </Space>
                  </Form.Item>
                </>
              )}
            </Form>
          </div>
        )}
      </Drawer>
    </Card>
  );
};

export default PromotionAudit; 
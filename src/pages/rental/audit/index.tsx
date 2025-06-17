import React, { useState } from 'react';
import { Table, Button, Input, Space, Tag, Select, Drawer, Tabs, Timeline, Form, Descriptions } from 'antd';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import './index.less';

const { Option } = Select;
const { TabPane } = Tabs;

// 审核记录接口定义
interface AuditRecord {
  id: string;
  name: string;
  address: string;
  type: string;
  landlord: string;
  phone: string;
  submitTime: string;
  status: 'pending' | 'approved' | 'rejected';
  reason?: string;
  content?: {
    before?: Record<string, any>;
    after: Record<string, any>;
  };
}

// 模拟审核数据
const mockAuditData: AuditRecord[] = [
  {
    id: '1',
    name: '阳光花园小区 3室2厅',
    address: '北京市朝阳区阳光花园小区B栋2单元501',
    type: '3室2厅2卫',
    landlord: '张先生',
    phone: '13800138000',
    submitTime: '2024-03-20 10:00:00',
    status: 'pending',
  },
  {
    id: '2',
    name: '星河湾 2室1厅',
    address: '北京市海淀区星河湾小区A栋1单元301',
    type: '2室1厅1卫',
    landlord: '李女士',
    phone: '13900139000',
    submitTime: '2024-03-20 09:30:00',
    status: 'approved',
  },
  {
    id: '3',
    name: '金茂府 4室2厅',
    address: '北京市朝阳区金茂府C栋3单元1801',
    type: '4室2厅2卫',
    landlord: '王先生',
    phone: '13700137000',
    submitTime: '2024-03-20 09:00:00',
    status: 'rejected',
    reason: '房源信息不完整',
  },
];

const RentalAuditPage: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<AuditRecord>();
  const [activeTab, setActiveTab] = useState('room');

  // 获取过滤后的数据
  const getFilteredData = () => {
    let filtered = [...mockAuditData];
    
    if (searchText) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.landlord.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    if (statusFilter) {
      filtered = filtered.filter(item => item.status === statusFilter);
    }
    
    return filtered;
  };

  // 查看审核详情
  const handleView = (record: AuditRecord) => {
    setCurrentRecord(record);
    setDrawerVisible(true);
  };

  // 获取状态标签样式
  const getStatusTag = (status: string) => {
    const statusMap = {
      pending: { color: 'processing', text: '待审核' },
      approved: { color: 'success', text: '已通过' },
      rejected: { color: 'error', text: '已拒绝' },
    };
    const { color, text } = statusMap[status as keyof typeof statusMap];
    return <Tag color={color}>{text}</Tag>;
  };

  // 获取变更类型标签样式
  const getChangeTypeTag = (type: string) => {
    const typeMap = {
      create: { color: 'success', text: '新增' },
      update: { color: 'warning', text: '修改' },
      delete: { color: 'error', text: '删除' },
    };
    const { color, text } = typeMap[type as keyof typeof typeMap];
    return <Tag color={color}>{text}</Tag>;
  };

  // 字段名称映射
  const fieldNameMap: Record<string, string> = {
    roomType: '房型名称',
    price: '价格',
    roomCount: '房间数量',
    facilities: '设施配置',
    address: '酒店地址',
    contactPhone: '联系电话',
    checkInTime: '入住时间',
    checkOutTime: '退房时间',
  };

  const columns: ColumnsType<AuditRecord> = [
    {
      title: '房源名称',
      dataIndex: 'name',
      key: 'name',
      width: 180,
      ellipsis: true,
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
      width: 250,
      ellipsis: true,
    },
    {
      title: '房型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      ellipsis: true,
    },
    {
      title: '房东',
      dataIndex: 'landlord',
      key: 'landlord',
      width: 100,
      ellipsis: true,
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
      width: 120,
      ellipsis: true,
    },
    {
      title: '提交时间',
      dataIndex: 'submitTime',
      key: 'submitTime',
      width: 160,
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      ellipsis: true,
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
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 180,
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleView(record)}>查看</Button>
          {record.status === 'pending' && (
            <>
              <Button type="link">通过</Button>
              <Button type="link" danger>拒绝</Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  // 渲染变更内容比对
  const renderContentDiff = (content: AuditRecord['content']) => {
    if (!content) {
      return null;
    }
    
    if (!content.before) {
      return (
        <Descriptions column={1} bordered size="small">
          {Object.entries(content.after).map(([key, value]) => (
            <Descriptions.Item key={key} label={fieldNameMap[key] || key}>
              {Array.isArray(value) ? value.join('、') : String(value)}
            </Descriptions.Item>
          ))}
        </Descriptions>
      );
    }

    return (
      <div className="content-diff">
        <div className="diff-column">
          <h4>变更前</h4>
          <Descriptions column={1} bordered size="small">
            {Object.entries(content.before).map(([key, value]) => (
              <Descriptions.Item key={key} label={fieldNameMap[key] || key}>
                {Array.isArray(value) ? value.join('、') : String(value)}
              </Descriptions.Item>
            ))}
          </Descriptions>
        </div>
        <div className="diff-column">
          <h4>变更后</h4>
          <Descriptions column={1} bordered size="small">
            {Object.entries(content.after).map(([key, value]) => (
              <Descriptions.Item key={key} label={fieldNameMap[key] || key}>
                {Array.isArray(value) ? value.join('、') : String(value)}
              </Descriptions.Item>
            ))}
          </Descriptions>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="mb-4">
        <Space size={8}>
          <Input
            placeholder="搜索房源名称/房东"
            prefix={<SearchOutlined />}
            style={{ width: 220 }}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Select
            placeholder="审核状态"
            style={{ width: 120 }}
            allowClear
            onChange={setStatusFilter}
          >
            <Select.Option value="pending">待审核</Select.Option>
            <Select.Option value="approved">已通过</Select.Option>
            <Select.Option value="rejected">已拒绝</Select.Option>
          </Select>
        </Space>
      </div>

      <Table<AuditRecord>
        columns={columns}
        dataSource={getFilteredData()}
        rowKey="id"
        size="middle"
        scroll={{ x: 1200 }}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`,
          defaultPageSize: 10,
          size: 'small'
        }}
      />

      <Drawer
        title="审核详情"
        placement="right"
        width={600}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        className="audit-detail-drawer"
      >
        {currentRecord && (
          <div className="audit-detail">
            <div className="detail-section">
              <h3>基本信息</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="label">房源名称：</span>
                  <span className="value">{currentRecord.name}</span>
                </div>
                <div className="detail-item">
                  <span className="label">地址：</span>
                  <span className="value">{currentRecord.address}</span>
                </div>
                <div className="detail-item">
                  <span className="label">房型：</span>
                  <span className="value">{currentRecord.type}</span>
                </div>
                <div className="detail-item">
                  <span className="label">房东：</span>
                  <span className="value">{currentRecord.landlord}</span>
                </div>
                <div className="detail-item">
                  <span className="label">联系电话：</span>
                  <span className="value">{currentRecord.phone}</span>
                </div>
                <div className="detail-item">
                  <span className="label">提交时间：</span>
                  <span className="value">{currentRecord.submitTime}</span>
                </div>
                {currentRecord.reason && (
                  <div className="detail-item full-width">
                    <span className="label">审核原因：</span>
                    <span className="value">{currentRecord.reason}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="detail-section">
              <h3>审核操作</h3>
              <Form layout="vertical">
                <Form.Item
                  label="审核意见"
                  name="auditRemark"
                >
                  <Input.TextArea rows={4} placeholder="请输入审核意见" />
                </Form.Item>
                <Form.Item>
                  <Space>
                    <Button type="primary">通过</Button>
                    <Button danger>拒绝</Button>
                  </Space>
                </Form.Item>
              </Form>
            </div>
          </div>
        )}
      </Drawer>
    </>
  );
};

export default RentalAuditPage; 
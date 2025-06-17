import React, { useState } from 'react';
import { Table, Button, Input, Space, Tag, Select, Drawer, Tabs, Timeline, Form, Descriptions, Card, Image, Divider } from 'antd';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import './index.less';

const { Option } = Select;
const { TabPane } = Tabs;

// 审核记录接口定义
interface AuditRecord {
  id: string;
  hotelName: string;
  auditType: 'room' | 'hotel';
  changeType: 'create' | 'update' | 'delete';
  status: 'pending' | 'approved' | 'rejected';
  submitter: string;
  submitTime: string;
  content: {
    before?: any;
    after: any;
  };
  remark?: string;
}

// 模拟审核数据
const mockAuditData: AuditRecord[] = [
  {
    id: 'A001',
    hotelName: '北京国际酒店',
    auditType: 'room',
    changeType: 'update',
    status: 'pending',
    submitter: '张三',
    submitTime: '2024-03-20 10:00:00',
    content: {
      before: {
        roomType: '豪华双床房',
        price: 788,
        roomCount: 3,
        facilities: ['WiFi', '空调', '电视', '冰箱', '独立卫浴'],
      },
      after: {
        roomType: '豪华双床房',
        price: 888,
        roomCount: 5,
        facilities: ['WiFi', '空调', '电视', '冰箱', '独立卫浴', '24小时热水'],
      },
    },
    remark: '旺季调整房价和房间数量，增加设施',
  },
  {
    id: 'A002',
    hotelName: '上海浦东丽思卡尔顿',
    auditType: 'hotel',
    changeType: 'update',
    status: 'pending',
    submitter: '李四',
    submitTime: '2024-03-20 09:30:00',
    content: {
      before: {
        address: '浦东新区陆家嘴西路168号',
        contactPhone: '021-12345678',
        checkInTime: '14:00',
        checkOutTime: '12:00',
      },
      after: {
        address: '浦东新区陆家嘴西路168号',
        contactPhone: '021-87654321',
        checkInTime: '15:00',
        checkOutTime: '13:00',
      },
    },
    remark: '更新酒店联系电话和入住时间',
  },
];

const HotelAudit: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<AuditRecord>();
  const [activeTab, setActiveTab] = useState('room');

  // 处理搜索
  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  // 处理状态筛选
  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
  };

  // 获取过滤后的数据
  const getFilteredData = (type: 'room' | 'hotel') => {
    let filtered = mockAuditData.filter(item => item.auditType === type);
    
    if (searchText) {
      filtered = filtered.filter(item => 
        item.hotelName.toLowerCase().includes(searchText.toLowerCase())
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
      title: '酒店名称',
      dataIndex: 'hotelName',
      key: 'hotelName',
      width: 180,
      ellipsis: true,
    },
    {
      title: '变更类型',
      dataIndex: 'changeType',
      key: 'changeType',
      width: 100,
      render: (type) => getChangeTypeTag(type),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => getStatusTag(status),
    },
    {
      title: '提交人',
      dataIndex: 'submitter',
      key: 'submitter',
      width: 100,
    },
    {
      title: '提交时间',
      dataIndex: 'submitTime',
      key: 'submitTime',
      width: 160,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_, record) => (
        <Space>
          <Button 
            type="link" 
            icon={<EyeOutlined />} 
            onClick={() => handleView(record)}
          >
            查看
          </Button>
          <Button type="link" disabled={record.status !== 'pending'}>
            通过
          </Button>
          <Button type="link" danger disabled={record.status !== 'pending'}>
            拒绝
          </Button>
        </Space>
      ),
    },
  ];

  // 渲染变更内容比对
  const renderContentDiff = (content: AuditRecord['content']) => {
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
    <Card 
      title="酒店审核管理"
      bodyStyle={{ padding: '24px 24px 0' }}
    >
      <div style={{ marginBottom: 16 }}>
        <Space size={8}>
          <Input
            placeholder="搜索酒店名称"
            prefix={<SearchOutlined />}
            style={{ width: 220 }}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <Select 
            placeholder="审核状态" 
            style={{ width: 120 }} 
            allowClear
            onChange={handleStatusFilter}
          >
            <Option value="pending">待审核</Option>
            <Option value="approved">已通过</Option>
            <Option value="rejected">已拒绝</Option>
          </Select>
        </Space>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="房间审核" key="room">
          <Table
            columns={columns}
            dataSource={getFilteredData('room')}
            rowKey="id"
            pagination={{
              total: getFilteredData('room').length,
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条记录`,
            }}
            scroll={{ x: 'max-content' }}
          />
        </TabPane>
        <TabPane tab="酒店审核" key="hotel">
          <Table
            columns={columns}
            dataSource={getFilteredData('hotel')}
            rowKey="id"
            pagination={{
              total: getFilteredData('hotel').length,
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条记录`,
            }}
            scroll={{ x: 'max-content' }}
          />
        </TabPane>
      </Tabs>

      <Drawer
        title="审核详情"
        placement="right"
        width={720}
        onClose={() => setDrawerVisible(false)}
        visible={drawerVisible}
      >
        {currentRecord && (
          <div>
            <Descriptions title="基本信息" column={2}>
              <Descriptions.Item label="酒店名称">{currentRecord.hotelName}</Descriptions.Item>
              <Descriptions.Item label="变更类型">{getChangeTypeTag(currentRecord.changeType)}</Descriptions.Item>
              <Descriptions.Item label="提交人">{currentRecord.submitter}</Descriptions.Item>
              <Descriptions.Item label="提交时间">{currentRecord.submitTime}</Descriptions.Item>
              <Descriptions.Item label="状态">{getStatusTag(currentRecord.status)}</Descriptions.Item>
              {currentRecord.remark && (
                <Descriptions.Item label="备注" span={2}>{currentRecord.remark}</Descriptions.Item>
              )}
            </Descriptions>

            <Divider />

            <div>
              <h3>变更内容</h3>
              {renderContentDiff(currentRecord.content)}
            </div>

            {currentRecord.status === 'pending' && (
              <div style={{ marginTop: 24 }}>
                <Space>
                  <Button type="primary" onClick={() => handleAudit(currentRecord.id, 'approved')}>
                    通过
                  </Button>
                  <Button danger onClick={() => handleAudit(currentRecord.id, 'rejected')}>
                    拒绝
                  </Button>
                </Space>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </Card>
  );
};

export default HotelAudit; 
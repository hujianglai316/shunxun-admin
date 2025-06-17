import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Table, 
  Button, 
  Input, 
  Space, 
  Tag, 
  Select, 
  Tabs,
  message,
  Popconfirm
} from 'antd';
import { 
  SearchOutlined, 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  StopOutlined
} from '@ant-design/icons';
import type { ColumnType } from 'antd/es/table';
import type { MerchantBasicInfo } from '../../../types/merchant';
import { MerchantType, MerchantStatus, PlatformType } from '../../../types/merchant';
import { mockMerchants } from '@/mock/merchant';
import type { TableRowSelection } from 'antd/es/table/interface';

const { TabPane } = Tabs;
const { Option } = Select;

const MerchantList: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [currentPlatform, setCurrentPlatform] = useState<PlatformType>(PlatformType.HOTEL);
  const [merchants, setMerchants] = useState<MerchantBasicInfo[]>([]);

  useEffect(() => {
    setMerchants(mockMerchants);
  }, []);

  const handleSearch = (values: any) => {
    console.log('搜索条件：', values);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleViewDetail = (record: MerchantBasicInfo) => {
    navigate(`/merchant/detail/${record.id}`);
  };

  const handleAdd = () => {
    navigate('/merchant/create');
  };

  const handleEdit = (record: MerchantBasicInfo) => {
    navigate(`/merchant/edit/${record.id}`);
  };

  const handleStatusChange = async (id: number, newStatus: MerchantStatus) => {
    try {
      message.success('状态更新成功');
    } catch (error) {
      message.error('状态更新失败');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      message.success('删除成功');
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleBatchDelete = async () => {
    try {
      message.success(`成功删除 ${selectedRowKeys.length} 个商家`);
      setSelectedRowKeys([]);
    } catch (error) {
      message.error('批量删除失败');
    }
  };

  const handlePlatformChange = (platform: string) => {
    setCurrentPlatform(platform as PlatformType);
  };

  const columns: ColumnType<MerchantBasicInfo>[] = [
    {
      title: '商家名称',
      dataIndex: 'name',
      key: 'name',
      width: 180,
      ellipsis: true,
      render: (text: string, record: MerchantBasicInfo) => (
        <a onClick={() => handleViewDetail(record)}>{text}</a>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: MerchantType) => {
        const typeMap = {
          [MerchantType.HOTEL]: '酒店',
          [MerchantType.APARTMENT]: '公寓',
          [MerchantType.HOUSE]: '民宿',
        };
        return typeMap[type];
      },
    },
    {
      title: '城市',
      dataIndex: 'city',
      key: 'city',
      width: 120,
    },
    {
      title: '房间数',
      dataIndex: 'roomCount',
      key: 'roomCount',
      width: 100,
      sorter: (a: MerchantBasicInfo, b: MerchantBasicInfo) => a.roomCount - b.roomCount,
    },
    {
      title: '联系人',
      dataIndex: 'contact',
      key: 'contact',
      width: 100,
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
      width: 140,
    },
    {
      title: '详细地址',
      dataIndex: 'address',
      key: 'address',
      ellipsis: true,
      width: 200,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: MerchantStatus) => {
        const statusMap = {
          [MerchantStatus.ACTIVE]: { text: '正常', color: 'success' },
          [MerchantStatus.INACTIVE]: { text: '已禁用', color: 'default' },
          [MerchantStatus.PENDING]: { text: '待审核', color: 'warning' },
          [MerchantStatus.REJECTED]: { text: '已拒绝', color: 'error' },
        };
        const { text, color } = statusMap[status];
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
      sorter: true,
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right' as const,
      width: 260,
      render: (_: any, record: MerchantBasicInfo) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            查看
          </Button>
          <Button 
            type="text" 
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          {record.status === MerchantStatus.ACTIVE ? (
            <Button
              type="text"
              danger
              icon={<StopOutlined />}
              onClick={() => handleStatusChange(record.id, MerchantStatus.INACTIVE)}
            >
              禁用
            </Button>
          ) : (
            <Button
              type="text"
              icon={<CheckCircleOutlined />}
              onClick={() => handleStatusChange(record.id, MerchantStatus.ACTIVE)}
            >
              启用
            </Button>
          )}
          <Popconfirm
            title="确定要删除这个商家吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="text" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const rowSelection: TableRowSelection<MerchantBasicInfo> = {
    selectedRowKeys,
    onChange: (selectedRowKeys) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  const renderToolbar = () => (
    <Space style={{ marginBottom: 16 }}>
      <Input.Search placeholder="搜索商家名称/联系人/电话" style={{ width: 300 }} />
      <Select placeholder="商家类型" style={{ width: 120 }}>
        <Option value={MerchantType.HOTEL}>酒店</Option>
        <Option value={MerchantType.APARTMENT}>公寓</Option>
        <Option value={MerchantType.HOUSE}>民宿</Option>
      </Select>
      <Select placeholder="城市" style={{ width: 120 }}>
        <Option value="北京市">北京市</Option>
        <Option value="上海市">上海市</Option>
        <Option value="广州市">广州市</Option>
        <Option value="深圳市">深圳市</Option>
      </Select>
      <Select placeholder="状态" style={{ width: 120 }}>
        <Option value={MerchantStatus.ACTIVE}>正常</Option>
        <Option value={MerchantStatus.INACTIVE}>已禁用</Option>
        <Option value={MerchantStatus.PENDING}>待审核</Option>
        <Option value={MerchantStatus.REJECTED}>已拒绝</Option>
      </Select>
      <Button type="primary" onClick={handleAdd}>新增商家</Button>
      {selectedRowKeys.length > 0 && (
        <Button danger onClick={handleBatchDelete}>
          批量删除
        </Button>
      )}
    </Space>
  );

  const filteredMerchants = merchants.filter(
    merchant => merchant.platformType === currentPlatform
  );

  return (
    <div className="merchant-list">
      <div className="merchant-list-container">
        <Tabs
          defaultActiveKey={PlatformType.HOTEL}
          onChange={handlePlatformChange}
          className="merchant-tabs"
        >
          <TabPane tab="酒店平台商家" key={PlatformType.HOTEL} />
          <TabPane tab="租房平台商家" key={PlatformType.RENTAL} />
        </Tabs>
        {renderToolbar()}
        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredMerchants}
          loading={loading}
          rowSelection={rowSelection}
          scroll={{ x: 1500 }}
          pagination={{
            total: filteredMerchants.length,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </div>
    </div>
  );
};

export default MerchantList; 
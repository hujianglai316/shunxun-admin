import React, { useState } from 'react';
import { Table, Card, Space, Input, Select, Tag, Button, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { TablePaginationConfig } from 'antd/es/table';

const { Search } = Input;
const { Option } = Select;

interface UserData {
  id: number;
  username: string;
  nickname: string;
  phone: string;
  email: string;
  status: string;
  registerTime: string;
  lastLoginTime: string;
}

const UserList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // 模拟数据
  const data: UserData[] = [
    {
      id: 1,
      username: 'user001',
      nickname: '张三',
      phone: '13800138000',
      email: 'zhangsan@example.com',
      status: 'active',
      registerTime: '2024-03-01 10:00:00',
      lastLoginTime: '2024-03-15 15:30:00',
    },
    {
      id: 2,
      username: 'user002',
      nickname: '李四',
      phone: '13900139000',
      email: 'lisi@example.com',
      status: 'inactive',
      registerTime: '2024-03-02 11:00:00',
      lastLoginTime: '2024-03-14 16:20:00',
    },
    // 更多数据...
  ];

  const columns = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      key: 'nickname',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'success' : 'default'}>
          {status === 'active' ? '正常' : '已禁用'}
        </Tag>
      ),
    },
    {
      title: '注册时间',
      dataIndex: 'registerTime',
      key: 'registerTime',
    },
    {
      title: '最后登录',
      dataIndex: 'lastLoginTime',
      key: 'lastLoginTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: UserData) => (
        <Space size="middle">
          <Button 
            type="link" 
            onClick={() => handleStatusToggle(record)}
          >
            {record.status === 'active' ? '禁用' : '启用'}
          </Button>
          <Button type="link" onClick={() => handleView(record)}>
            查看
          </Button>
        </Space>
      ),
    },
  ];

  const handleStatusToggle = (record: UserData) => {
    message.success(`${record.status === 'active' ? '禁用' : '启用'}成功`);
  };

  const handleView = (record: UserData) => {
    message.info('查看功能开发中');
  };

  const handleSearch = (value: string) => {
    console.log('搜索:', value);
  };

  const handleStatusChange = (value: string) => {
    console.log('状态筛选:', value);
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const pagination: TablePaginationConfig = {
    total: data.length,
    pageSize: 10,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total) => `共 ${total} 条`,
  };

  return (
    <Card>
      <Space style={{ marginBottom: 16 }} size="middle">
        <Search
          placeholder="请输入用户名/手机号"
          onSearch={handleSearch}
          style={{ width: 200 }}
        />
        <Select
          placeholder="用户状态"
          style={{ width: 120 }}
          onChange={handleStatusChange}
        >
          <Option value="active">正常</Option>
          <Option value="inactive">已禁用</Option>
        </Select>
      </Space>

      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={pagination}
        loading={loading}
      />
    </Card>
  );
};

export default UserList; 
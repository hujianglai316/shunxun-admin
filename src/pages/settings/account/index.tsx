import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Space, 
  Input, 
  Select, 
  Tabs, 
  Tag, 
  Modal, 
  Form, 
  message,
  Radio,
  Row,
  Col,
  Tooltip,
  Popconfirm
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  LockOutlined, 
  UnlockOutlined,
  SearchOutlined,
  EyeOutlined
} from '@ant-design/icons';
import type { TableRowSelection } from 'antd/es/table/interface';
import { 
  AdminUser, 
  MerchantUser, 
  UserType, 
  UserStatus, 
  PlatformType,
  AdminUserRole,
  MerchantUserRole
} from '../../../types/user';
import { mockAdminUsers, mockMerchantUsers } from '../../../mock/user';

const { TabPane } = Tabs;
const { Option } = Select;
const { Search } = Input;

const SettingsAccount: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('admin');
  const [loading, setLoading] = useState<boolean>(false);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [merchantUsers, setMerchantUsers] = useState<MerchantUser[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<AdminUser | MerchantUser | null>(null);
  const [userForm] = Form.useForm();
  const [searchParams, setSearchParams] = useState({
    username: '',
    status: '',
    platformType: '',
    merchantId: '',
  });

  // 获取用户数据
  useEffect(() => {
    setLoading(true);
    // 模拟API请求
    setTimeout(() => {
      setAdminUsers(mockAdminUsers);
      setMerchantUsers(mockMerchantUsers);
      setLoading(false);
    }, 500);
  }, []);

  // 处理tab切换
  const handleTabChange = (activeKey: string) => {
    setActiveTab(activeKey);
    setSelectedRowKeys([]);
  };

  // 行选择处理
  const rowSelection: TableRowSelection<AdminUser | MerchantUser> = {
    selectedRowKeys,
    onChange: (selectedKeys) => {
      setSelectedRowKeys(selectedKeys);
    },
  };

  // 搜索处理
  const handleSearch = (value: string) => {
    setSearchParams({
      ...searchParams,
      username: value,
    });
    // 实际项目中应该调用API进行搜索
  };

  // 状态筛选处理
  const handleStatusChange = (value: string) => {
    setSearchParams({
      ...searchParams,
      status: value,
    });
    // 实际项目中应该调用API进行筛选
  };

  // 平台类型筛选处理 (适用于商家用户)
  const handlePlatformChange = (value: string) => {
    setSearchParams({
      ...searchParams,
      platformType: value,
    });
    // 实际项目中应该调用API进行筛选
  };

  // 添加用户
  const handleAddUser = () => {
    setEditingUser(null);
    userForm.resetFields();
    setIsModalVisible(true);
  };

  // 编辑用户
  const handleEditUser = (record: AdminUser | MerchantUser) => {
    setEditingUser(record);
    userForm.setFieldsValue({
      username: record.username,
      nickname: record.nickname,
      phone: record.phone,
      email: record.email,
      status: record.status,
      ...(record.userType === UserType.ADMIN 
        ? { 
            userType: UserType.ADMIN,
            role: (record as AdminUser).role,
            department: (record as AdminUser).department,
            position: (record as AdminUser).position,
          } 
        : { 
            userType: UserType.MERCHANT,
            platformType: (record as MerchantUser).platformType,
            merchantId: (record as MerchantUser).merchantId,
            merchantName: (record as MerchantUser).merchantName,
            role: (record as MerchantUser).role,
          }
      ),
    });
    setIsModalVisible(true);
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await userForm.validateFields();
      console.log('表单数据：', values);
      message.success(editingUser ? '更新用户成功' : '添加用户成功');
      setIsModalVisible(false);
      // 实际项目中应该调用API进行数据操作
    } catch (error) {
      console.error('表单验证失败：', error);
    }
  };

  // 删除用户
  const handleDeleteUser = (id: string) => {
    // 实际项目中应该调用API进行删除
    message.success('删除用户成功');
  };

  // 批量删除用户
  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要删除的用户');
      return;
    }
    // 实际项目中应该调用API进行批量删除
    message.success(`成功删除 ${selectedRowKeys.length} 个用户`);
    setSelectedRowKeys([]);
  };

  // 更改用户状态
  const handleStatusToggle = (record: AdminUser | MerchantUser) => {
    const newStatus = record.status === UserStatus.ACTIVE ? UserStatus.INACTIVE : UserStatus.ACTIVE;
    // 实际项目中应该调用API进行状态更新
    message.success(`${record.status === UserStatus.ACTIVE ? '禁用' : '启用'}用户成功`);
  };

  // 查看用户详情
  const handleViewDetail = (record: AdminUser | MerchantUser) => {
    Modal.info({
      title: '用户详情',
      width: 600,
      content: (
        <div className="p-4">
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <div>用户名：{record.username}</div>
            </Col>
            <Col span={12}>
              <div>昵称：{record.nickname}</div>
            </Col>
            <Col span={12}>
              <div>手机号：{record.phone}</div>
            </Col>
            <Col span={12}>
              <div>邮箱：{record.email}</div>
            </Col>
            <Col span={12}>
              <div>状态：{record.status === UserStatus.ACTIVE ? '正常' : '已禁用'}</div>
            </Col>
            <Col span={12}>
              <div>创建时间：{record.createTime}</div>
            </Col>
            <Col span={12}>
              <div>最后登录：{record.lastLoginTime}</div>
            </Col>
            {record.userType === UserType.ADMIN ? (
              <>
                <Col span={12}>
                  <div>角色：{(record as AdminUser).role}</div>
                </Col>
                <Col span={12}>
                  <div>部门：{(record as AdminUser).department}</div>
                </Col>
                <Col span={12}>
                  <div>职位：{(record as AdminUser).position}</div>
                </Col>
              </>
            ) : (
              <>
                <Col span={12}>
                  <div>商家ID：{(record as MerchantUser).merchantId}</div>
                </Col>
                <Col span={12}>
                  <div>商家名称：{(record as MerchantUser).merchantName}</div>
                </Col>
                <Col span={12}>
                  <div>平台类型：{(record as MerchantUser).platformType === PlatformType.HOTEL ? '酒店' : '租房'}</div>
                </Col>
                <Col span={12}>
                  <div>角色：{(record as MerchantUser).role}</div>
                </Col>
              </>
            )}
          </Row>
        </div>
      ),
      onOk() {},
    });
  };

  // 用户表单内容变化处理
  const handleUserTypeChange = (e: any) => {
    userForm.setFieldsValue({
      role: undefined,
      department: undefined,
      position: undefined,
      platformType: undefined,
      merchantId: undefined,
      merchantName: undefined,
    });
  };

  // 平台管理员用户表格列配置
  const adminColumns = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      render: (text: string, record: AdminUser) => (
        <a onClick={() => handleViewDetail(record)}>{text}</a>
      ),
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
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role: AdminUserRole) => {
        const roleMap = {
          [AdminUserRole.SUPER_ADMIN]: '超级管理员',
          [AdminUserRole.ADMIN]: '管理员',
          [AdminUserRole.AUDITOR]: '审核员',
          [AdminUserRole.FINANCE]: '财务',
          [AdminUserRole.OPERATION]: '运营',
          [AdminUserRole.CUSTOMER_SERVICE]: '客服',
          [AdminUserRole.VIEWER]: '只读用户',
        };
        return roleMap[role] || role;
      },
    },
    {
      title: '部门',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: UserStatus) => (
        <Tag color={status === UserStatus.ACTIVE ? 'success' : 'default'}>
          {status === UserStatus.ACTIVE ? '正常' : '已禁用'}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '最后登录',
      dataIndex: 'lastLoginTime',
      key: 'lastLoginTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: AdminUser) => (
        <Space size="middle">
          <Tooltip title="查看">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleViewDetail(record)}
            />
          </Tooltip>
          <Tooltip title="编辑">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEditUser(record)}
            />
          </Tooltip>
          <Tooltip title={record.status === UserStatus.ACTIVE ? '禁用' : '启用'}>
            <Button
              type="text"
              icon={record.status === UserStatus.ACTIVE ? <LockOutlined /> : <UnlockOutlined />}
              onClick={() => handleStatusToggle(record)}
            />
          </Tooltip>
          <Tooltip title="删除">
            <Popconfirm
              title="确定要删除该用户吗？"
              onConfirm={() => handleDeleteUser(record.id)}
              okText="确定"
              cancelText="取消"
            >
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  // 商家用户表格列配置
  const merchantColumns = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      render: (text: string, record: MerchantUser) => (
        <a onClick={() => handleViewDetail(record)}>{text}</a>
      ),
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
      title: '商家名称',
      dataIndex: 'merchantName',
      key: 'merchantName',
    },
    {
      title: '平台类型',
      dataIndex: 'platformType',
      key: 'platformType',
      render: (type: PlatformType) => (
        type === PlatformType.HOTEL ? '酒店' : '租房'
      ),
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role: MerchantUserRole) => {
        const roleMap = {
          [MerchantUserRole.OWNER]: '店主/业主',
          [MerchantUserRole.MANAGER]: '经理',
          [MerchantUserRole.OPERATOR]: '运营',
          [MerchantUserRole.FINANCE]: '财务',
          [MerchantUserRole.CUSTOMER_SERVICE]: '客服',
        };
        return roleMap[role] || role;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: UserStatus) => (
        <Tag color={status === UserStatus.ACTIVE ? 'success' : 'default'}>
          {status === UserStatus.ACTIVE ? '正常' : '已禁用'}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '最后登录',
      dataIndex: 'lastLoginTime',
      key: 'lastLoginTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: MerchantUser) => (
        <Space size="middle">
          <Tooltip title="查看">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleViewDetail(record)}
            />
          </Tooltip>
          <Tooltip title="编辑">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEditUser(record)}
            />
          </Tooltip>
          <Tooltip title={record.status === UserStatus.ACTIVE ? '禁用' : '启用'}>
            <Button
              type="text"
              icon={record.status === UserStatus.ACTIVE ? <LockOutlined /> : <UnlockOutlined />}
              onClick={() => handleStatusToggle(record)}
            />
          </Tooltip>
          <Tooltip title="删除">
            <Popconfirm
              title="确定要删除该用户吗？"
              onConfirm={() => handleDeleteUser(record.id)}
              okText="确定"
              cancelText="取消"
            >
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  // 渲染搜索工具栏
  const renderToolbar = () => (
    <Space style={{ marginBottom: 16 }} size="middle">
      <Search
        placeholder="请输入用户名/手机号"
        onSearch={handleSearch}
        style={{ width: 220 }}
      />
      <Select
        placeholder="用户状态"
        style={{ width: 120 }}
        onChange={handleStatusChange}
        allowClear
      >
        <Option value={UserStatus.ACTIVE}>正常</Option>
        <Option value={UserStatus.INACTIVE}>已禁用</Option>
      </Select>
      {activeTab === 'merchant' && (
        <Select
          placeholder="平台类型"
          style={{ width: 120 }}
          onChange={handlePlatformChange}
          allowClear
        >
          <Option value={PlatformType.HOTEL}>酒店</Option>
          <Option value={PlatformType.RENTAL}>租房</Option>
        </Select>
      )}
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleAddUser}
      >
        添加用户
      </Button>
      {selectedRowKeys.length > 0 && (
        <Popconfirm
          title={`确定要删除选中的 ${selectedRowKeys.length} 个用户吗？`}
          onConfirm={handleBatchDelete}
          okText="确定"
          cancelText="取消"
        >
          <Button danger>批量删除</Button>
        </Popconfirm>
      )}
    </Space>
  );

  return (
    <Card title="账号管理">
      <Tabs activeKey={activeTab} onChange={handleTabChange}>
        <TabPane tab="平台管理员" key="admin">
          {renderToolbar()}
          <Table
            rowKey="id"
            rowSelection={rowSelection}
            columns={adminColumns}
            dataSource={adminUsers}
            loading={loading}
            pagination={{
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条`,
            }}
          />
        </TabPane>
        <TabPane tab="商家用户" key="merchant">
          {renderToolbar()}
          <Table
            rowKey="id"
            rowSelection={rowSelection}
            columns={merchantColumns}
            dataSource={merchantUsers}
            loading={loading}
            pagination={{
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条`,
            }}
          />
        </TabPane>
      </Tabs>

      {/* 用户表单模态框 */}
      <Modal
        title={editingUser ? '编辑用户' : '添加用户'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        width={700}
      >
        <Form
          form={userForm}
          layout="vertical"
        >
          <Form.Item
            name="userType"
            label="用户类型"
            rules={[{ required: true, message: '请选择用户类型' }]}
            initialValue={editingUser?.userType || UserType.ADMIN}
          >
            <Radio.Group onChange={handleUserTypeChange}>
              <Radio value={UserType.ADMIN}>平台管理员</Radio>
              <Radio value={UserType.MERCHANT}>商家用户</Radio>
            </Radio.Group>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="username"
                label="用户名"
                rules={[{ required: true, message: '请输入用户名' }]}
              >
                <Input placeholder="请输入用户名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="nickname"
                label="昵称"
              >
                <Input placeholder="请输入昵称" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="手机号"
                rules={[{ required: true, message: '请输入手机号' }]}
              >
                <Input placeholder="请输入手机号" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                label="邮箱"
              >
                <Input placeholder="请输入邮箱" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="status"
            label="状态"
            initialValue={UserStatus.ACTIVE}
          >
            <Radio.Group>
              <Radio value={UserStatus.ACTIVE}>正常</Radio>
              <Radio value={UserStatus.INACTIVE}>禁用</Radio>
            </Radio.Group>
          </Form.Item>

          {/* 平台管理员特有字段 */}
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.userType !== currentValues.userType}
          >
            {({ getFieldValue }) => 
              getFieldValue('userType') === UserType.ADMIN ? (
                <>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="role"
                        label="角色"
                        rules={[{ required: true, message: '请选择角色' }]}
                      >
                        <Select placeholder="请选择角色">
                          <Option value={AdminUserRole.SUPER_ADMIN}>超级管理员</Option>
                          <Option value={AdminUserRole.ADMIN}>管理员</Option>
                          <Option value={AdminUserRole.AUDITOR}>审核员</Option>
                          <Option value={AdminUserRole.FINANCE}>财务</Option>
                          <Option value={AdminUserRole.OPERATION}>运营</Option>
                          <Option value={AdminUserRole.CUSTOMER_SERVICE}>客服</Option>
                          <Option value={AdminUserRole.VIEWER}>只读用户</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="department"
                        label="部门"
                      >
                        <Input placeholder="请输入部门" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item
                    name="position"
                    label="职位"
                  >
                    <Input placeholder="请输入职位" />
                  </Form.Item>
                </>
              ) : null
            }
          </Form.Item>

          {/* 商家用户特有字段 */}
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.userType !== currentValues.userType}
          >
            {({ getFieldValue }) => 
              getFieldValue('userType') === UserType.MERCHANT ? (
                <>
                  <Form.Item
                    name="platformType"
                    label="平台类型"
                    rules={[{ required: true, message: '请选择平台类型' }]}
                  >
                    <Radio.Group>
                      <Radio value={PlatformType.HOTEL}>酒店</Radio>
                      <Radio value={PlatformType.RENTAL}>租房</Radio>
                    </Radio.Group>
                  </Form.Item>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="merchantId"
                        label="商家ID"
                        rules={[{ required: true, message: '请输入商家ID' }]}
                      >
                        <Input placeholder="请输入商家ID" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="merchantName"
                        label="商家名称"
                        rules={[{ required: true, message: '请输入商家名称' }]}
                      >
                        <Input placeholder="请输入商家名称" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item
                    name="role"
                    label="角色"
                    rules={[{ required: true, message: '请选择角色' }]}
                  >
                    <Select placeholder="请选择角色">
                      <Option value={MerchantUserRole.OWNER}>店主/业主</Option>
                      <Option value={MerchantUserRole.MANAGER}>经理</Option>
                      <Option value={MerchantUserRole.OPERATOR}>运营</Option>
                      <Option value={MerchantUserRole.FINANCE}>财务</Option>
                      <Option value={MerchantUserRole.CUSTOMER_SERVICE}>客服</Option>
                    </Select>
                  </Form.Item>
                </>
              ) : null
            }
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default SettingsAccount; 
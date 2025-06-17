import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Space, 
  Tag, 
  Modal, 
  Form, 
  Input, 
  message,
  Tree,
  Select,
  Row,
  Col,
  Divider,
  Popconfirm,
  Tooltip,
  Switch
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  KeyOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';
import type { DataNode } from 'antd/es/tree';
import { 
  Role, 
  Permission,
  DataScopeType
} from '../../../types/user';
import { mockRoles } from '../../../mock/user';

const { Option } = Select;
const { TextArea } = Input;

interface PermissionGroup {
  title: string;
  key: string;
  children: DataNode[];
}

// 生成权限树数据
const generatePermissionTree = (): DataNode[] => {
  // 分组权限
  const permissionGroups: Record<string, PermissionGroup> = {
    'merchant': { title: '商家管理', key: 'merchant', children: [] },
    'user': { title: '用户管理', key: 'user', children: [] },
    'order': { title: '订单管理', key: 'order', children: [] },
    'finance': { title: '财务管理', key: 'finance', children: [] },
    'content': { title: '内容管理', key: 'content', children: [] },
    'system': { title: '系统管理', key: 'system', children: [] },
  };
  
  // 按前缀分组
  Object.values(Permission).forEach(permission => {
    const [group] = permission.split(':');
    if (group && permissionGroups[group]) {
      permissionGroups[group].children.push({
        title: getPermissionTitle(permission),
        key: permission,
      });
    }
  });
  
  return Object.values(permissionGroups);
};

// 获取权限的中文描述
const getPermissionTitle = (permission: string): string => {
  const permissionMap: Record<string, string> = {
    [Permission.MERCHANT_VIEW]: '查看商家',
    [Permission.MERCHANT_ADD]: '添加商家',
    [Permission.MERCHANT_EDIT]: '编辑商家',
    [Permission.MERCHANT_DELETE]: '删除商家',
    [Permission.MERCHANT_AUDIT]: '审核商家',
    
    [Permission.USER_VIEW]: '查看用户',
    [Permission.USER_ADD]: '添加用户',
    [Permission.USER_EDIT]: '编辑用户',
    [Permission.USER_DELETE]: '删除用户',
    
    [Permission.ORDER_VIEW]: '查看订单',
    [Permission.ORDER_PROCESS]: '处理订单',
    [Permission.ORDER_REFUND]: '退款操作',
    
    [Permission.FINANCE_VIEW]: '查看财务',
    [Permission.FINANCE_SETTLEMENT]: '结算管理',
    [Permission.FINANCE_INVOICE]: '发票管理',
    [Permission.FINANCE_WITHDRAW]: '提现审核',
    
    [Permission.CONTENT_VIEW]: '查看内容',
    [Permission.CONTENT_ADD]: '添加内容',
    [Permission.CONTENT_EDIT]: '编辑内容',
    [Permission.CONTENT_DELETE]: '删除内容',
    [Permission.CONTENT_AUDIT]: '审核内容',
    
    [Permission.SYSTEM_ACCOUNT]: '账号管理',
    [Permission.SYSTEM_ROLE]: '角色权限',
    [Permission.SYSTEM_CONFIG]: '系统配置',
    [Permission.SYSTEM_LOG]: '系统日志',
  };
  
  return permissionMap[permission] || permission;
};

// 数据权限选项
const dataScopeOptions = [
  { label: '全部数据', value: DataScopeType.ALL },
  { label: '部门数据', value: DataScopeType.DEPARTMENT },
  { label: '部门及以下数据', value: DataScopeType.DEPARTMENT_AND_BELOW },
  { label: '个人数据', value: DataScopeType.PERSONAL },
  { label: '自定义数据', value: DataScopeType.CUSTOM },
];

const SettingsRole: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [currentRole, setCurrentRole] = useState<Role | null>(null);
  const [form] = Form.useForm();
  const [permissionTree] = useState<DataNode[]>(generatePermissionTree());
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(['merchant', 'user', 'order']);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [dataScope, setDataScope] = useState<DataScopeType>(DataScopeType.ALL);
  const [departments, setDepartments] = useState<string[]>([]);
  
  // 模拟部门数据
  const mockDepartments = [
    { id: '1', name: '总部' },
    { id: '2', name: '运营部' },
    { id: '3', name: '市场部' },
    { id: '4', name: '技术部' },
    { id: '5', name: '客服部' },
    { id: '6', name: '财务部' },
  ];

  // 获取角色数据
  useEffect(() => {
    setLoading(true);
    // 模拟API请求
    setTimeout(() => {
      setRoles(mockRoles);
      setLoading(false);
    }, 500);
  }, []);

  // 添加角色
  const handleAddRole = () => {
    setCurrentRole(null);
    form.resetFields();
    setSelectedPermissions([]);
    setDataScope(DataScopeType.ALL);
    setDepartments([]);
    setIsModalVisible(true);
  };

  // 编辑角色
  const handleEditRole = (role: Role) => {
    setCurrentRole(role);
    form.setFieldsValue({
      name: role.name,
      code: role.code,
      description: role.description,
      dataScope: role.dataScope?.type || DataScopeType.ALL,
      departments: role.dataScope?.departments || [],
    });
    setSelectedPermissions(role.permissions);
    setDataScope(role.dataScope?.type || DataScopeType.ALL);
    setDepartments(role.dataScope?.departments || []);
    setIsModalVisible(true);
  };

  // 删除角色
  const handleDeleteRole = (role: Role) => {
    if (role.isDefault) {
      message.error('默认角色不能删除');
      return;
    }
    
    // 实际项目中应调用API删除角色
    message.success(`已删除角色: ${role.name}`);
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const roleData: Partial<Role> = {
        ...values,
        permissions: selectedPermissions,
        dataScope: {
          type: values.dataScope,
          ...(values.dataScope === DataScopeType.CUSTOM ? { departments: values.departments } : {}),
        },
      };
      
      console.log('角色数据:', roleData);
      
      // 实际项目中应调用API保存角色
      message.success(currentRole ? '更新角色成功' : '创建角色成功');
      setIsModalVisible(false);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 处理权限树选择变化
  const handlePermissionChange = (checkedKeys: any) => {
    if (Array.isArray(checkedKeys)) {
      setSelectedPermissions(checkedKeys as string[]);
    } else if (checkedKeys.checked) {
      setSelectedPermissions(checkedKeys.checked as string[]);
    }
  };

  // 处理数据权限变化
  const handleDataScopeChange = (value: DataScopeType) => {
    setDataScope(value);
    if (value !== DataScopeType.CUSTOM) {
      setDepartments([]);
      form.setFieldsValue({ departments: [] });
    }
  };

  // 表格列定义
  const columns = [
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '角色编码',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '说明',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '数据权限',
      dataIndex: 'dataScope',
      key: 'dataScope',
      render: (dataScope: { type: DataScopeType }) => {
        const scopeMap = {
          [DataScopeType.ALL]: '全部数据',
          [DataScopeType.DEPARTMENT]: '部门数据',
          [DataScopeType.DEPARTMENT_AND_BELOW]: '部门及以下数据',
          [DataScopeType.PERSONAL]: '个人数据',
          [DataScopeType.CUSTOM]: '自定义数据',
        };
        return scopeMap[dataScope?.type] || '全部数据';
      },
    },
    {
      title: '默认角色',
      dataIndex: 'isDefault',
      key: 'isDefault',
      render: (isDefault: boolean) => (
        <Switch checked={isDefault} disabled />
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Role) => (
        <Space size="middle">
          <Tooltip title="编辑">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEditRole(record)}
            />
          </Tooltip>
          <Tooltip title="权限配置">
            <Button
              type="text"
              icon={<KeyOutlined />}
              onClick={() => handleEditRole(record)}
            />
          </Tooltip>
          <Tooltip title="删除">
            <Popconfirm
              title="确定要删除该角色吗？"
              onConfirm={() => handleDeleteRole(record)}
              okText="确定"
              cancelText="取消"
              disabled={record.isDefault}
            >
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                disabled={record.isDefault}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Card 
      title="角色权限管理" 
      extra={
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={handleAddRole}
        >
          新增角色
        </Button>
      }
    >
      <Table
        rowKey="id"
        columns={columns}
        dataSource={roles}
        loading={loading}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`,
        }}
      />

      {/* 角色表单对话框 */}
      <Modal
        title={currentRole ? '编辑角色' : '新增角色'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        width={800}
        bodyStyle={{ maxHeight: '70vh', overflowY: 'auto' }}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="角色名称"
                rules={[{ required: true, message: '请输入角色名称' }]}
              >
                <Input placeholder="请输入角色名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="code"
                label="角色编码"
                rules={[{ required: true, message: '请输入角色编码' }]}
              >
                <Input placeholder="请输入角色编码" />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="description"
            label="角色描述"
          >
            <TextArea rows={2} placeholder="请输入角色描述" />
          </Form.Item>
          
          <Divider>功能权限</Divider>
          
          <Form.Item
            label={
              <span>
                功能权限
                <Tooltip title="为该角色分配功能操作权限">
                  <QuestionCircleOutlined style={{ marginLeft: 4 }} />
                </Tooltip>
              </span>
            }
          >
            <Tree
              checkable
              selectable={false}
              checkedKeys={selectedPermissions}
              onCheck={handlePermissionChange}
              treeData={permissionTree}
              defaultExpandedKeys={expandedKeys}
              height={300}
            />
          </Form.Item>
          
          <Divider>数据权限</Divider>
          
          <Form.Item
            name="dataScope"
            label={
              <span>
                数据权限范围
                <Tooltip title="配置该角色可以访问的数据范围">
                  <QuestionCircleOutlined style={{ marginLeft: 4 }} />
                </Tooltip>
              </span>
            }
            initialValue={DataScopeType.ALL}
          >
            <Select onChange={handleDataScopeChange}>
              {dataScopeOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          
          {dataScope === DataScopeType.CUSTOM && (
            <Form.Item
              name="departments"
              label="自定义部门"
              rules={[{ required: true, message: '请选择部门' }]}
            >
              <Select
                mode="multiple"
                placeholder="请选择部门"
                style={{ width: '100%' }}
              >
                {mockDepartments.map(dept => (
                  <Option key={dept.id} value={dept.id}>
                    {dept.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}
          
          <Form.Item
            name="isDefault"
            valuePropName="checked"
            initialValue={false}
          >
            <Space>
              <Switch disabled={currentRole?.isDefault} />
              <span>设为默认角色</span>
              <Tooltip title="默认角色不可删除且新用户将默认分配此角色">
                <QuestionCircleOutlined />
              </Tooltip>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default SettingsRole; 
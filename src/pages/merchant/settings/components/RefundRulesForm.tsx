import React, { useState } from 'react';
import { Form, Input, Button, Space, Table, Switch, Modal, InputNumber } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { RefundRule } from '../../../../types/merchant';

const { TextArea } = Input;

interface RefundRulesFormProps {
  data: RefundRule[];
  onSave: (values: RefundRule[]) => Promise<void>;
  loading?: boolean;
}

const RefundRulesForm: React.FC<RefundRulesFormProps> = ({
  data,
  onSave,
  loading = false,
}) => {
  const [rules, setRules] = useState<RefundRule[]>(data);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRule, setEditingRule] = useState<RefundRule | null>(null);
  const [form] = Form.useForm();

  const handleSave = async () => {
    await onSave(rules);
  };

  const handleAdd = () => {
    setEditingRule(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: RefundRule) => {
    setEditingRule(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条退款规则吗？',
      onOk: () => {
        setRules(rules.filter(item => item.id !== id));
      },
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingRule) {
        setRules(
          rules.map(item =>
            item.id === editingRule.id ? { ...item, ...values } : item
          )
        );
      } else {
        const newRule: RefundRule = {
          id: Math.max(...rules.map(r => r.id), 0) + 1,
          ...values,
          isEnabled: true,
        };
        setRules([...rules, newRule]);
      }
      setModalVisible(false);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleStatusChange = (id: number, isEnabled: boolean) => {
    setRules(
      rules.map(item =>
        item.id === id ? { ...item, isEnabled } : item
      )
    );
  };

  const formatPercentage = (value: number | undefined): string => {
    if (value === undefined) return '';
    return `${(value * 100).toFixed(0)}%`;
  };

  const parsePercentage = (value: string | undefined): number => {
    if (!value) return 0;
    return Number(value.replace('%', '')) / 100;
  };

  const columns = [
    {
      title: '规则名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '时间限制',
      dataIndex: 'timeLimit',
      key: 'timeLimit',
      render: (timeLimit: number) => `${timeLimit}小时`,
    },
    {
      title: '退款比例',
      dataIndex: 'refundRate',
      key: 'refundRate',
      render: (refundRate: number) => `${refundRate * 100}%`,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'isEnabled',
      key: 'isEnabled',
      render: (isEnabled: boolean, record: RefundRule) => (
        <Switch
          checked={isEnabled}
          onChange={(checked) => handleStatusChange(record.id, checked)}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: RefundRule) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          添加规则
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={rules}
        rowKey="id"
        pagination={false}
      />

      <div style={{ marginTop: 16 }}>
        <Button type="primary" onClick={handleSave} loading={loading}>
          保存
        </Button>
      </div>

      <Modal
        title={editingRule ? '编辑退款规则' : '添加退款规则'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="规则名称"
            rules={[
              { required: true, message: '请输入规则名称' },
              { max: 50, message: '规则名称不能超过50个字符' },
            ]}
          >
            <Input placeholder="请输入规则名称" />
          </Form.Item>

          <Form.Item
            name="timeLimit"
            label="时间限制（小时）"
            rules={[
              { required: true, message: '请输入时间限制' },
              { type: 'number', min: 0, message: '时间限制不能小于0' },
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="请输入时间限制"
              min={0}
              step={1}
            />
          </Form.Item>

          <Form.Item
            name="refundRate"
            label="退款比例"
            rules={[
              { required: true, message: '请输入退款比例' },
              { type: 'number', min: 0, max: 1, message: '退款比例必须在0-1之间' },
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="请输入退款比例"
              min={0}
              max={1}
              step={0.1}
              formatter={formatPercentage}
              parser={parsePercentage}
            />
          </Form.Item>

          <Form.Item
            name="description"
            label="规则描述"
            rules={[
              { required: true, message: '请输入规则描述' },
              { max: 200, message: '规则描述不能超过200个字符' },
            ]}
          >
            <TextArea
              rows={3}
              placeholder="请输入规则描述"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RefundRulesForm; 
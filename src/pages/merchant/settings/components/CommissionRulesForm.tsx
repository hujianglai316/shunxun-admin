import React, { useState } from 'react';
import { Form, Input, Button, Space, Table, Switch, Modal, InputNumber, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { CommissionRule } from '../../../../types/merchant';

const { TextArea } = Input;
const { Option } = Select;

interface CommissionRulesFormProps {
  data: CommissionRule[];
  onSave: (values: CommissionRule[]) => Promise<void>;
  loading?: boolean;
}

const conditionTypes = [
  { value: 'order_amount', label: '订单金额' },
  { value: 'order_count', label: '订单数量' },
  { value: 'customer_level', label: '客户等级' },
];

const CommissionRulesForm: React.FC<CommissionRulesFormProps> = ({
  data,
  onSave,
  loading = false,
}) => {
  const [rules, setRules] = useState<CommissionRule[]>(data);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRule, setEditingRule] = useState<CommissionRule | null>(null);
  const [form] = Form.useForm();

  const handleSave = async () => {
    await onSave(rules);
  };

  const handleAdd = () => {
    setEditingRule(null);
    form.resetFields();
    form.setFieldsValue({
      conditions: [{}],
    });
    setModalVisible(true);
  };

  const handleEdit = (record: CommissionRule) => {
    setEditingRule(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条佣金规则吗？',
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
        const newRule: CommissionRule = {
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

  const formatCurrency = (value: number | undefined): string => {
    if (value === undefined) return '';
    return `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const parseCurrency = (value: string | undefined): number => {
    if (!value) return 0;
    return Number(value.replace(/[¥\s,]/g, ''));
  };

  const formatPercentage = (value: number | undefined): string => {
    if (value === undefined) return '';
    return `${(value * 100).toFixed(1)}%`;
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
      title: '基础佣金比例',
      dataIndex: 'baseRate',
      key: 'baseRate',
      render: (baseRate: number) => `${(baseRate * 100).toFixed(1)}%`,
    },
    {
      title: '最低佣金',
      dataIndex: 'minAmount',
      key: 'minAmount',
      render: (amount: number) => `¥${amount.toFixed(2)}`,
    },
    {
      title: '最高佣金',
      dataIndex: 'maxAmount',
      key: 'maxAmount',
      render: (amount: number) => `¥${amount.toFixed(2)}`,
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
      render: (isEnabled: boolean, record: CommissionRule) => (
        <Switch
          checked={isEnabled}
          onChange={(checked) => handleStatusChange(record.id, checked)}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: CommissionRule) => (
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
        title={editingRule ? '编辑佣金规则' : '添加佣金规则'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        destroyOnClose
        width={800}
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
            name="baseRate"
            label="基础佣金比例"
            rules={[
              { required: true, message: '请输入基础佣金比例' },
              { type: 'number', min: 0, max: 1, message: '佣金比例必须在0-1之间' },
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="请输入基础佣金比例"
              min={0}
              max={1}
              step={0.01}
              formatter={formatPercentage}
              parser={parsePercentage}
            />
          </Form.Item>

          <Space style={{ width: '100%' }} size={16}>
            <Form.Item
              name="minAmount"
              label="最低佣金"
              rules={[
                { required: true, message: '请输入最低佣金' },
                { type: 'number', min: 0, message: '最低佣金不能小于0' },
              ]}
              style={{ width: '100%' }}
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="请输入最低佣金"
                min={0}
                step={1}
                formatter={formatCurrency}
                parser={parseCurrency}
              />
            </Form.Item>

            <Form.Item
              name="maxAmount"
              label="最高佣金"
              rules={[
                { required: true, message: '请输入最高佣金' },
                { type: 'number', min: 0, message: '最高佣金不能小于0' },
              ]}
              style={{ width: '100%' }}
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="请输入最高佣金"
                min={0}
                step={1}
                formatter={formatCurrency}
                parser={parseCurrency}
              />
            </Form.Item>
          </Space>

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

          <Form.List name="conditions">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item
                      {...field}
                      name={[field.name, 'type']}
                      rules={[{ required: true, message: '请选择条件类型' }]}
                    >
                      <Select style={{ width: 120 }} placeholder="条件类型">
                        {conditionTypes.map(type => (
                          <Option key={type.value} value={type.value}>
                            {type.label}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <Form.Item
                      {...field}
                      name={[field.name, 'value']}
                      rules={[{ required: true, message: '请输入条件值' }]}
                    >
                      <InputNumber
                        style={{ width: 120 }}
                        placeholder="条件值"
                        min={0}
                      />
                    </Form.Item>

                    <Form.Item
                      {...field}
                      name={[field.name, 'rate']}
                      rules={[
                        { required: true, message: '请输入佣金比例' },
                        { type: 'number', min: 0, max: 1, message: '佣金比例必须在0-1之间' },
                      ]}
                    >
                      <InputNumber
                        style={{ width: 120 }}
                        placeholder="佣金比例"
                        min={0}
                        max={1}
                        step={0.01}
                        formatter={formatPercentage}
                        parser={parsePercentage}
                      />
                    </Form.Item>

                    {fields.length > 1 && (
                      <Button type="link" danger onClick={() => remove(field.name)}>
                        删除
                      </Button>
                    )}
                  </Space>
                ))}

                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    添加条件
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>
    </div>
  );
};

export default CommissionRulesForm; 
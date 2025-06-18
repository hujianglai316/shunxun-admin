import React from 'react';
import { Form, InputNumber, Button, Space, Select } from 'antd';
import type { MerchantSettings } from '../../../../types/merchant';

const { Option } = Select;

interface PaymentSettingsFormProps {
  data: MerchantSettings['paymentSettings'];
  onSave: (values: MerchantSettings['paymentSettings']) => Promise<void>;
  loading?: boolean;
}

const paymentMethods = [
  { value: 'alipay', label: '支付宝' },
  { value: 'wechat', label: '微信支付' },
  { value: 'creditcard', label: '信用卡' },
  { value: 'unionpay', label: '银联' },
];

const PaymentSettingsForm: React.FC<PaymentSettingsFormProps> = ({
  data,
  onSave,
  loading = false,
}) => {
  const [form] = Form.useForm();

  const handleSubmit = async (values: MerchantSettings['paymentSettings']) => {
    await onSave(values);
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
    return `${(value * 100).toFixed(0)}%`;
  };

  const parsePercentage = (value: string | undefined): number => {
    if (!value) return 0;
    return Number(value.replace('%', '')) / 100;
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={data}
      onFinish={handleSubmit}
      style={{ maxWidth: 600 }}
    >
      <Form.Item
        name="supportedMethods"
        label="支持的支付方式"
        rules={[
          { required: true, message: '请选择支付方式' },
          { type: 'array', min: 1, message: '至少选择一种支付方式' },
        ]}
      >
        <Select
          mode="multiple"
          placeholder="请选择支付方式"
          style={{ width: '100%' }}
        >
          {paymentMethods.map(method => (
            <Option key={method.value} value={method.value}>
              {method.label}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="minDeposit"
        label="最低订金金额"
        rules={[
          { required: true, message: '请输入最低订金金额' },
          { type: 'number', min: 0, message: '最低订金金额不能小于0' },
        ]}
      >
        <InputNumber
          style={{ width: '100%' }}
          placeholder="请输入最低订金金额"
          min={0}
          step={1}
          formatter={formatCurrency}
          parser={parseCurrency}
        />
      </Form.Item>

      <Form.Item
        name="depositRate"
        label="订金比例"
        rules={[
          { required: true, message: '请输入订金比例' },
          { type: 'number', min: 0, max: 1, message: '订金比例必须在0-1之间' },
        ]}
        extra="订金占总房费的比例"
      >
        <InputNumber
          style={{ width: '100%' }}
          placeholder="请输入订金比例"
          min={0}
          max={1}
          step={0.1}
          formatter={formatPercentage}
          parser={parsePercentage}
        />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={loading}>
            保存
          </Button>
          <Button onClick={() => form.resetFields()}>重置</Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default PaymentSettingsForm; 
import React from 'react';
import { Form, InputNumber, Button, Modal, Select, message } from 'antd';
import type { MerchantAccount, SettlementCycle } from '../../../../types/finance';

interface SettlementFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: SettlementFormData) => Promise<void>;
  account: MerchantAccount;
  loading?: boolean;
}

interface SettlementFormData {
  settlementCycle: SettlementCycle;
  commissionRate: number;
  minWithdrawalAmount: number;
}

const { Option } = Select;

const SettlementForm: React.FC<SettlementFormProps> = ({
  visible,
  onCancel,
  onSubmit,
  account,
  loading,
}) => {
  const [form] = Form.useForm<SettlementFormData>();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit(values);
      form.resetFields();
    } catch (error) {
      console.error('保存结算设置失败:', error);
    }
  };

  // 格式化百分比
  const formatPercentage = (value: number | undefined): string => {
    if (value === undefined) return '';
    return `${value}%`;
  };

  // 解析百分比
  const parsePercentage = (value: string | undefined): number => {
    if (!value) return 0;
    return Number(value.replace('%', ''));
  };

  return (
    <Modal
      title="结算设置"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          取消
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>
          保存
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          settlementCycle: account.settlementCycle,
          commissionRate: account.commissionRate * 100,
          minWithdrawalAmount: account.minWithdrawalAmount,
        }}
      >
        <Form.Item
          label="结算周期"
          name="settlementCycle"
          rules={[{ required: true, message: '请选择结算周期' }]}
        >
          <Select>
            <Option value="DAILY">日结（T+1）</Option>
            <Option value="WEEKLY">周结（每周一结算上周）</Option>
            <Option value="MONTHLY">月结（每月1号结算上月）</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="平台佣金比例"
          name="commissionRate"
          rules={[
            { required: true, message: '请输入佣金比例' },
            { type: 'number', min: 0, max: 100, message: '佣金比例必须在0-100之间' },
          ]}
          extra="请输入0-100之间的数字，代表百分比"
        >
          <InputNumber
            style={{ width: '100%' }}
            min={0}
            max={100}
            precision={1}
            formatter={formatPercentage}
            parser={parsePercentage}
          />
        </Form.Item>

        <Form.Item
          label="最小提现金额"
          name="minWithdrawalAmount"
          rules={[
            { required: true, message: '请输入最小提现金额' },
            { type: 'number', min: 0, message: '最小提现金额不能小于0' },
          ]}
        >
          <InputNumber
            style={{ width: '100%' }}
            min={0}
            precision={2}
            prefix="¥"
          />
        </Form.Item>

        <div style={{ marginTop: 16 }}>
          <h4>结算规则说明：</h4>
          <ul>
            <li>日结：订单完成后次日可提现</li>
            <li>周结：每周一统一结算上周（周一至周日）的订单</li>
            <li>月结：每月1号统一结算上月的订单</li>
            <li>结算金额 = 订单金额 × (1 - 佣金比例)</li>
            <li>修改结算设置后，将从下一个结算周期开始生效</li>
          </ul>
        </div>
      </Form>
    </Modal>
  );
};

export default SettlementForm; 
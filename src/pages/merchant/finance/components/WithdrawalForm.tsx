import React from 'react';
import { Form, Input, Button, InputNumber, Modal, message } from 'antd';
import type { MerchantAccount } from '../../../../types/finance';

interface WithdrawalFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: WithdrawalFormData) => Promise<void>;
  account: MerchantAccount;
  loading?: boolean;
}

interface WithdrawalFormData {
  amount: number;
  remark?: string;
}

const WithdrawalForm: React.FC<WithdrawalFormProps> = ({
  visible,
  onCancel,
  onSubmit,
  account,
  loading,
}) => {
  const [form] = Form.useForm<WithdrawalFormData>();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (values.amount > account.balance) {
        message.error('提现金额不能大于可用余额');
        return;
      }
      if (values.amount < account.minWithdrawalAmount) {
        message.error(`提现金额不能小于最低提现金额：¥${account.minWithdrawalAmount}`);
        return;
      }
      await onSubmit(values);
      form.resetFields();
    } catch (error) {
      console.error('提现申请失败:', error);
    }
  };

  return (
    <Modal
      title="提现申请"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          取消
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>
          提交
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ amount: account.minWithdrawalAmount }}
      >
        <Form.Item
          label="可用余额"
        >
          <div>¥{account.balance.toFixed(2)}</div>
        </Form.Item>

        <Form.Item
          label="提现金额"
          name="amount"
          rules={[
            { required: true, message: '请输入提现金额' },
            {
              type: 'number',
              min: account.minWithdrawalAmount,
              message: `最低提现金额为 ¥${account.minWithdrawalAmount}`,
            },
            {
              type: 'number',
              max: account.balance,
              message: '提现金额不能大于可用余额',
            },
          ]}
        >
          <InputNumber
            style={{ width: '100%' }}
            precision={2}
            min={account.minWithdrawalAmount}
            max={account.balance}
            prefix="¥"
          />
        </Form.Item>

        <Form.Item
          label="备注"
          name="remark"
          rules={[{ max: 100, message: '备注不能超过100个字符' }]}
        >
          <Input.TextArea
            rows={4}
            placeholder="请输入备注信息（选填）"
            maxLength={100}
            showCount
          />
        </Form.Item>

        <div style={{ marginTop: 16 }}>
          <h4>提现说明：</h4>
          <ul>
            <li>最低提现金额：¥{account.minWithdrawalAmount}</li>
            <li>提现金额必须为整数</li>
            <li>提现申请提交后将进入审核状态</li>
            <li>审核通过后，资金将在1-3个工作日内到账</li>
            <li>如有疑问，请联系客服</li>
          </ul>
        </div>
      </Form>
    </Modal>
  );
};

export default WithdrawalForm; 
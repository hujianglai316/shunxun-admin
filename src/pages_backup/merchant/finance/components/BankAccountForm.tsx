import React from 'react';
import { Form, Input, Button, Modal, Select, message } from 'antd';
import type { BankAccount } from '../../../../types/finance';

interface BankAccountFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: BankAccount) => Promise<void>;
  initialValues?: BankAccount;
  loading?: boolean;
}

const { Option } = Select;

// 模拟银行列表数据
const BANK_LIST = [
  { code: 'ICBC', name: '工商银行' },
  { code: 'ABC', name: '农业银行' },
  { code: 'BOC', name: '中国银行' },
  { code: 'CCB', name: '建设银行' },
  { code: 'CMBC', name: '民生银行' },
  { code: 'CEB', name: '光大银行' },
  { code: 'CITIC', name: '中信银行' },
  { code: 'SPDB', name: '浦发银行' },
];

// 模拟省份数据
const PROVINCES = [
  '北京市', '上海市', '广东省', '江苏省', '浙江省', '山东省',
  '河南省', '四川省', '湖北省', '湖南省', '河北省', '福建省',
];

// 模拟城市数据（简化版）
const CITIES: Record<string, string[]> = {
  '北京市': ['北京市'],
  '上海市': ['上海市'],
  '广东省': ['广州市', '深圳市', '珠海市', '佛山市', '东莞市'],
  '江苏省': ['南京市', '苏州市', '无锡市', '常州市', '南通市'],
  // ... 其他省份的城市数据
};

const BankAccountForm: React.FC<BankAccountFormProps> = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
  loading,
}) => {
  const [form] = Form.useForm();
  const [selectedProvince, setSelectedProvince] = React.useState(initialValues?.province || '');

  const handleProvinceChange = (value: string) => {
    setSelectedProvince(value);
    form.setFieldValue('city', undefined);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      // 验证银行卡号
      if (!/^\d{16,19}$/.test(values.accountNumber)) {
        message.error('请输入正确的银行卡号');
        return;
      }
      await onSubmit(values);
      form.resetFields();
    } catch (error) {
      console.error('保存银行账户信息失败:', error);
    }
  };

  return (
    <Modal
      title="银行账户信息"
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
        initialValues={initialValues}
      >
        <Form.Item
          label="开户名"
          name="accountName"
          rules={[
            { required: true, message: '请输入开户名' },
            { max: 50, message: '开户名不能超过50个字符' },
          ]}
        >
          <Input placeholder="请输入开户名（需与身份证姓名一致）" />
        </Form.Item>

        <Form.Item
          label="开户银行"
          name="bankName"
          rules={[{ required: true, message: '请选择开户银行' }]}
        >
          <Select placeholder="请选择开户银行">
            {BANK_LIST.map(bank => (
              <Option key={bank.code} value={bank.name}>
                {bank.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="开户省份"
          name="province"
          rules={[{ required: true, message: '请选择开户省份' }]}
        >
          <Select 
            placeholder="请选择省份"
            onChange={handleProvinceChange}
          >
            {PROVINCES.map(province => (
              <Option key={province} value={province}>
                {province}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="开户城市"
          name="city"
          rules={[{ required: true, message: '请选择开户城市' }]}
        >
          <Select placeholder="请选择城市" disabled={!selectedProvince}>
            {selectedProvince && CITIES[selectedProvince]?.map(city => (
              <Option key={city} value={city}>
                {city}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="支行名称"
          name="bankBranch"
          rules={[
            { required: true, message: '请输入支行名称' },
            { max: 50, message: '支行名称不能超过50个字符' },
          ]}
        >
          <Input placeholder="请输入详细的支行名称" />
        </Form.Item>

        <Form.Item
          label="银行账号"
          name="accountNumber"
          rules={[
            { required: true, message: '请输入银行账号' },
            { pattern: /^\d{16,19}$/, message: '请输入正确的银行卡号' },
          ]}
        >
          <Input placeholder="请输入银行账号" />
        </Form.Item>

        <div style={{ marginTop: 16 }}>
          <h4>温馨提示：</h4>
          <ul>
            <li>请确保填写的银行账户信息准确无误</li>
            <li>银行账户信息将用于收款，请填写对公账户或法人账户</li>
            <li>如需修改银行账户信息，请联系客服进行人工审核</li>
          </ul>
        </div>
      </Form>
    </Modal>
  );
};

export default BankAccountForm; 
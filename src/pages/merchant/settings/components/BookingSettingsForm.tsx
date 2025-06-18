import React from 'react';
import { Form, InputNumber, Button, Space, TimePicker } from 'antd';
import type { MerchantSettings } from '../../../../types/merchant';
import dayjs, { Dayjs } from 'dayjs';

interface BookingSettingsFormProps {
  data: MerchantSettings['bookingSettings'];
  onSave: (values: MerchantSettings['bookingSettings']) => Promise<void>;
  loading?: boolean;
}

interface BookingSettingsFormValues extends Omit<MerchantSettings['bookingSettings'], 'checkInTime' | 'checkOutTime'> {
  checkInTime: Dayjs;
  checkOutTime: Dayjs;
}

const BookingSettingsForm: React.FC<BookingSettingsFormProps> = ({
  data,
  onSave,
  loading = false,
}) => {
  const [form] = Form.useForm<BookingSettingsFormValues>();

  const handleSubmit = async (values: BookingSettingsFormValues) => {
    const formattedValues: MerchantSettings['bookingSettings'] = {
      ...values,
      checkInTime: values.checkInTime.format('HH:mm'),
      checkOutTime: values.checkOutTime.format('HH:mm'),
    };
    await onSave(formattedValues);
  };

  const initialValues: BookingSettingsFormValues = {
    ...data,
    checkInTime: dayjs(data.checkInTime, 'HH:mm'),
    checkOutTime: dayjs(data.checkOutTime, 'HH:mm'),
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={handleSubmit}
      style={{ maxWidth: 600 }}
    >
      <Form.Item
        name="minAdvanceHours"
        label="最短提前预订时间（小时）"
        rules={[
          { required: true, message: '请输入最短提前预订时间' },
          { type: 'number', min: 0, message: '时间不能小于0' },
        ]}
        extra="提前多少小时可以预订"
      >
        <InputNumber
          style={{ width: '100%' }}
          placeholder="请输入小时数"
          min={0}
          step={1}
        />
      </Form.Item>

      <Form.Item
        name="maxAdvanceDays"
        label="最长提前预订时间（天）"
        rules={[
          { required: true, message: '请输入最长提前预订时间' },
          { type: 'number', min: 1, message: '时间不能小于1天' },
        ]}
        extra="最多可以提前多少天预订"
      >
        <InputNumber
          style={{ width: '100%' }}
          placeholder="请输入天数"
          min={1}
          step={1}
        />
      </Form.Item>

      <Form.Item
        name="minStayHours"
        label="最短入住时间（小时）"
        rules={[
          { required: true, message: '请输入最短入住时间' },
          { type: 'number', min: 1, message: '时间不能小于1小时' },
        ]}
      >
        <InputNumber
          style={{ width: '100%' }}
          placeholder="请输入小时数"
          min={1}
          step={1}
        />
      </Form.Item>

      <Form.Item
        name="maxStayDays"
        label="最长入住时间（天）"
        rules={[
          { required: true, message: '请输入最长入住时间' },
          { type: 'number', min: 1, message: '时间不能小于1天' },
        ]}
      >
        <InputNumber
          style={{ width: '100%' }}
          placeholder="请输入天数"
          min={1}
          step={1}
        />
      </Form.Item>

      <Form.Item
        name="checkInTime"
        label="最早入住时间"
        rules={[{ required: true, message: '请选择最早入住时间' }]}
      >
        <TimePicker
          style={{ width: '100%' }}
          format="HH:mm"
          minuteStep={30}
        />
      </Form.Item>

      <Form.Item
        name="checkOutTime"
        label="最晚退房时间"
        rules={[{ required: true, message: '请选择最晚退房时间' }]}
      >
        <TimePicker
          style={{ width: '100%' }}
          format="HH:mm"
          minuteStep={30}
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

export default BookingSettingsForm; 
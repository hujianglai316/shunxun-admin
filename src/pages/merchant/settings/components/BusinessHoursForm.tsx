import React from 'react';
import { Form, TimePicker, Switch, Button, Space, Card } from 'antd';
import type { BusinessHours } from '../../../../types/merchant';
import dayjs from 'dayjs';

interface BusinessHoursFormProps {
  data: BusinessHours[];
  onSave: (values: BusinessHours[]) => Promise<void>;
  loading?: boolean;
}

const weekdayNames = [
  '周一', '周二', '周三', '周四', '周五', '周六', '周日'
];

const BusinessHoursForm: React.FC<BusinessHoursFormProps> = ({
  data,
  onSave,
  loading = false,
}) => {
  const [form] = Form.useForm();

  const handleSubmit = async (values: { businessHours: BusinessHours[] }) => {
    await onSave(values.businessHours);
  };

  const initialValues = {
    businessHours: data.map(item => ({
      ...item,
      openTime: item.openTime ? dayjs(item.openTime, 'HH:mm') : null,
      closeTime: item.closeTime ? dayjs(item.closeTime, 'HH:mm') : null,
    })),
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={handleSubmit}
    >
      <Form.List name="businessHours">
        {(fields) => (
          <>
            {fields.map((field, index) => (
              <Card
                key={field.key}
                size="small"
                title={weekdayNames[index]}
                style={{ marginBottom: 16 }}
              >
                <Form.Item
                  {...field}
                  name={[field.name, 'isOpen']}
                  valuePropName="checked"
                  style={{ marginBottom: 16 }}
                >
                  <Switch
                    checkedChildren="营业"
                    unCheckedChildren="休息"
                  />
                </Form.Item>

                <Form.Item
                  noStyle
                  shouldUpdate={(prevValues, currentValues) => {
                    const prev = prevValues.businessHours[index]?.isOpen;
                    const curr = currentValues.businessHours[index]?.isOpen;
                    return prev !== curr;
                  }}
                >
                  {({ getFieldValue }) => {
                    const isOpen = getFieldValue(['businessHours', field.name, 'isOpen']);
                    return isOpen ? (
                      <Space>
                        <Form.Item
                          {...field}
                          name={[field.name, 'openTime']}
                          label="开始时间"
                          rules={[{ required: true, message: '请选择开始时间' }]}
                        >
                          <TimePicker format="HH:mm" />
                        </Form.Item>
                        <Form.Item
                          {...field}
                          name={[field.name, 'closeTime']}
                          label="结束时间"
                          rules={[{ required: true, message: '请选择结束时间' }]}
                        >
                          <TimePicker format="HH:mm" />
                        </Form.Item>
                      </Space>
                    ) : null;
                  }}
                </Form.Item>
              </Card>
            ))}
          </>
        )}
      </Form.List>

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

export default BusinessHoursForm; 
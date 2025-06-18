import React from 'react';
import { Form, Radio, Input, Button, Space, Alert } from 'antd';
import type { ReviewRecord } from '../../../../types/merchant';
import { ReviewStatus } from '../../../../types/merchant';

const { TextArea } = Input;

interface AuditFormProps {
  review: ReviewRecord;
  onSubmit: (values: { status: ReviewStatus; reason?: string }) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const AuditForm: React.FC<AuditFormProps> = ({
  review,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [form] = Form.useForm();

  const handleSubmit = async (values: { status: ReviewStatus; reason?: string }) => {
    await onSubmit(values);
    form.resetFields();
  };

  return (
    <div>
      <Alert
        type="info"
        message="审核提示"
        description={
          <ul style={{ margin: 0, paddingLeft: 16 }}>
            <li>请仔细审核评价内容是否合规</li>
            <li>如果拒绝，请填写拒绝原因</li>
            <li>审核后将无法修改，请谨慎操作</li>
          </ul>
        }
        style={{ marginBottom: 24 }}
      />

      <div style={{ marginBottom: 24, background: '#f5f5f5', padding: 16 }}>
        <div style={{ marginBottom: 8 }}>
          <span style={{ color: '#666' }}>用户评价：</span>
          {review.content}
        </div>
        {review.images && review.images.length > 0 && (
          <div style={{ marginTop: 8 }}>
            <span style={{ color: '#666' }}>评价图片：</span>
            <Space size={8}>
              {review.images.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`评价图片${index + 1}`}
                  style={{
                    width: 64,
                    height: 64,
                    objectFit: 'cover',
                  }}
                />
              ))}
            </Space>
          </div>
        )}
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ status: ReviewStatus.APPROVED }}
      >
        <Form.Item
          name="status"
          label="审核结果"
          rules={[{ required: true, message: '请选择审核结果' }]}
        >
          <Radio.Group>
            <Radio value={ReviewStatus.APPROVED}>通过</Radio>
            <Radio value={ReviewStatus.REJECTED}>拒绝</Radio>
            <Radio value={ReviewStatus.HIDDEN}>隐藏</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) =>
            prevValues?.status !== currentValues?.status
          }
        >
          {({ getFieldValue }) =>
            getFieldValue('status') !== ReviewStatus.APPROVED && (
              <Form.Item
                name="reason"
                label="原因"
                rules={[
                  { required: true, message: '请输入原因' },
                  { min: 10, message: '原因不能少于10个字符' },
                  { max: 500, message: '原因不能超过500个字符' },
                ]}
              >
                <TextArea
                  rows={4}
                  placeholder="请输入原因"
                  maxLength={500}
                  showCount
                />
              </Form.Item>
            )
          }
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              提交审核
            </Button>
            <Button onClick={onCancel}>取消</Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AuditForm; 
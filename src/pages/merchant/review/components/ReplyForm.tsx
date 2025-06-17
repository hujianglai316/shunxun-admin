import React from 'react';
import { Form, Input, Button, Space, Alert } from 'antd';
import type { ReviewRecord } from '../../../../types/merchant';

const { TextArea } = Input;

interface ReplyFormProps {
  review: ReviewRecord;
  onSubmit: (content: string) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const ReplyForm: React.FC<ReplyFormProps> = ({
  review,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [form] = Form.useForm();

  const handleSubmit = async (values: { content: string }) => {
    await onSubmit(values.content);
    form.resetFields();
  };

  return (
    <div>
      <Alert
        type="info"
        message="回复提示"
        description={
          <ul style={{ margin: 0, paddingLeft: 16 }}>
            <li>请保持专业、礼貌的回复态度</li>
            <li>回复内容将公开显示给所有用户</li>
            <li>回复后将无法修改，请仔细检查内容</li>
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
      >
        <Form.Item
          name="content"
          label="回复内容"
          rules={[
            { required: true, message: '请输入回复内容' },
            { min: 10, message: '回复内容不能少于10个字符' },
            { max: 500, message: '回复内容不能超过500个字符' },
          ]}
        >
          <TextArea
            rows={4}
            placeholder="请输入回复内容"
            maxLength={500}
            showCount
          />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              提交回复
            </Button>
            <Button onClick={onCancel}>取消</Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ReplyForm; 
import React from 'react';
import { Modal, Form, Input, Select, DatePicker, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { Lead, FollowUpRecord } from '@/types/leads';
import { FollowUpType } from '@/types/leads';

const { TextArea } = Input;
const { Option } = Select;

interface FollowUpFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: Partial<FollowUpRecord>) => Promise<void>;
  lead: Lead;
}

const FollowUpForm: React.FC<FollowUpFormProps> = ({
  visible,
  onCancel,
  onSubmit,
  lead,
}) => {
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit({
        ...values,
        leadId: lead.id,
        nextFollowUpTime: values.nextFollowUpTime?.format('YYYY-MM-DD HH:mm:ss'),
      });
      form.resetFields();
    } catch (error) {
      console.error('提交跟进记录失败:', error);
    }
  };

  return (
    <Modal
      title="添加跟进记录"
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          type: FollowUpType.PHONE,
        }}
      >
        <Form.Item
          name="type"
          label="跟进方式"
          rules={[{ required: true, message: '请选择跟进方式' }]}
        >
          <Select>
            <Option value={FollowUpType.PHONE}>电话沟通</Option>
            <Option value={FollowUpType.VISIT}>实地考察</Option>
            <Option value={FollowUpType.MEETING}>商务会谈</Option>
            <Option value={FollowUpType.OTHER}>其他</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="content"
          label="跟进内容"
          rules={[
            { required: true, message: '请输入跟进内容' },
            { max: 500, message: '跟进内容不能超过500个字符' },
          ]}
        >
          <TextArea
            rows={4}
            placeholder="请详细描述本次跟进的沟通内容、客户反馈等信息"
            maxLength={500}
            showCount
          />
        </Form.Item>

        <Form.Item
          name="nextFollowUpTime"
          label="下次跟进时间"
          rules={[{ required: true, message: '请选择下次跟进时间' }]}
        >
          <DatePicker
            showTime
            style={{ width: '100%' }}
            placeholder="请选择下次跟进时间"
          />
        </Form.Item>

        <Form.Item
          name="attachments"
          label="附件"
          extra="支持图片、文档等格式，单个文件不超过10MB"
        >
          <Upload
            action="/api/upload"
            listType="text"
            multiple
            maxCount={5}
          >
            <Button icon={<UploadOutlined />}>上传附件</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FollowUpForm; 
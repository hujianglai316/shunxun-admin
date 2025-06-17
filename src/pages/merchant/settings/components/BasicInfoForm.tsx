import React from 'react';
import { Form, Input, Button, Upload, Space, Row, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import type { MerchantSettings } from '../../../../types/merchant';

const { TextArea } = Input;

interface BasicInfoFormProps {
  data: MerchantSettings['basicInfo'];
  onSave: (values: MerchantSettings['basicInfo']) => Promise<void>;
  loading?: boolean;
}

const BasicInfoForm: React.FC<BasicInfoFormProps> = ({
  data,
  onSave,
  loading = false,
}) => {
  const [form] = Form.useForm();

  const handleSubmit = async (values: MerchantSettings['basicInfo']) => {
    await onSave(values);
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={data}
      onFinish={handleSubmit}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="name"
            label="商家名称"
            rules={[
              { required: true, message: '请输入商家名称' },
              { max: 50, message: '商家名称不能超过50个字符' },
            ]}
          >
            <Input placeholder="请输入商家名称" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="contactPerson"
            label="联系人"
            rules={[
              { required: true, message: '请输入联系人' },
              { max: 20, message: '联系人不能超过20个字符' },
            ]}
          >
            <Input placeholder="请输入联系人" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="contactPhone"
            label="联系电话"
            rules={[
              { required: true, message: '请输入联系电话' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' },
            ]}
          >
            <Input placeholder="请输入联系电话" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="contactEmail"
            label="联系邮箱"
            rules={[
              { required: true, message: '请输入联系邮箱' },
              { type: 'email', message: '请输入正确的邮箱地址' },
            ]}
          >
            <Input placeholder="请输入联系邮箱" />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="address"
        label="详细地址"
        rules={[
          { required: true, message: '请输入详细地址' },
          { max: 200, message: '详细地址不能超过200个字符' },
        ]}
      >
        <Input placeholder="请输入详细地址" />
      </Form.Item>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="latitude"
            label="纬度"
            rules={[
              { required: true, message: '请输入纬度' },
              { type: 'number', message: '请输入正确的纬度' },
              { min: -90, max: 90, message: '纬度范围为-90到90' },
            ]}
          >
            <Input type="number" placeholder="请输入纬度" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="longitude"
            label="经度"
            rules={[
              { required: true, message: '请输入经度' },
              { type: 'number', message: '请输入正确的经度' },
              { min: -180, max: 180, message: '经度范围为-180到180' },
            ]}
          >
            <Input type="number" placeholder="请输入经度" />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="description"
        label="商家描述"
        rules={[
          { required: true, message: '请输入商家描述' },
          { max: 1000, message: '商家描述不能超过1000个字符' },
        ]}
      >
        <TextArea rows={4} placeholder="请输入商家描述" />
      </Form.Item>

      <Form.Item
        name="notice"
        label="商家公告"
        rules={[{ max: 500, message: '商家公告不能超过500个字符' }]}
      >
        <TextArea rows={3} placeholder="请输入商家公告" />
      </Form.Item>

      <Form.Item
        name="images"
        label="商家图片"
        valuePropName="fileList"
        getValueFromEvent={normFile}
        rules={[{ required: true, message: '请上传商家图片' }]}
      >
        <Upload
          listType="picture-card"
          maxCount={10}
          beforeUpload={() => false}
        >
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>上传图片</div>
          </div>
        </Upload>
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

export default BasicInfoForm; 
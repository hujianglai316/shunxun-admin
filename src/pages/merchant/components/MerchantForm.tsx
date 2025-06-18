import React from 'react';
import { 
  Form, 
  Input, 
  Select, 
  TimePicker, 
  Upload, 
  Button, 
  Space,
  Row,
  Col
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import { MerchantType } from '../../../types/merchant';
import type { MerchantDetailInfo } from '../../../types/merchant';

const { Option } = Select;
const { TextArea } = Input;

interface MerchantFormProps {
  initialValues?: Partial<MerchantDetailInfo>;
  onFinish: (values: any) => void;
  onCancel: () => void;
  loading?: boolean;
}

const MerchantForm: React.FC<MerchantFormProps> = ({
  initialValues,
  onFinish,
  onCancel,
  loading = false,
}) => {
  const [form] = Form.useForm();

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
      initialValues={{
        type: MerchantType.HOTEL,
        ...initialValues,
      }}
      onFinish={onFinish}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="name"
            label="商家名称"
            rules={[{ required: true, message: '请输入商家名称' }]}
          >
            <Input placeholder="请输入商家名称" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="type"
            label="商家类型"
            rules={[{ required: true, message: '请选择商家类型' }]}
          >
            <Select placeholder="请选择商家类型">
              <Option value={MerchantType.HOTEL}>酒店</Option>
              <Option value={MerchantType.APARTMENT}>公寓</Option>
              <Option value={MerchantType.HOUSE}>民宿</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="contact"
            label="联系人"
            rules={[{ required: true, message: '请输入联系人姓名' }]}
          >
            <Input placeholder="请输入联系人姓名" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="phone"
            label="联系电话"
            rules={[
              { required: true, message: '请输入联系电话' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' },
            ]}
          >
            <Input placeholder="请输入联系电话" />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="email"
        label="电子邮箱"
        rules={[
          { type: 'email', message: '请输入正确的邮箱地址' },
          { required: true, message: '请输入电子邮箱' },
        ]}
      >
        <Input placeholder="请输入电子邮箱" />
      </Form.Item>

      <Form.Item
        name="address"
        label="详细地址"
        rules={[{ required: true, message: '请输入详细地址' }]}
      >
        <Input placeholder="请输入详细地址" />
      </Form.Item>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="businessHours"
            label="营业时间"
            rules={[{ required: true, message: '请选择营业时间' }]}
          >
            <TimePicker.RangePicker format="HH:mm" />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="description"
        label="商家描述"
        rules={[{ required: true, message: '请输入商家描述' }]}
      >
        <TextArea rows={4} placeholder="请输入商家描述" />
      </Form.Item>

      <Form.Item
        name="license"
        label="营业执照"
        valuePropName="fileList"
        getValueFromEvent={normFile}
        rules={[{ required: true, message: '请上传营业执照' }]}
      >
        <Upload
          name="license"
          listType="picture"
          maxCount={1}
          beforeUpload={() => false}
        >
          <Button icon={<UploadOutlined />}>上传营业执照</Button>
        </Upload>
      </Form.Item>

      <Form.Item
        name="idCard"
        label="身份证照片"
        valuePropName="fileList"
        getValueFromEvent={normFile}
        rules={[{ required: true, message: '请上传身份证照片' }]}
      >
        <Upload
          name="idCard"
          listType="picture"
          maxCount={2}
          beforeUpload={() => false}
        >
          <Button icon={<UploadOutlined />}>上传身份证照片（正反面）</Button>
        </Upload>
      </Form.Item>

      <Form.Item
        name="images"
        label="商家图片"
        valuePropName="fileList"
        getValueFromEvent={normFile}
      >
        <Upload
          name="images"
          listType="picture-card"
          maxCount={5}
          beforeUpload={() => false}
        >
          <div>
            <UploadOutlined />
            <div style={{ marginTop: 8 }}>上传</div>
          </div>
        </Upload>
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={loading}>
            提交
          </Button>
          <Button onClick={onCancel}>取消</Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default MerchantForm; 
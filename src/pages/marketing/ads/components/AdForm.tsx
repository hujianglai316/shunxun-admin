import React from 'react';
import {
  Form,
  Input,
  Select,
  DatePicker,
  TimePicker,
  InputNumber,
  Upload,
  Button,
  Space,
  Row,
  Col,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { AdDetail, AdPositionType } from '../types';

const { RangePicker } = DatePicker;
const { TextArea } = Input;

interface AdFormProps {
  initialValues?: Partial<AdDetail>;
  loading?: boolean;
  onSubmit: (values: any) => void;
  onCancel: () => void;
}

const positionConfig = {
  '开屏广告': {
    width: 1080,
    height: 1920,
    maxSize: 2, // MB
  },
  'banner广告': {
    width: 750,
    height: 280,
    maxSize: 1,
  },
  '底部广告': {
    width: 750,
    height: 200,
    maxSize: 1,
  },
  '商家产品广告': {
    width: 360,
    height: 360,
    maxSize: 1,
  },
};

const AdForm: React.FC<AdFormProps> = ({
  initialValues,
  loading,
  onSubmit,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const [selectedPosition, setSelectedPosition] = React.useState<AdPositionType | undefined>(
    initialValues?.position
  );

  const handlePositionChange = (value: AdPositionType) => {
    setSelectedPosition(value);
    form.setFieldsValue({ creative: undefined });
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const validateImage = (file: File) => {
    if (!selectedPosition) {
      return Promise.reject('请先选择广告位置');
    }

    const config = positionConfig[selectedPosition];
    const isLtMaxSize = file.size / 1024 / 1024 < config.maxSize;
    if (!isLtMaxSize) {
      return Promise.reject(`图片大小不能超过 ${config.maxSize}MB!`);
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        if (img.width !== config.width || img.height !== config.height) {
          reject(`图片尺寸必须为 ${config.width}x${config.height}px`);
        } else {
          resolve(true);
        }
      };
    });
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={onSubmit}
    >
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item
            name="title"
            label="广告标题"
            rules={[{ required: true, message: '请输入广告标题' }]}
          >
            <Input placeholder="请输入广告标题" maxLength={50} showCount />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="position"
            label="广告位置"
            rules={[{ required: true, message: '请选择广告位置' }]}
          >
            <Select
              placeholder="请选择广告位置"
              onChange={handlePositionChange}
              options={Object.keys(positionConfig).map(key => ({
                label: key,
                value: key,
              }))}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={12}>
          <Form.Item
            name="dateRange"
            label="投放时间"
            rules={[{ required: true, message: '请选择投放时间' }]}
          >
            <RangePicker
              showTime
              style={{ width: '100%' }}
              placeholder={['开始时间', '结束时间']}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="priority"
            label="优先级"
            rules={[{ required: true, message: '请设置优先级' }]}
            tooltip="数字越大优先级越高，范围1-100"
          >
            <InputNumber
              min={1}
              max={100}
              style={{ width: '100%' }}
              placeholder="请输入优先级"
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="schedule"
        label="投放时段"
        tooltip="可设置每天的具体投放时间段"
      >
        <TimePicker.RangePicker style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="targetUrl"
        label="跳转链接"
        rules={[
          { required: true, message: '请输入跳转链接' },
          { type: 'url', message: '请输入有效的URL' }
        ]}
      >
        <Input placeholder="请输入广告跳转链接" />
      </Form.Item>

      <Form.Item
        name="creative"
        label="广告图片"
        valuePropName="fileList"
        getValueFromEvent={normFile}
        rules={[{ required: true, message: '请上传广告图片' }]}
        extra={selectedPosition ? 
          `建议尺寸: ${positionConfig[selectedPosition].width}x${positionConfig[selectedPosition].height}px, 
           大小不超过${positionConfig[selectedPosition].maxSize}MB` : 
          '请先选择广告位置'
        }
      >
        <Upload
          listType="picture-card"
          maxCount={1}
          beforeUpload={validateImage}
          accept="image/*"
        >
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>上传</div>
          </div>
        </Upload>
      </Form.Item>

      <Form.Item name="remarks" label="备注">
        <TextArea rows={4} placeholder="请输入备注信息" maxLength={200} showCount />
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

export default AdForm; 
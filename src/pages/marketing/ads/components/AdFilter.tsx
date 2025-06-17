import React from 'react';
import { Form, Input, Select, DatePicker, Space, Button } from 'antd';
import type { AdPositionType, AdStatus } from '../types';

const { RangePicker } = DatePicker;

export interface AdFilterValues {
  keyword?: string;
  position?: AdPositionType;
  status?: AdStatus;
  dateRange?: [string, string];
}

interface AdFilterProps {
  loading?: boolean;
  onFilter: (values: AdFilterValues) => void;
  onReset: () => void;
}

const positionOptions = [
  { label: '开屏广告', value: '开屏广告' },
  { label: 'banner广告', value: 'banner广告' },
  { label: '底部广告', value: '底部广告' },
  { label: '商家产品广告', value: '商家产品广告' },
];

const statusOptions = [
  { label: '待发布', value: '待发布' },
  { label: '投放中', value: '投放中' },
  { label: '已暂停', value: '已暂停' },
  { label: '已结束', value: '已结束' },
  { label: '已下线', value: '已下线' },
];

const AdFilter: React.FC<AdFilterProps> = ({
  loading,
  onFilter,
  onReset,
}) => {
  const [form] = Form.useForm();

  const handleReset = () => {
    form.resetFields();
    onReset();
  };

  const handleFinish = (values: any) => {
    const filters: AdFilterValues = {
      keyword: values.keyword,
      position: values.position,
      status: values.status,
      dateRange: values.dateRange,
    };
    onFilter(filters);
  };

  return (
    <Form
      form={form}
      layout="inline"
      onFinish={handleFinish}
      style={{ marginBottom: 24 }}
    >
      <Form.Item name="keyword">
        <Input
          placeholder="请输入广告标题"
          style={{ width: 200 }}
          allowClear
        />
      </Form.Item>

      <Form.Item name="position">
        <Select
          placeholder="广告位置"
          style={{ width: 160 }}
          options={positionOptions}
          allowClear
        />
      </Form.Item>

      <Form.Item name="status">
        <Select
          placeholder="投放状态"
          style={{ width: 160 }}
          options={statusOptions}
          allowClear
        />
      </Form.Item>

      <Form.Item name="dateRange">
        <RangePicker
          placeholder={['开始日期', '结束日期']}
          style={{ width: 260 }}
        />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={loading}>
            查询
          </Button>
          <Button onClick={handleReset}>重置</Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default AdFilter; 
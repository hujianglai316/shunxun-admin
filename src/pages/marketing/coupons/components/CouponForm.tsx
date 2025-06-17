import React, { useState, useEffect } from 'react';
import { Form, Input, Select, DatePicker, InputNumber, Switch, Radio, Button, Row, Col, Space, Divider, Card, message } from 'antd';
import type { FormInstance } from 'antd/es/form';
import { MinusCircleOutlined, PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import type { CouponTemplate, CouponType, DistributionType, UseChannel, UseScope } from '../../../../types/marketing';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

interface CouponFormProps {
  form: FormInstance;
  initialValues?: Partial<CouponTemplate>;
  onFinish: (values: any) => void;
  onCancel: () => void;
  loading?: boolean;
}

// 渠道选项
const channelOptions = [
  { label: '全部渠道', value: 'ALL' },
  { label: '仅APP', value: 'APP' },
  { label: '仅小程序', value: 'MINI' },
  { label: '仅网页', value: 'WEB' },
  { label: '线下渠道', value: 'OFFLINE' },
];

// 使用范围选项
const scopeOptions = [
  { label: '全部商品', value: 'ALL' },
  { label: '指定分类', value: 'CATEGORY' },
  { label: '指定商品', value: 'PRODUCT' },
  { label: '指定商家', value: 'MERCHANT' },
];

// 用户等级选项
const userLevelOptions = [
  { label: '全部用户', value: 'ALL' },
  { label: '普通会员', value: 'NORMAL' },
  { label: '银卡会员', value: 'SILVER' },
  { label: '金卡会员', value: 'GOLD' },
  { label: '钻石会员', value: 'DIAMOND' },
];

const CouponForm: React.FC<CouponFormProps> = ({
  form,
  initialValues,
  onFinish,
  onCancel,
  loading = false,
}) => {
  const [couponType, setCouponType] = useState<CouponType>(initialValues?.type || 'DISCOUNT');
  const [distributionType, setDistributionType] = useState<DistributionType>(initialValues?.distributionType || 'DIRECT');
  const [useScope, setUseScope] = useState<UseScope>(initialValues?.rule?.useScope || 'ALL');
  
  // 监听表单字段变化
  const handleValuesChange = (changedValues: any) => {
    if (changedValues.type) {
      setCouponType(changedValues.type);
    }
    if (changedValues.distributionType) {
      setDistributionType(changedValues.distributionType);
    }
    if (changedValues.rule && changedValues.rule.useScope) {
      setUseScope(changedValues.rule.useScope);
    }
  };

  // 表单提交前处理
  const handleFinish = (values: any) => {
    if (values.validityPeriod && values.validityPeriod.length === 2) {
      values.startTime = values.validityPeriod[0].format('YYYY-MM-DD HH:mm:ss');
      values.endTime = values.validityPeriod[1].format('YYYY-MM-DD HH:mm:ss');
      delete values.validityPeriod;
    }
    
    // 根据优惠券类型处理面值
    if (values.type === 'DISCOUNT') {
      values.value = values.value / 100; // 将百分比转为小数
    }
    
    onFinish(values);
  };

  // 格式化和解析函数
  const formatPercentage = (value: number | undefined): string => {
    if (value === undefined) return '';
    return `${value}%`;
  };

  const parsePercentage = (value: string | undefined): number => {
    if (!value) return 1;
    return Number(value.replace('%', ''));
  };

  const formatCurrency = (value: number | undefined): string => {
    if (value === undefined) return '';
    return `¥ ${value}`;
  };

  const parseCurrency = (value: string | undefined): number => {
    if (!value) return 0;
    return Number(value.replace(/[¥\s,]/g, ''));
  };

  // 根据券类型渲染不同的面值输入框
  const renderValueInput = () => {
    switch (couponType) {
      case 'DISCOUNT':
        return (
          <Form.Item
            name="value"
            label="折扣力度"
            rules={[
              { required: true, message: '请输入折扣力度' },
              { type: 'number', min: 1, max: 99, message: '折扣力度必须在1-99之间' }
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={1}
              max={99}
              formatter={formatPercentage}
              parser={parsePercentage}
              placeholder="请输入折扣力度，如：80表示8折"
            />
          </Form.Item>
        );
      case 'CASH':
        return (
          <>
            <Form.Item
              name="value"
              label="优惠金额"
              rules={[
                { required: true, message: '请输入优惠金额' },
                { type: 'number', min: 1, message: '优惠金额必须大于0' }
              ]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={1}
                precision={2}
                formatter={formatCurrency}
                parser={parseCurrency}
                placeholder="请输入优惠金额"
              />
            </Form.Item>
            <Form.Item
              name={['rule', 'minAmount']}
              label="使用门槛"
              rules={[
                { required: true, message: '请输入使用门槛' },
                { type: 'number', min: 0, message: '使用门槛必须大于等于0' }
              ]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                precision={2}
                formatter={formatCurrency}
                parser={parseCurrency}
                placeholder="请输入使用门槛，0表示无门槛"
              />
            </Form.Item>
          </>
        );
      case 'DIRECT':
        return (
          <Form.Item
            name="value"
            label="优惠金额"
            rules={[
              { required: true, message: '请输入优惠金额' },
              { type: 'number', min: 1, message: '优惠金额必须大于0' }
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={1}
              precision={2}
              formatter={formatCurrency}
              parser={parseCurrency}
              placeholder="请输入优惠金额"
            />
          </Form.Item>
        );
      case 'FREE':
      case 'GIFT':
        return (
          <Form.Item
            name="description"
            label="优惠描述"
            rules={[{ required: true, message: '请输入优惠描述' }]}
          >
            <TextArea rows={2} placeholder="请输入优惠描述，例如：免费住一晚/赠送早餐" />
          </Form.Item>
        );
      default:
        return null;
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        type: 'DISCOUNT',
        distributionType: 'DIRECT',
        validDays: 30,
        rule: {
          perLimit: 1,
          totalLimit: 1000,
          useChannels: ['ALL'],
          useScope: 'ALL',
          newUserOnly: false,
          excludePromotion: true,
        },
        ...initialValues,
      }}
      onValuesChange={handleValuesChange}
      onFinish={handleFinish}
    >
      <Card title="基本信息" bordered={false}>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="优惠券名称"
              rules={[{ required: true, message: '请输入优惠券名称' }]}
            >
              <Input placeholder="请输入优惠券名称，例如：新人专享8折券" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="type"
              label="优惠券类型"
              rules={[{ required: true, message: '请选择优惠券类型' }]}
            >
              <Select placeholder="请选择优惠券类型">
                <Option value="DISCOUNT">折扣券</Option>
                <Option value="CASH">满减券</Option>
                <Option value="DIRECT">直减券</Option>
                <Option value="FREE">免费券</Option>
                <Option value="GIFT">赠品券</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            {renderValueInput()}
          </Col>
          <Col span={12}>
            <Form.Item
              name="validityPeriod"
              label="活动有效期"
              rules={[{ required: true, message: '请选择活动有效期' }]}
            >
              <RangePicker
                style={{ width: '100%' }}
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                placeholder={['开始时间', '结束时间']}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="validDays"
              label="领取后有效天数"
              tooltip="用户领取优惠券后的有效期天数"
              rules={[
                { required: true, message: '请输入领取后有效天数' },
                { type: 'number', min: 1, message: '有效天数必须大于0' }
              ]}
            >
              <InputNumber style={{ width: '100%' }} min={1} placeholder="请输入领取后有效天数" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="distributionType"
              label="发放方式"
              rules={[{ required: true, message: '请选择发放方式' }]}
            >
              <Select placeholder="请选择发放方式">
                <Option value="DIRECT">直接发放</Option>
                <Option value="CODE">兑换码</Option>
                <Option value="ACTIVITY">活动奖励</Option>
                <Option value="MANUAL">人工发放</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {distributionType === 'CODE' && (
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="code"
                label="兑换码"
                rules={[{ required: true, message: '请输入兑换码' }]}
              >
                <Input placeholder="请输入兑换码，如留空系统将自动生成" />
              </Form.Item>
            </Col>
          </Row>
        )}
      </Card>

      <Card title="使用规则" bordered={false} style={{ marginTop: 24 }}>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name={['rule', 'perLimit']}
              label="每人限领数量"
              rules={[
                { required: true, message: '请输入每人限领数量' },
                { type: 'number', min: 1, message: '限领数量必须大于0' }
              ]}
            >
              <InputNumber style={{ width: '100%' }} min={1} placeholder="请输入每人限领数量" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name={['rule', 'totalLimit']}
              label="总发放数量"
              rules={[
                { required: true, message: '请输入总发放数量' },
                { type: 'number', min: 1, message: '总发放数量必须大于0' }
              ]}
            >
              <InputNumber style={{ width: '100%' }} min={1} placeholder="请输入总发放数量" />
            </Form.Item>
          </Col>
        </Row>

        {couponType === 'DISCOUNT' && (
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name={['rule', 'maxDiscount']}
                label="最高优惠金额"
                tooltip="设置最高优惠金额，0表示不限制"
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  precision={2}
                  formatter={formatCurrency}
                  parser={parseCurrency}
                  placeholder="请输入最高优惠金额，0表示不限制"
                />
              </Form.Item>
            </Col>
          </Row>
        )}

        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              name={['rule', 'useChannels']}
              label="使用渠道"
              rules={[{ required: true, message: '请选择使用渠道' }]}
            >
              <Select mode="multiple" placeholder="请选择使用渠道" options={channelOptions} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name={['rule', 'useScope']}
              label="使用范围"
              rules={[{ required: true, message: '请选择使用范围' }]}
            >
              <Select placeholder="请选择使用范围" options={scopeOptions} />
            </Form.Item>
          </Col>
          {useScope !== 'ALL' && (
            <Col span={12}>
              <Form.Item
                name={['rule', 'scopeIds']}
                label={useScope === 'CATEGORY' ? '分类ID列表' : useScope === 'PRODUCT' ? '商品ID列表' : '商家ID列表'}
                rules={[{ required: true, message: '请选择适用范围' }]}
              >
                <Select
                  mode="multiple"
                  placeholder={`请选择${useScope === 'CATEGORY' ? '分类' : useScope === 'PRODUCT' ? '商品' : '商家'}`}
                  options={[
                    // 这里应该根据实际情况从后端获取数据
                    { label: '示例数据1', value: 'sample1' },
                    { label: '示例数据2', value: 'sample2' },
                    { label: '示例数据3', value: 'sample3' },
                  ]}
                />
              </Form.Item>
            </Col>
          )}
        </Row>

        <Row gutter={24}>
          <Col span={8}>
            <Form.Item
              name={['rule', 'newUserOnly']}
              valuePropName="checked"
              label="仅限新用户"
              tooltip="勾选后仅限新注册用户可领取使用"
            >
              <Switch />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name={['rule', 'excludePromotion']}
              valuePropName="checked"
              label="不可与其他优惠叠加"
              tooltip="勾选后不可与其他优惠同时使用"
            >
              <Switch />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name={['rule', 'weekendOnly']}
              valuePropName="checked"
              label="仅周末可用"
              tooltip="勾选后仅周六日可用"
            >
              <Switch />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              name={['rule', 'description']}
              label="使用说明"
            >
              <TextArea rows={4} placeholder="请输入优惠券使用说明，将展示给用户" />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      <div style={{ marginTop: 24, textAlign: 'center' }}>
        <Space size="large">
          <Button onClick={onCancel}>取消</Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            保存
          </Button>
        </Space>
      </div>
    </Form>
  );
};

export default CouponForm; 
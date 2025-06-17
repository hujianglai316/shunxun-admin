import React, { useState } from 'react';
import { Table, Tag, Button, Space, Input, Form, Select, DatePicker, Row, Col, Tooltip } from 'antd';
import { SearchOutlined, EyeOutlined, FileExcelOutlined } from '@ant-design/icons';
import type { UserCoupon, UserCouponStatus, CouponType } from '../../../../types/marketing';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface UserCouponListProps {
  loading: boolean;
  dataSource: UserCoupon[];
  total: number;
  onSearch: (params: any) => void;
  pagination: {
    current: number;
    pageSize: number;
  };
  onViewDetail?: (record: UserCoupon) => void;
}

const UserCouponList: React.FC<UserCouponListProps> = ({
  loading,
  dataSource,
  total,
  onSearch,
  pagination,
  onViewDetail,
}) => {
  const [form] = Form.useForm();

  const handleSearch = (values: any) => {
    const { dateRange, ...rest } = values;
    const params = {
      ...rest,
      page: pagination.current,
      pageSize: pagination.pageSize,
    };

    if (dateRange && dateRange.length === 2) {
      params.startDate = dateRange[0].format('YYYY-MM-DD');
      params.endDate = dateRange[1].format('YYYY-MM-DD');
    }

    onSearch(params);
  };

  const handleReset = () => {
    form.resetFields();
  };

  const handleTableChange = (newPagination: any) => {
    const values = form.getFieldsValue();
    const { dateRange, ...rest } = values;
    const params = {
      ...rest,
      page: newPagination.current,
      pageSize: newPagination.pageSize,
    };

    if (dateRange && dateRange.length === 2) {
      params.startDate = dateRange[0].format('YYYY-MM-DD');
      params.endDate = dateRange[1].format('YYYY-MM-DD');
    }

    onSearch(params);
  };

  // 渲染优惠券类型
  const renderCouponType = (type: CouponType) => {
    const typeMap: Record<CouponType, { color: string; text: string }> = {
      DISCOUNT: { color: 'blue', text: '折扣券' },
      CASH: { color: 'green', text: '满减券' },
      DIRECT: { color: 'red', text: '直减券' },
      FREE: { color: 'purple', text: '免费券' },
      GIFT: { color: 'orange', text: '赠品券' },
    };
    
    const { color, text } = typeMap[type] || { color: 'default', text: '未知类型' };
    return <Tag color={color}>{text}</Tag>;
  };

  // 渲染优惠券状态
  const renderCouponStatus = (status: UserCouponStatus) => {
    const statusMap: Record<UserCouponStatus, { color: string; text: string }> = {
      UNUSED: { color: 'green', text: '未使用' },
      USED: { color: 'blue', text: '已使用' },
      EXPIRED: { color: 'gray', text: '已过期' },
    };
    
    const { color, text } = statusMap[status] || { color: 'default', text: '未知状态' };
    return <Tag color={color}>{text}</Tag>;
  };

  const columns = [
    {
      title: '用户ID',
      dataIndex: 'userId',
      key: 'userId',
      width: 120,
    },
    {
      title: '用户名',
      dataIndex: 'userName',
      key: 'userName',
      width: 120,
    },
    {
      title: '优惠券名称',
      dataIndex: 'couponName',
      key: 'couponName',
      ellipsis: true,
    },
    {
      title: '类型',
      dataIndex: 'couponType',
      key: 'couponType',
      width: 100,
      render: (type: CouponType) => renderCouponType(type),
    },
    {
      title: '优惠券面值',
      dataIndex: 'couponValue',
      key: 'couponValue',
      width: 120,
      render: (value: number, record: UserCoupon) => (
        record.couponType === 'DISCOUNT' 
          ? `${(value * 100).toFixed(0)}% 折扣` 
          : record.couponType === 'CASH' || record.couponType === 'DIRECT'
            ? `¥ ${value.toFixed(2)}` 
            : '-'
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: UserCouponStatus) => renderCouponStatus(status),
    },
    {
      title: '领取时间',
      dataIndex: 'obtainTime',
      key: 'obtainTime',
      width: 180,
    },
    {
      title: '有效期',
      key: 'validPeriod',
      width: 240,
      render: (_: any, record: UserCoupon) => `${record.validStartTime} ~ ${record.validEndTime}`,
    },
    {
      title: '使用时间',
      dataIndex: 'usedTime',
      key: 'usedTime',
      width: 180,
      render: (usedTime: string) => usedTime || '-',
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_: any, record: UserCoupon) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button
              type="link"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => onViewDetail && onViewDetail(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="user-coupon-list">
      <Form form={form} onFinish={handleSearch} layout="vertical">
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item name="userId" label="用户ID">
              <Input placeholder="请输入用户ID" allowClear />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="userName" label="用户名">
              <Input placeholder="请输入用户名" allowClear />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="couponType" label="优惠券类型">
              <Select placeholder="请选择优惠券类型" allowClear>
                <Option value="DISCOUNT">折扣券</Option>
                <Option value="CASH">满减券</Option>
                <Option value="DIRECT">直减券</Option>
                <Option value="FREE">免费券</Option>
                <Option value="GIFT">赠品券</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="status" label="优惠券状态">
              <Select placeholder="请选择优惠券状态" allowClear>
                <Option value="UNUSED">未使用</Option>
                <Option value="USED">已使用</Option>
                <Option value="EXPIRED">已过期</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item name="templateId" label="优惠券模板ID">
              <Input placeholder="请输入优惠券模板ID" allowClear />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="dateRange" label="领取时间范围">
              <RangePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12} style={{ textAlign: 'right', alignSelf: 'flex-end', marginBottom: '24px' }}>
            <Space>
              <Button onClick={handleReset}>重置</Button>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                查询
              </Button>
              <Button icon={<FileExcelOutlined />}>导出</Button>
            </Space>
          </Col>
        </Row>
      </Form>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条数据`,
        }}
        onChange={handleTableChange}
        scroll={{ x: 1500 }}
      />
    </div>
  );
};

export default UserCouponList; 
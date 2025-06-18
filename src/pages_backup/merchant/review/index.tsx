import React, { useState } from 'react';
import { Card, Form, Row, Col, Select, Input, DatePicker, Button, Space, Modal } from 'antd';
import { ReviewStatus, RatingType, type ReviewRecord, type ReviewStats } from '../../../types/merchant';
import ReviewList from './components/ReviewList';
import ReviewStatsComponent from './components/ReviewStatsComponent';

const { Option } = Select;
const { RangePicker } = DatePicker;

const MerchantReview: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // 模拟评价统计数据
  const mockStats: ReviewStats = {
    totalCount: 1256,
    averageRating: {
      [RatingType.OVERALL]: 4.5,
      [RatingType.CLEANLINESS]: 4.6,
      [RatingType.SERVICE]: 4.4,
      [RatingType.LOCATION]: 4.7,
      [RatingType.FACILITIES]: 4.3,
      [RatingType.VALUE]: 4.5,
    },
    ratingDistribution: {
      5: 600,
      4: 400,
      3: 150,
      2: 80,
      1: 26,
    },
    hasImageCount: 458,
    hasReplyCount: 986,
    pendingCount: 25,
    recentTrend: [
      { date: '2024-03-01', count: 45, averageRating: 4.5 },
      { date: '2024-03-02', count: 52, averageRating: 4.6 },
      { date: '2024-03-03', count: 48, averageRating: 4.4 },
      { date: '2024-03-04', count: 56, averageRating: 4.7 },
      { date: '2024-03-05', count: 50, averageRating: 4.5 },
      { date: '2024-03-06', count: 58, averageRating: 4.6 },
      { date: '2024-03-07', count: 54, averageRating: 4.5 },
    ],
  };

  const handleSearch = (values: any) => {
    console.log('搜索条件：', values);
    setLoading(true);
    // 模拟API请求
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleViewDetail = (record: ReviewRecord) => {
    Modal.info({
      title: '评价详情',
      width: 800,
      content: (
        <div>
          <div style={{ marginBottom: 16 }}>
            <div>用户：{record.userName}</div>
            <div>订单号：{record.orderNo}</div>
            <div>评价时间：{record.createTime}</div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div>评分详情：</div>
            {Object.entries(record.rating).map(([type, score]) => (
              <div key={type}>
                {type}: {score}分
              </div>
            ))}
          </div>
          <div style={{ marginBottom: 16 }}>
            <div>评价内容：</div>
            <div>{record.content}</div>
          </div>
          {record.images && record.images.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div>评价图片：</div>
              <Space size={8}>
                {record.images.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`评价图片${index + 1}`}
                    style={{ width: 120, height: 120, objectFit: 'cover' }}
                  />
                ))}
              </Space>
            </div>
          )}
          {record.merchantReply && (
            <div>
              <div>商家回复：</div>
              <div>{record.merchantReply.content}</div>
              <div>
                回复时间：{record.merchantReply.createTime}
                操作人：{record.merchantReply.operator}
              </div>
            </div>
          )}
        </div>
      ),
    });
  };

  return (
    <div>
      <ReviewStatsComponent data={mockStats} />

      <Card style={{ marginTop: 16 }}>
        <Form
          form={form}
          name="review_search"
          onFinish={handleSearch}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item name="status" label="评价状态">
                <Select placeholder="请选择评价状态" allowClear>
                  {Object.values(ReviewStatus).map(status => (
                    <Option key={status} value={status}>
                      {status}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="rating" label="评分范围">
                <Select placeholder="请选择评分范围" allowClear>
                  <Option value="5">5星</Option>
                  <Option value="4">4星</Option>
                  <Option value="3">3星</Option>
                  <Option value="2">2星</Option>
                  <Option value="1">1星</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="orderNo" label="订单号">
                <Input placeholder="请输入订单号" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="timeRange" label="评价时间">
                <RangePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{ textAlign: 'right' }}>
              <Space>
                <Button type="primary" htmlType="submit" loading={loading}>
                  查询
                </Button>
                <Button onClick={() => form.resetFields()}>重置</Button>
              </Space>
            </Col>
          </Row>
        </Form>

        <ReviewList onViewDetail={handleViewDetail} />
      </Card>
    </div>
  );
};

export default MerchantReview; 
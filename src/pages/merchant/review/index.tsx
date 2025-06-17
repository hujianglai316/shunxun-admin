import React, { useState } from 'react';
import { Card, Modal, Form, Row, Col, Input, Select, DatePicker, Button, Space, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { ReviewRecord, ReviewSearchParams } from '../../../types/merchant';
import { ReviewStatus, RatingType } from '../../../types/merchant';
import type { ReviewStats } from '../../../types/merchant';
import { default as ReviewStatsComponent } from './components/ReviewStats';
import ReviewList from './components/ReviewList';
import ReplyForm from './components/ReplyForm';
import { default as AuditFormComponent } from './components/AuditForm';

const { Option } = Select;
const { RangePicker } = DatePicker;

// 模拟数据
const mockStats: ReviewStats = {
  totalCount: 1000,
  averageRating: {
    [RatingType.OVERALL]: 4.5,
    [RatingType.CLEANLINESS]: 4.6,
    [RatingType.SERVICE]: 4.4,
    [RatingType.LOCATION]: 4.7,
    [RatingType.FACILITIES]: 4.3,
    [RatingType.VALUE]: 4.2,
  },
  ratingDistribution: {
    5: 500,
    4: 300,
    3: 150,
    2: 40,
    1: 10,
  },
  hasImageCount: 300,
  hasReplyCount: 800,
  pendingCount: 20,
  recentTrend: [
    { date: '2024-03-15', count: 10, averageRating: 4.5 },
    // 更多数据...
  ],
};

const mockReviews: ReviewRecord[] = [
  {
    id: 1,
    merchantId: 1001,
    merchantName: '瑞森酒店',
    orderId: '1001',
    orderNo: 'ORDER202403150001',
    userId: 2001,
    userName: '张三',
    userAvatar: 'https://example.com/avatar.jpg',
    content: '房间很干净，服务很好，位置也很方便。',
    rating: {
      [RatingType.OVERALL]: 5,
      [RatingType.CLEANLINESS]: 5,
      [RatingType.SERVICE]: 5,
      [RatingType.LOCATION]: 5,
      [RatingType.FACILITIES]: 4,
      [RatingType.VALUE]: 4,
    },
    images: [
      'https://example.com/review1.jpg',
      'https://example.com/review2.jpg',
    ],
    status: ReviewStatus.PENDING,
    createTime: '2024-03-15 10:00:00',
    updateTime: '2024-03-15 10:00:00',
  },
  // 更多数据...
];

const MerchantReview: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [replyVisible, setReplyVisible] = useState(false);
  const [auditVisible, setAuditVisible] = useState(false);
  const [currentReview, setCurrentReview] = useState<ReviewRecord | null>(null);
  const [replyLoading, setReplyLoading] = useState(false);
  const [auditLoading, setAuditLoading] = useState(false);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 100,
  });

  const handleSearch = (values: ReviewSearchParams) => {
    console.log('搜索条件：', values);
    setLoading(true);
    // 这里添加实际的搜索逻辑
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleReply = async (content: string) => {
    try {
      setReplyLoading(true);
      // 这里添加实际的回复逻辑
      console.log('回复内容：', content);
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success('回复成功');
      setReplyVisible(false);
    } catch (error) {
      message.error('回复失败');
    } finally {
      setReplyLoading(false);
    }
  };

  const handleAudit = async (values: {
    status: ReviewStatus;
    reason?: string;
  }) => {
    try {
      setAuditLoading(true);
      // 这里添加实际的审核逻辑
      console.log('审核结果：', values);
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success('审核成功');
      setAuditVisible(false);
    } catch (error) {
      message.error('审核失败');
    } finally {
      setAuditLoading(false);
    }
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
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item name="hasImages" label="有无图片">
                <Select placeholder="请选择" allowClear>
                  <Option value={true}>有图片</Option>
                  <Option value={false}>无图片</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="hasReply" label="回复状态">
                <Select placeholder="请选择" allowClear>
                  <Option value={true}>已回复</Option>
                  <Option value={false}>未回复</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="keyword" label="关键词">
                <Input placeholder="请输入评价内容关键词" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{ textAlign: 'right' }}>
              <Space>
                <Button 
                  type="primary" 
                  icon={<SearchOutlined />} 
                  htmlType="submit"
                >
                  搜索
                </Button>
                <Button onClick={() => form.resetFields()}>重置</Button>
              </Space>
            </Col>
          </Row>
        </Form>

        <ReviewList
          data={mockReviews}
          loading={loading}
          pagination={pagination}
          onChange={(page, pageSize) => {
            setPagination({ ...pagination, current: page, pageSize });
          }}
          onViewDetail={handleViewDetail}
          onReply={(record) => {
            setCurrentReview(record);
            setReplyVisible(true);
          }}
          onAudit={(record) => {
            setCurrentReview(record);
            setAuditVisible(true);
          }}
        />
      </Card>

      <Modal
        title="回复评价"
        open={replyVisible}
        onCancel={() => setReplyVisible(false)}
        footer={null}
        destroyOnClose
        width={800}
      >
        {currentReview && (
          <ReplyForm
            review={currentReview}
            onSubmit={handleReply}
            onCancel={() => setReplyVisible(false)}
            loading={replyLoading}
          />
        )}
      </Modal>

      <Modal
        title="审核评价"
        open={auditVisible}
        onCancel={() => setAuditVisible(false)}
        footer={null}
        destroyOnClose
        width={800}
      >
        {currentReview && (
          <AuditFormComponent
            review={currentReview}
            onSubmit={handleAudit}
            onCancel={() => setAuditVisible(false)}
            loading={auditLoading}
          />
        )}
      </Modal>
    </div>
  );
};

export default MerchantReview; 
import React from 'react';
import { Table, Space, Button, Tag, Image, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ReviewStatus, RatingType, type ReviewRecord } from '../../../../types/merchant';

const { Text } = Typography;

interface ReviewListProps {
  onViewDetail: (record: ReviewRecord) => void;
}

const ReviewList: React.FC<ReviewListProps> = ({ onViewDetail }) => {
  // 模拟数据
  const mockData: ReviewRecord[] = [
    {
      id: 1,
      userName: '张三',
      orderNo: 'SX20240315001',
      content: '房间很干净，服务很好，位置也很方便。',
      rating: {
        [RatingType.OVERALL]: 5,
        [RatingType.CLEANLINESS]: 5,
        [RatingType.SERVICE]: 5,
        [RatingType.LOCATION]: 5,
        [RatingType.FACILITIES]: 4,
        [RatingType.VALUE]: 5,
      },
      images: [
        'https://example.com/image1.jpg',
        'https://example.com/image2.jpg',
      ],
      status: ReviewStatus.REPLIED,
      createTime: '2024-03-15 10:00:00',
      merchantReply: {
        content: '感谢您的好评，欢迎下次再来！',
        operator: '店长',
        createTime: '2024-03-15 10:30:00',
      },
    },
    // 更多评价数据...
  ];

  const renderReviewStatus = (status: ReviewStatus) => {
    const statusMap = {
      [ReviewStatus.PENDING]: { text: '待回复', color: 'warning' },
      [ReviewStatus.REPLIED]: { text: '已回复', color: 'success' },
      [ReviewStatus.HIDDEN]: { text: '已隐藏', color: 'default' },
    };
    const { text, color } = statusMap[status];
    return <Tag color={color}>{text}</Tag>;
  };

  const columns: ColumnsType<ReviewRecord> = [
    {
      title: '用户',
      dataIndex: 'userName',
      key: 'userName',
      width: 100,
    },
    {
      title: '评分',
      dataIndex: 'rating',
      key: 'rating',
      width: 100,
      render: (rating: Record<RatingType, number>) => (
        <div>
          <div>总体：{rating[RatingType.OVERALL]}分</div>
          <div style={{ fontSize: 12, color: '#666' }}>
            清洁：{rating[RatingType.CLEANLINESS]}分
            服务：{rating[RatingType.SERVICE]}分
          </div>
        </div>
      ),
    },
    {
      title: '评价内容',
      key: 'content',
      render: (_, record) => (
        <div>
          <div style={{ marginBottom: 8 }}>{record.content}</div>
          {record.images && record.images.length > 0 && (
            <Space size={8}>
              {record.images.map((url, index) => (
                <Image
                  key={index}
                  src={url}
                  width={64}
                  height={64}
                  style={{ objectFit: 'cover' }}
                />
              ))}
            </Space>
          )}
          {record.merchantReply && (
            <div style={{ marginTop: 8, background: '#f5f5f5', padding: 8 }}>
              <Text type="secondary">商家回复：</Text>
              <div>{record.merchantReply.content}</div>
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {record.merchantReply.operator} 回复于 {record.merchantReply.createTime}
                </Text>
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      title: '订单号',
      dataIndex: 'orderNo',
      key: 'orderNo',
      width: 200,
      render: (orderNo: string) => (
        <Text copyable>{orderNo}</Text>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: ReviewStatus) => renderReviewStatus(status),
    },
    {
      title: '评价时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => onViewDetail(record)}>
            查看
          </Button>
          {record.status === ReviewStatus.PENDING && (
            <Button type="link">
              回复
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={mockData}
      rowKey="id"
      pagination={{
        total: 100,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
      }}
    />
  );
};

export default ReviewList; 
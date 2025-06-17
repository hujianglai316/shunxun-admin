import React from 'react';
import { Table, Tag, Space, Button, Rate, Image, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { ReviewRecord } from '../../../../types/merchant';
import { ReviewStatus } from '../../../../types/merchant';

const { Text } = Typography;

interface ReviewListProps {
  data: ReviewRecord[];
  loading?: boolean;
  pagination: {
    total: number;
    current: number;
    pageSize: number;
  };
  onChange: (page: number, pageSize: number) => void;
  onViewDetail: (record: ReviewRecord) => void;
  onReply: (record: ReviewRecord) => void;
  onAudit: (record: ReviewRecord) => void;
}

const ReviewList: React.FC<ReviewListProps> = ({
  data,
  loading,
  pagination,
  onChange,
  onViewDetail,
  onReply,
  onAudit,
}) => {
  const renderReviewStatus = (status: ReviewStatus) => {
    const statusMap = {
      [ReviewStatus.PENDING]: { text: '待审核', color: 'warning' },
      [ReviewStatus.APPROVED]: { text: '已通过', color: 'success' },
      [ReviewStatus.REJECTED]: { text: '已拒绝', color: 'error' },
      [ReviewStatus.HIDDEN]: { text: '已隐藏', color: 'default' },
    };
    const { text, color } = statusMap[status];
    return <Tag color={color}>{text}</Tag>;
  };

  const columns: ColumnsType<ReviewRecord> = [
    {
      title: '评价时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
    },
    {
      title: '用户信息',
      key: 'user',
      width: 200,
      render: (_, record) => (
        <Space>
          {record.userAvatar && (
            <Image
              src={record.userAvatar}
              alt="avatar"
              width={32}
              height={32}
              style={{ borderRadius: '50%' }}
              preview={false}
            />
          )}
          <Text>{record.userName}</Text>
        </Space>
      ),
    },
    {
      title: '评分',
      dataIndex: ['rating', 'overall'],
      key: 'rating',
      width: 150,
      render: (rating: number) => (
        <Rate disabled defaultValue={rating} />
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
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right' as const,
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => onViewDetail(record)}>
            详情
          </Button>
          {!record.merchantReply && record.status === ReviewStatus.APPROVED && (
            <Button type="link" onClick={() => onReply(record)}>
              回复
            </Button>
          )}
          {record.status === ReviewStatus.PENDING && (
            <Button type="link" onClick={() => onAudit(record)}>
              审核
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      loading={loading}
      scroll={{ x: 1500 }}
      pagination={{
        ...pagination,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => `共 ${total} 条记录`,
      }}
      onChange={(page) => {
        onChange(page.current || 1, page.pageSize || 10);
      }}
    />
  );
};

export default ReviewList; 
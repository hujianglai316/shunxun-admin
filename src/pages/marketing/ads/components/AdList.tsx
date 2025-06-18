import React from 'react';
import { Table, Tag, Space, Button, Image, Tooltip } from 'antd';
import type { AdDetail, AdStatus } from '../types';

interface AdListProps {
  loading?: boolean;
  dataSource: AdDetail[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: AdStatus) => void;
}

const statusColors = {
  '待发布': 'default',
  '投放中': 'success',
  '已暂停': 'warning',
  '已结束': 'default',
  '已下线': 'error',
};

const AdList: React.FC<AdListProps> = ({
  loading,
  dataSource,
  onView,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const columns = [
    {
      title: '广告标题',
      dataIndex: 'title',
      key: 'title',
      width: 200,
      render: (text: string, record: AdDetail) => (
        <Space>
          <Image
            src={record.creative.imageUrl}
            width={40}
            height={40}
            style={{ objectFit: 'cover', borderRadius: 4 }}
            preview={false}
          />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: '广告位置',
      dataIndex: 'position',
      key: 'position',
      width: 120,
    },
    {
      title: '投放时间',
      key: 'date',
      width: 200,
      render: (_: any, record: AdDetail) => (
        <span>{record.startDate} 至 {record.endDate}</span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: AdStatus) => (
        <Tag color={statusColors[status]}>{status}</Tag>
      ),
    },
    {
      title: '数据统计',
      key: 'stats',
      width: 300,
      render: (_: any, record: AdDetail) => (
        <Space size="large">
          <Tooltip title="展示次数">
            <span>展示: {record.stats.impressions}</span>
          </Tooltip>
          <Tooltip title="点击次数">
            <span>点击: {record.stats.clicks}</span>
          </Tooltip>
          <Tooltip title="点击率">
            <span>CTR: {(record.stats.ctr * 100).toFixed(2)}%</span>
          </Tooltip>
          <Tooltip title="转化率">
            <span>转化: {(record.stats.conversionRate * 100).toFixed(2)}%</span>
          </Tooltip>
        </Space>
      ),
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      width: 80,
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: any, record: AdDetail) => (
        <Space size="middle">
          <Button type="link" onClick={() => onView(record.id)}>
            查看
          </Button>
          <Button type="link" onClick={() => onEdit(record.id)}>
            编辑
          </Button>
          {record.status === '投放中' ? (
            <Button 
              type="link" 
              danger 
              onClick={() => onStatusChange(record.id, '已暂停')}
            >
              暂停
            </Button>
          ) : record.status === '已暂停' ? (
            <Button
              type="link"
              onClick={() => onStatusChange(record.id, '投放中')}
            >
              恢复
            </Button>
          ) : null}
          <Button 
            type="link" 
            danger 
            onClick={() => onDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Table
      loading={loading}
      columns={columns}
      dataSource={dataSource}
      rowKey="id"
      pagination={{
        showQuickJumper: true,
        showSizeChanger: true,
        showTotal: (total) => `共 ${total} 条`,
      }}
    />
  );
};

export default AdList; 
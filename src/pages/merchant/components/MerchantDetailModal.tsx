import React from 'react';
import { Modal, Descriptions, Tabs, Table, Timeline, Tag, Button, Space } from 'antd';
import type { TabsProps } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';

interface MerchantDetailModalProps {
  open: boolean;
  onClose: () => void;
  data: any; // 这里应该定义具体的商家数据类型
}

const MerchantDetailModal: React.FC<MerchantDetailModalProps> = ({
  open,
  onClose,
  data,
}) => {
  // 模拟订单数据
  const orderData = [
    {
      id: 1,
      orderNo: 'SX20240315001',
      type: '酒店预订',
      amount: 688,
      status: 'completed',
      createTime: '2024-03-15 10:00:00',
    },
    // 更多订单数据...
  ];

  // 模拟操作日志数据
  const logData = [
    {
      time: '2024-03-15 10:00:00',
      operator: '管理员',
      action: '修改了商家信息',
      details: '更新了联系电话',
    },
    {
      time: '2024-03-14 15:30:00',
      operator: '系统',
      action: '商家状态变更',
      details: '状态从"待审核"变更为"正常"',
    },
    // 更多日志数据...
  ];

  const items: TabsProps['items'] = [
    {
      key: 'basic',
      label: '基本信息',
      children: (
        <Descriptions column={2} bordered>
          <Descriptions.Item label="商家名称">{data?.name}</Descriptions.Item>
          <Descriptions.Item label="商家类型">{data?.type}</Descriptions.Item>
          <Descriptions.Item label="联系人">{data?.contact}</Descriptions.Item>
          <Descriptions.Item label="联系电话">{data?.phone}</Descriptions.Item>
          <Descriptions.Item label="商家地址" span={2}>
            {data?.address}
          </Descriptions.Item>
          <Descriptions.Item label="营业执照">
            <Button type="link" onClick={() => window.open(data?.license)}>
              查看营业执照
            </Button>
          </Descriptions.Item>
          <Descriptions.Item label="状态">
            <Tag color={data?.status === 'active' ? 'success' : 'warning'}>
              {data?.status === 'active' ? '正常' : '待审核'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="注册时间">{data?.createTime}</Descriptions.Item>
          <Descriptions.Item label="最后更新时间">{data?.updateTime}</Descriptions.Item>
        </Descriptions>
      ),
    },
    {
      key: 'orders',
      label: '历史订单',
      children: (
        <Table
          dataSource={orderData}
          columns={[
            { title: '订单号', dataIndex: 'orderNo', key: 'orderNo' },
            { title: '类型', dataIndex: 'type', key: 'type' },
            { 
              title: '金额', 
              dataIndex: 'amount', 
              key: 'amount',
              render: (amount: number) => `¥${amount.toFixed(2)}`,
            },
            {
              title: '状态',
              dataIndex: 'status',
              key: 'status',
              render: (status: string) => (
                <Tag color={status === 'completed' ? 'success' : 'processing'}>
                  {status === 'completed' ? '已完成' : '进行中'}
                </Tag>
              ),
            },
            { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
          ]}
          pagination={{ pageSize: 5 }}
        />
      ),
    },
    {
      key: 'logs',
      label: '操作日志',
      children: (
        <Timeline
          items={logData.map(log => ({
            dot: <ClockCircleOutlined style={{ fontSize: '16px' }} />,
            children: (
              <>
                <p>
                  <Space>
                    <span style={{ color: '#1890ff' }}>{log.operator}</span>
                    <span>{log.action}</span>
                    <span style={{ color: '#999' }}>{log.time}</span>
                  </Space>
                </p>
                <p style={{ color: '#666' }}>{log.details}</p>
              </>
            ),
          }))}
        />
      ),
    },
  ];

  return (
    <Modal
      title="商家详情"
      open={open}
      onCancel={onClose}
      width={1000}
      footer={[
        <Button key="close" onClick={onClose}>
          关闭
        </Button>,
      ]}
    >
      <Tabs defaultActiveKey="basic" items={items} />
    </Modal>
  );
};

export default MerchantDetailModal; 
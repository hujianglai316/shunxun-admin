import React, { useState } from 'react';
import { 
  Card, 
  Table, 
  Space, 
  Input, 
  Select, 
  Tag, 
  Button, 
  DatePicker, 
  Modal, 
  Descriptions, 
  message,
  Row,
  Col,
  Form,
  Divider,
  Typography
} from 'antd';
import {
  SearchOutlined,
  EyeOutlined,
  CloseCircleOutlined,
  RollbackOutlined,
} from '@ant-design/icons';
import type { TablePaginationConfig } from 'antd/es/table';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Text } = Typography;

interface OrderData {
  id: number;
  orderNo: string;
  type: string;
  merchantName: string;
  userName: string;
  userPhone: string;
  amount: number;
  status: string;
  createTime: string;
  payTime: string;
  checkInDate?: string;
  checkOutDate?: string;
  roomType?: string;
  roomCount?: number;
  remark?: string;
  refundAmount?: number;
  refundReason?: string;
  refundTime?: string;
}

const OrderList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<OrderData | null>(null);
  const [form] = Form.useForm();

  // 模拟数据
  const mockData: OrderData[] = [
    {
      id: 1,
      orderNo: 'SX20240315001',
      type: 'hotel',
      merchantName: '瑞森酒店',
      userName: '张三',
      userPhone: '13800138000',
      amount: 688,
      status: 'completed',
      createTime: '2024-03-15 10:00:00',
      payTime: '2024-03-15 10:01:23',
      checkInDate: '2024-03-20',
      checkOutDate: '2024-03-22',
      roomType: '豪华双床房',
      roomCount: 1,
      remark: '需要安排高层房间',
    },
    {
      id: 2,
      orderNo: 'SX20240315002',
      type: 'hotel',
      merchantName: '城市便捷酒店',
      userName: '李四',
      userPhone: '13900139000',
      amount: 458,
      status: 'refunded',
      createTime: '2024-03-15 11:00:00',
      payTime: '2024-03-15 11:02:15',
      checkInDate: '2024-03-21',
      checkOutDate: '2024-03-22',
      roomType: '标准大床房',
      roomCount: 1,
      remark: '',
      refundAmount: 458,
      refundReason: '行程变更',
      refundTime: '2024-03-16 09:15:30',
    },
    // 更多订单数据...
  ];

  const handleSearch = (values: any) => {
    console.log('搜索条件：', values);
    setLoading(true);
    // 模拟API请求
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleViewDetail = (record: OrderData) => {
    setCurrentOrder(record);
    setDetailModalVisible(true);
  };

  const handleCancel = async (orderId: number) => {
    try {
      // 这里添加实际的取消订单逻辑
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success('订单取消成功');
    } catch (error) {
      message.error('订单取消失败');
    }
  };

  const handleRefund = async (orderId: number) => {
    try {
      // 这里添加实际的退款逻辑
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success('退款申请提交成功');
    } catch (error) {
      message.error('退款申请提交失败');
    }
  };

  const renderOrderStatus = (status: string) => {
    const statusMap: Record<string, { text: string; color: string }> = {
      pending: { text: '待支付', color: 'warning' },
      paid: { text: '已支付', color: 'processing' },
      completed: { text: '已完成', color: 'success' },
      cancelled: { text: '已取消', color: 'default' },
      refunded: { text: '已退款', color: 'error' },
    };
    const { text, color } = statusMap[status] || { text: '未知', color: 'default' };
    return <Tag color={color}>{text}</Tag>;
  };

  const columns = [
    {
      title: '订单号',
      dataIndex: 'orderNo',
      key: 'orderNo',
      render: (text: string) => <Text copyable>{text}</Text>,
    },
    {
      title: '订单类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const typeMap = {
          hotel: '酒店预订',
          house: '民宿预订',
        };
        return typeMap[type as keyof typeof typeMap] || type;
      },
    },
    {
      title: '商家名称',
      dataIndex: 'merchantName',
      key: 'merchantName',
    },
    {
      title: '用户信息',
      key: 'userInfo',
      render: (_, record: OrderData) => (
        <>
          <div>{record.userName}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{record.userPhone}</div>
        </>
      ),
    },
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
      render: renderOrderStatus,
    },
    {
      title: '下单时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: OrderData) => (
        <Space size="middle">
          <Button 
            type="link" 
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            查看
          </Button>
          {record.status === 'paid' && (
            <>
              <Button 
                type="link" 
                danger
                icon={<CloseCircleOutlined />}
                onClick={() => handleCancel(record.id)}
              >
                取消
              </Button>
              <Button
                type="link"
                icon={<RollbackOutlined />}
                onClick={() => handleRefund(record.id)}
              >
                退款
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card>
        <Form
          form={form}
          name="order_search"
          onFinish={handleSearch}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item name="keyword" label="搜索">
                <Input 
                  placeholder="订单号/商家名称/用户名" 
                  prefix={<SearchOutlined />} 
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="type" label="订单类型">
                <Select placeholder="请选择订单类型" allowClear>
                  <Option value="hotel">酒店预订</Option>
                  <Option value="house">民宿预订</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="status" label="订单状态">
                <Select placeholder="请选择订单状态" allowClear>
                  <Option value="pending">待支付</Option>
                  <Option value="paid">已支付</Option>
                  <Option value="completed">已完成</Option>
                  <Option value="cancelled">已取消</Option>
                  <Option value="refunded">已退款</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="timeRange" label="下单时间">
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
                <Button onClick={() => form.resetFields()}>
                  重置
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>

      <Card style={{ marginTop: 16 }}>
        <Table
          columns={columns}
          dataSource={mockData}
          rowKey="id"
          loading={loading}
          pagination={{
            total: 100,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>

      <Modal
        title="订单详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={800}
      >
        {currentOrder && (
          <>
            <Descriptions title="基本信息" bordered column={2}>
              <Descriptions.Item label="订单号">{currentOrder.orderNo}</Descriptions.Item>
              <Descriptions.Item label="订单状态">
                {renderOrderStatus(currentOrder.status)}
              </Descriptions.Item>
              <Descriptions.Item label="订单类型">
                {currentOrder.type === 'hotel' ? '酒店预订' : '民宿预订'}
              </Descriptions.Item>
              <Descriptions.Item label="订单金额">
                ¥{currentOrder.amount.toFixed(2)}
              </Descriptions.Item>
              <Descriptions.Item label="下单时间">{currentOrder.createTime}</Descriptions.Item>
              <Descriptions.Item label="支付时间">{currentOrder.payTime}</Descriptions.Item>
            </Descriptions>

            <Divider />

            <Descriptions title="预订信息" bordered column={2}>
              <Descriptions.Item label="商家名称">{currentOrder.merchantName}</Descriptions.Item>
              <Descriptions.Item label="房型">{currentOrder.roomType}</Descriptions.Item>
              <Descriptions.Item label="入住日期">{currentOrder.checkInDate}</Descriptions.Item>
              <Descriptions.Item label="离店日期">{currentOrder.checkOutDate}</Descriptions.Item>
              <Descriptions.Item label="房间数量">{currentOrder.roomCount}间</Descriptions.Item>
              <Descriptions.Item label="备注">{currentOrder.remark || '无'}</Descriptions.Item>
            </Descriptions>

            <Divider />

            <Descriptions title="用户信息" bordered column={2}>
              <Descriptions.Item label="用户姓名">{currentOrder.userName}</Descriptions.Item>
              <Descriptions.Item label="联系电话">{currentOrder.userPhone}</Descriptions.Item>
            </Descriptions>

            {currentOrder.status === 'refunded' && (
              <>
                <Divider />
                <Descriptions title="退款信息" bordered column={2}>
                  <Descriptions.Item label="退款金额">
                    ¥{currentOrder.refundAmount?.toFixed(2)}
                  </Descriptions.Item>
                  <Descriptions.Item label="退款时间">{currentOrder.refundTime}</Descriptions.Item>
                  <Descriptions.Item label="退款原因" span={2}>
                    {currentOrder.refundReason}
                  </Descriptions.Item>
                </Descriptions>
              </>
            )}
          </>
        )}
      </Modal>
    </div>
  );
};

export default OrderList; 
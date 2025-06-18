import React, { useState } from 'react';
import { Card, Descriptions, Button, Space, Tag, Steps, Divider, Row, Col, Typography, Timeline, Modal, Input, Form } from 'antd';
import { ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined, UserOutlined, PhoneOutlined, HomeOutlined, CreditCardOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';

const { Step } = Steps;
const { Title, Text } = Typography;
const { TextArea } = Input;
const { confirm } = Modal;

interface OrderDetail {
  id: string;
  orderNo: string;
  hotelName: string;
  hotelAddress: string;
  roomType: string;
  bedType: string;
  breakfast: string;
  userName: string;
  phone: string;
  idCard: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guestCount: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  amount: number;
  createTime: string;
  payMethod: string;
  payTime: string;
  remark: string;
  timeline: {
    time: string;
    content: string;
    operator?: string;
  }[];
}

const HotelOrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [form] = Form.useForm();

  // 模拟获取订单详情数据
  const orderDetail: OrderDetail = {
    id: '1',
    orderNo: 'O202403200001',
    hotelName: '北京国际酒店',
    hotelAddress: '北京市朝阳区建国门外大街1号',
    roomType: '豪华双床房',
    bedType: '双床',
    breakfast: '双早',
    userName: '张三',
    phone: '13800138000',
    idCard: '110101199001011234',
    checkIn: '2024-03-20',
    checkOut: '2024-03-22',
    nights: 2,
    guestCount: 2,
    status: 'pending',
    amount: 1288,
    createTime: '2024-03-20 10:00:00',
    payMethod: '微信支付',
    payTime: '2024-03-20 10:05:23',
    remark: '希望安排高层安静房间',
    timeline: [
      {
        time: '2024-03-20 10:00:00',
        content: '用户下单',
      },
      {
        time: '2024-03-20 10:05:23',
        content: '用户完成支付',
      }
    ]
  };

  // 获取状态对应的展示信息
  const getStatusInfo = (status: string) => {
    const statusMap = {
      pending: { color: 'processing', text: '待确认', step: 1, icon: <ClockCircleOutlined /> },
      confirmed: { color: 'success', text: '已确认', step: 2, icon: <CheckCircleOutlined /> },
      completed: { color: 'default', text: '已完成', step: 3, icon: <CheckCircleOutlined /> },
      cancelled: { color: 'error', text: '已取消', step: 0, icon: <CloseCircleOutlined /> },
    };
    return statusMap[status as keyof typeof statusMap];
  };

  const statusInfo = getStatusInfo(orderDetail.status);

  // 处理订单确认
  const handleConfirmOrder = () => {
    confirm({
      title: '确认订单',
      icon: <ExclamationCircleOutlined />,
      content: '您确定要接受此订单吗？确认后将通知客户订单已确认。',
      onOk() {
        setConfirmLoading(true);
        // 模拟API调用
        setTimeout(() => {
          setConfirmLoading(false);
          // 处理成功后的逻辑，例如刷新页面或返回列表
          navigate('/hotel/order');
        }, 1500);
      },
    });
  };

  // 处理取消订单
  const handleCancelOrder = () => {
    setCancelModalVisible(true);
  };

  // 提交取消订单
  const handleSubmitCancel = () => {
    if (!cancelReason.trim()) {
      return;
    }
    setConfirmLoading(true);
    // 模拟API调用
    setTimeout(() => {
      setConfirmLoading(false);
      setCancelModalVisible(false);
      // 处理成功后的逻辑，例如刷新页面或返回列表
      navigate('/hotel/order');
    }, 1500);
  };

  return (
    <Card
      title={
        <Space size="middle">
          <span>订单详情</span>
          <Tag color={statusInfo.color}>{statusInfo.text}</Tag>
        </Space>
      }
      extra={
        <Space>
          <Button onClick={() => navigate('/hotel/order')}>返回列表</Button>
          {orderDetail.status === 'pending' && (
            <>
              <Button type="primary" onClick={handleConfirmOrder} loading={confirmLoading}>
                确认订单
              </Button>
              <Button danger onClick={handleCancelOrder} loading={confirmLoading}>
                拒绝订单
              </Button>
            </>
          )}
        </Space>
      }
    >
      {/* 订单进度 */}
      <Steps current={statusInfo.step} status={orderDetail.status === 'cancelled' ? 'error' : 'process'} className="mb-8">
        <Step title="提交订单" description="用户下单" />
        <Step title="等待确认" description="商家确认" />
        <Step title="订单确认" description="入住准备" />
        <Step title="订单完成" description="交易完成" />
      </Steps>

      <Divider />

      {/* 订单基本信息 */}
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Title level={5}>订单信息</Title>
          <Descriptions bordered column={{ xxl: 4, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }}>
            <Descriptions.Item label="订单号">{orderDetail.orderNo}</Descriptions.Item>
            <Descriptions.Item label="下单时间">{orderDetail.createTime}</Descriptions.Item>
            <Descriptions.Item label="支付方式">{orderDetail.payMethod}</Descriptions.Item>
            <Descriptions.Item label="支付时间">{orderDetail.payTime}</Descriptions.Item>
            <Descriptions.Item label="订单状态">
              <Tag color={statusInfo.color}>{statusInfo.text}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="订单金额">¥{orderDetail.amount.toFixed(2)}</Descriptions.Item>
          </Descriptions>
        </Col>

        {/* 入住信息 */}
        <Col span={24}>
          <Title level={5}>入住信息</Title>
          <Descriptions bordered column={{ xxl: 4, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }}>
            <Descriptions.Item label="酒店名称">{orderDetail.hotelName}</Descriptions.Item>
            <Descriptions.Item label="酒店地址">{orderDetail.hotelAddress}</Descriptions.Item>
            <Descriptions.Item label="房型">{orderDetail.roomType}</Descriptions.Item>
            <Descriptions.Item label="床型">{orderDetail.bedType}</Descriptions.Item>
            <Descriptions.Item label="早餐">{orderDetail.breakfast}</Descriptions.Item>
            <Descriptions.Item label="入住日期">{orderDetail.checkIn}</Descriptions.Item>
            <Descriptions.Item label="退房日期">{orderDetail.checkOut}</Descriptions.Item>
            <Descriptions.Item label="入住天数">{orderDetail.nights}晚</Descriptions.Item>
            <Descriptions.Item label="入住人数">{orderDetail.guestCount}人</Descriptions.Item>
          </Descriptions>
        </Col>

        {/* 客户信息 */}
        <Col span={24}>
          <Title level={5}>客户信息</Title>
          <Descriptions bordered column={{ xxl: 4, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }}>
            <Descriptions.Item label="入住人">{orderDetail.userName}</Descriptions.Item>
            <Descriptions.Item label="联系电话">{orderDetail.phone}</Descriptions.Item>
            <Descriptions.Item label="身份证号">{orderDetail.idCard}</Descriptions.Item>
            <Descriptions.Item label="备注">{orderDetail.remark || '无'}</Descriptions.Item>
          </Descriptions>
        </Col>

        {/* 订单操作记录 */}
        <Col span={24}>
          <Title level={5}>订单日志</Title>
          <Timeline
            mode="left"
            items={orderDetail.timeline.map((item) => ({
              label: item.time,
              children: (
                <div>
                  <Text>{item.content}</Text>
                  {item.operator && <Text type="secondary"> - {item.operator}</Text>}
                </div>
              ),
            }))}
          />
        </Col>
      </Row>

      {/* 取消订单模态框 */}
      <Modal
        title="拒绝订单"
        open={cancelModalVisible}
        onOk={handleSubmitCancel}
        onCancel={() => setCancelModalVisible(false)}
        confirmLoading={confirmLoading}
        okText="确认拒绝"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="reason"
            label="拒绝原因"
            rules={[{ required: true, message: '请输入拒绝原因' }]}
          >
            <TextArea
              rows={4}
              placeholder="请输入拒绝订单的原因，将会通知给客户"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default HotelOrderDetail; 
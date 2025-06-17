import React, { useState } from 'react';
import { Card, Table, Button, Input, Space, Tag, DatePicker, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

interface OrderRecord {
  id: string;
  orderNo: string;
  hotelName: string;
  roomType: string;
  userName: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  amount: number;
  createTime: string;
}

const HotelOrder: React.FC = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>();
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);

  const handleViewDetail = (id: string) => {
    navigate(`/hotel/order/detail/${id}`);
  };

  const columns: ColumnsType<OrderRecord> = [
    {
      title: '订单号',
      dataIndex: 'orderNo',
      key: 'orderNo',
      width: 180,
    },
    {
      title: '酒店名称',
      dataIndex: 'hotelName',
      key: 'hotelName',
      width: 200,
      ellipsis: true,
    },
    {
      title: '房型',
      dataIndex: 'roomType',
      key: 'roomType',
      width: 150,
    },
    {
      title: '入住人',
      dataIndex: 'userName',
      key: 'userName',
      width: 100,
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
      width: 120,
    },
    {
      title: '入住时间',
      dataIndex: 'checkIn',
      key: 'checkIn',
      width: 120,
    },
    {
      title: '退房时间',
      dataIndex: 'checkOut',
      key: 'checkOut',
      width: 120,
    },
    {
      title: '订单状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const statusMap = {
          pending: { color: 'processing', text: '待确认' },
          confirmed: { color: 'success', text: '已确认' },
          completed: { color: 'default', text: '已完成' },
          cancelled: { color: 'error', text: '已取消' },
        };
        const { color, text } = statusMap[status as keyof typeof statusMap];
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '订单金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 100,
      render: (amount: number) => `¥${amount.toFixed(2)}`,
    },
    {
      title: '下单时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 160,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleViewDetail(record.id)}>查看</Button>
          {record.status === 'pending' && (
            <>
              <Button type="link">确认</Button>
              <Button type="link" danger>取消</Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  const mockData: OrderRecord[] = [
    {
      id: '1',
      orderNo: 'O202403200001',
      hotelName: '北京国际酒店',
      roomType: '豪华双床房',
      userName: '张三',
      phone: '13800138000',
      checkIn: '2024-03-20',
      checkOut: '2024-03-22',
      status: 'pending',
      amount: 1288,
      createTime: '2024-03-20 10:00:00',
    },
    {
      id: '2',
      orderNo: 'O202403200002',
      hotelName: '上海浦东丽思卡尔顿',
      roomType: '行政套房',
      userName: '李四',
      phone: '13900139000',
      checkIn: '2024-03-21',
      checkOut: '2024-03-23',
      status: 'confirmed',
      amount: 2588,
      createTime: '2024-03-20 11:30:00',
    },
  ];

  // 获取过滤后的数据
  const getFilteredData = () => {
    let filtered = [...mockData];
    
    if (searchText) {
      filtered = filtered.filter(item => 
        item.orderNo.toLowerCase().includes(searchText.toLowerCase()) ||
        item.hotelName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.userName.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    if (statusFilter) {
      filtered = filtered.filter(item => item.status === statusFilter);
    }
    
    return filtered;
  };

  return (
    <Card 
      title="酒店订单管理"
      extra={
        <Button type="primary">新建订单</Button>
      }
      bodyStyle={{ padding: '24px 24px 0' }}
    >
      <div style={{ marginBottom: 16 }}>
        <Space size={8}>
          <Input
            placeholder="搜索订单号/酒店名称"
            prefix={<SearchOutlined />}
            style={{ width: 220 }}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <DatePicker.RangePicker 
            style={{ width: 240 }} 
            onChange={(dates) => {
              if (dates) {
                setDateRange([dates[0]?.format('YYYY-MM-DD') || '', dates[1]?.format('YYYY-MM-DD') || '']);
              } else {
                setDateRange(null);
              }
            }}
          />
          <Select 
            placeholder="订单状态" 
            style={{ width: 120 }} 
            allowClear
            onChange={(value) => setStatusFilter(value)}
          >
            <Option value="pending">待确认</Option>
            <Option value="confirmed">已确认</Option>
            <Option value="completed">已完成</Option>
            <Option value="cancelled">已取消</Option>
          </Select>
        </Space>
      </div>
      <Table
        columns={columns}
        dataSource={getFilteredData()}
        rowKey="id"
        pagination={{
          total: getFilteredData().length,
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`,
        }}
        scroll={{ x: 'max-content' }}
      />
    </Card>
  );
};

export default HotelOrder; 
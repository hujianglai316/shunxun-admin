import React, { useState } from 'react';
import { Table, Button, Input, Space, Tag, Select, Drawer, Form, Image, Timeline } from 'antd';
import { SearchOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import './index.less';

const { Option } = Select;

// 添加操作日志接口定义
interface OperationLog {
  id: string;
  operationType: 'create' | 'update' | 'offline' | 'online' | 'maintenance';
  operationDesc: string;
  operator: string;
  operationTime: string;
  remark?: string;
}

interface RoomItem {
  id: string;
  hotelName: string;
  roomType: string;
  roomCount: number;
  area: number;
  bedType: string;
  maxGuests: number;
  breakfast: string;
  price: number;
  status: 'online' | 'offline' | 'maintenance';
  facilities: string[];
  images: string[];
  lastUpdateTime: string;
  operationLogs: OperationLog[]; // 添加操作日志数组
}

// 模拟操作日志数据
const mockOperationLogs: Record<string, OperationLog[]> = {
  'R001': [
    {
      id: 'L001',
      operationType: 'create',
      operationDesc: '创建房源',
      operator: '张三',
      operationTime: '2024-03-18 14:30:00',
      remark: '初始创建豪华双床房'
    },
    {
      id: 'L002',
      operationType: 'update',
      operationDesc: '修改房间数量',
      operator: '李四',
      operationTime: '2024-03-19 09:15:00',
      remark: '房间数由3间增加至5间'
    },
    {
      id: 'L003',
      operationType: 'update',
      operationDesc: '调整房价',
      operator: '王五',
      operationTime: '2024-03-20 10:00:00',
      remark: '旺季价格调整，由788元/晚上调至888元/晚'
    }
  ],
  'R002': [
    {
      id: 'L004',
      operationType: 'create',
      operationDesc: '创建房源',
      operator: '张三',
      operationTime: '2024-03-19 11:20:00',
      remark: '初始创建行政套房'
    },
    {
      id: 'L005',
      operationType: 'update',
      operationDesc: '更新设施信息',
      operator: '李四',
      operationTime: '2024-03-20 09:30:00',
      remark: '新增行政酒廊服务'
    }
  ],
  'R003': [
    {
      id: 'L006',
      operationType: 'create',
      operationDesc: '创建房源',
      operator: '王五',
      operationTime: '2024-03-19 15:00:00',
      remark: '初始创建海景房'
    },
    {
      id: 'L007',
      operationType: 'maintenance',
      operationDesc: '设置维护状态',
      operator: '赵六',
      operationTime: '2024-03-19 16:45:00',
      remark: '房间进行装修维护'
    }
  ],
  'R004': [
    {
      id: 'L008',
      operationType: 'create',
      operationDesc: '创建房源',
      operator: '张三',
      operationTime: '2024-03-19 14:00:00',
      remark: '初始创建标准双床房'
    },
    {
      id: 'L009',
      operationType: 'update',
      operationDesc: '修改房型信息',
      operator: '李四',
      operationTime: '2024-03-19 15:20:00',
      remark: '更新床型描述'
    }
  ],
  'R005': [
    {
      id: 'L010',
      operationType: 'create',
      operationDesc: '创建房源',
      operator: '王五',
      operationTime: '2024-03-19 13:00:00',
      remark: '初始创建亲子主题房'
    },
    {
      id: 'L011',
      operationType: 'update',
      operationDesc: '更新设施信息',
      operator: '赵六',
      operationTime: '2024-03-19 14:00:00',
      remark: '新增儿童游戏区和洗浴用品'
    },
    {
      id: 'L012',
      operationType: 'offline',
      operationDesc: '下架房源',
      operator: '张三',
      operationTime: '2024-03-19 14:10:00',
      remark: '临时下架进行设施调整'
    }
  ]
};

// 更新模拟数据，添加操作日志
const mockRoomsData: RoomItem[] = [
  {
    id: 'R001',
    hotelName: '北京国际酒店',
    roomType: '豪华双床房',
    roomCount: 5,
    area: 45,
    bedType: '2张1.5米双人床',
    maxGuests: 2,
    breakfast: '双早',
    price: 888,
    status: 'online' as const,
    facilities: ['WiFi', '空调', '电视', '冰箱', '独立卫浴', '24小时热水'],
    images: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421b',
    ],
    lastUpdateTime: '2024-03-20 10:00:00',
    operationLogs: mockOperationLogs['R001'],
  },
  {
    id: 'R002',
    hotelName: '上海浦东丽思卡尔顿',
    roomType: '行政套房',
    roomCount: 3,
    area: 68,
    bedType: '1张2米大床',
    maxGuests: 2,
    breakfast: '双早',
    price: 1888,
    status: 'online' as const,
    facilities: ['WiFi', '空调', '电视', '冰箱', '独立卫浴', '24小时热水', '行政酒廊', '欢迎水果'],
    images: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421c',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421d',
    ],
    lastUpdateTime: '2024-03-20 09:30:00',
    operationLogs: mockOperationLogs['R002'],
  },
  {
    id: 'R003',
    hotelName: '广州白天鹅宾馆',
    roomType: '海景房',
    roomCount: 8,
    area: 55,
    bedType: '1张1.8米大床',
    maxGuests: 2,
    breakfast: '双早',
    price: 1288,
    status: 'maintenance' as const,
    facilities: ['WiFi', '空调', '电视', '冰箱', '独立卫浴', '24小时热水', '海景阳台'],
    images: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421e',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421f',
    ],
    lastUpdateTime: '2024-03-19 16:45:00',
    operationLogs: mockOperationLogs['R003'],
  },
  {
    id: 'R004',
    hotelName: '深圳星河丽思卡尔顿',
    roomType: '标准双床房',
    roomCount: 12,
    area: 42,
    bedType: '2张1.2米单人床',
    maxGuests: 2,
    breakfast: '双早',
    price: 688,
    status: 'online' as const,
    facilities: ['WiFi', '空调', '电视', '冰箱', '独立卫浴', '24小时热水'],
    images: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421g',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421h',
    ],
    lastUpdateTime: '2024-03-19 15:20:00',
    operationLogs: mockOperationLogs['R004'],
  },
  {
    id: 'R005',
    hotelName: '杭州西子湖四季酒店',
    roomType: '亲子主题房',
    roomCount: 6,
    area: 60,
    bedType: '1张1.8米大床+1张1.2米儿童床',
    maxGuests: 3,
    breakfast: '三早',
    price: 1588,
    status: 'offline' as const,
    facilities: ['WiFi', '空调', '电视', '冰箱', '独立卫浴', '24小时热水', '儿童游戏区', '儿童洗浴用品'],
    images: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421i',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421j',
    ],
    lastUpdateTime: '2024-03-19 14:10:00',
    operationLogs: mockOperationLogs['R005'],
  },
].map(room => ({
  ...room,
  operationLogs: mockOperationLogs[room.id] || [],
}));

const RentalRoomsPage: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<RoomItem>();

  // 处理搜索
  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  // 处理状态筛选
  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
  };

  // 获取过滤后的数据
  const getFilteredData = () => {
    let filtered = [...mockRoomsData];
    
    if (searchText) {
      filtered = filtered.filter(item => 
        item.hotelName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.roomType.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    if (statusFilter) {
      filtered = filtered.filter(item => item.status === statusFilter);
    }
    
    return filtered;
  };

  // 查看房间详情
  const handleView = (record: RoomItem) => {
    setCurrentRoom(record);
    setDrawerVisible(true);
  };

  // 获取操作类型对应的颜色和图标
  const getOperationTypeStyle = (type: OperationLog['operationType']) => {
    const styleMap = {
      create: { color: 'green', label: '创建' },
      update: { color: 'blue', label: '更新' },
      offline: { color: 'red', label: '下架' },
      online: { color: 'green', label: '上线' },
      maintenance: { color: 'orange', label: '维护' },
    };
    return styleMap[type];
  };

  const columns: ColumnsType<RoomItem> = [
    {
      title: '酒店名称',
      dataIndex: 'hotelName',
      key: 'hotelName',
      width: 180,
      ellipsis: true,
    },
    {
      title: '房型',
      dataIndex: 'roomType',
      key: 'roomType',
      width: 120,
      ellipsis: true,
    },
    {
      title: '房间数',
      dataIndex: 'roomCount',
      key: 'roomCount',
      width: 80,
    },
    {
      title: '面积(㎡)',
      dataIndex: 'area',
      key: 'area',
      width: 80,
      render: (area: number) => `${area}㎡`,
    },
    {
      title: '床型',
      dataIndex: 'bedType',
      key: 'bedType',
      width: 160,
      ellipsis: true,
    },
    {
      title: '价格(元/晚)',
      dataIndex: 'price',
      key: 'price',
      width: 100,
      render: (price: number) => `￥${price}`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: string) => {
        const statusMap = {
          online: { color: 'success', text: '在线' },
          offline: { color: 'default', text: '下架' },
          maintenance: { color: 'warning', text: '维护中' },
        };
        const { color, text } = statusMap[status as keyof typeof statusMap];
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '最后更新时间',
      dataIndex: 'lastUpdateTime',
      key: 'lastUpdateTime',
      width: 150,
    },
    {
      title: '操作',
      key: 'action',
      width: 60,
      render: (_, record) => (
        <Button 
          type="link" 
          icon={<EyeOutlined />} 
          onClick={() => handleView(record)}
        />
      ),
    },
  ];

  return (
    <>
      <div className="mb-4">
        <Space size={8}>
          <Button type="primary" icon={<PlusOutlined />}>
            新增房源
          </Button>
          <Input
            placeholder="搜索房源名称/地址"
            prefix={<SearchOutlined />}
            style={{ width: 220 }}
          />
          <Select
            placeholder="房源状态"
            style={{ width: 120 }}
            allowClear
          >
            <Select.Option value="available">可租</Select.Option>
            <Select.Option value="rented">已租</Select.Option>
            <Select.Option value="maintaining">维护中</Select.Option>
            <Select.Option value="reserved">已预订</Select.Option>
          </Select>
        </Space>
      </div>

      <Table<RoomItem>
        columns={columns}
        dataSource={getFilteredData()}
        rowKey="id"
        size="middle"
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`,
          defaultPageSize: 10,
          size: 'small'
        }}
      />

      <Drawer
        title={currentRoom?.hotelName}
        placement="right"
        width={600}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        className="room-detail-drawer"
      >
        {currentRoom && (
          <div className="room-detail">
            <div className="detail-section">
              <h3>房型信息</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="label">房型名称：</span>
                  <span className="value">{currentRoom.roomType}</span>
                </div>
                <div className="detail-item">
                  <span className="label">房间数：</span>
                  <span className="value">{currentRoom.roomCount}</span>
                </div>
                <div className="detail-item">
                  <span className="label">房间面积：</span>
                  <span className="value">{currentRoom.area}㎡</span>
                </div>
                <div className="detail-item">
                  <span className="label">床型：</span>
                  <span className="value">{currentRoom.bedType}</span>
                </div>
                <div className="detail-item">
                  <span className="label">最大入住人数：</span>
                  <span className="value">{currentRoom.maxGuests}人</span>
                </div>
                <div className="detail-item">
                  <span className="label">价格：</span>
                  <span className="value">￥{currentRoom.price}/晚</span>
                </div>
                <div className="detail-item">
                  <span className="label">状态：</span>
                  <span className="value">
                    <Tag color={
                      currentRoom.status === 'online' ? 'success' : 
                      currentRoom.status === 'offline' ? 'default' : 'warning'
                    }>
                      {
                        currentRoom.status === 'online' ? '在线' :
                        currentRoom.status === 'offline' ? '下架' : '维护中'
                      }
                    </Tag>
                  </span>
                </div>
                <div className="detail-item">
                  <span className="label">最后更新：</span>
                  <span className="value">{currentRoom.lastUpdateTime}</span>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h3>房间设施</h3>
              <div className="facilities">
                {currentRoom.facilities.map((facility, index) => (
                  <Tag key={index}>{facility}</Tag>
                ))}
              </div>
            </div>

            <div className="detail-section">
              <h3>房间图片</h3>
              <div className="room-images">
                <Image.PreviewGroup>
                  {currentRoom.images.map((image, index) => (
                    <div key={index} className="image-wrapper">
                      <Image
                        src={image}
                        width="100%"
                        height={200}
                        className="room-image"
                      />
                    </div>
                  ))}
                </Image.PreviewGroup>
              </div>
            </div>

            <div className="detail-section">
              <h3>操作日志</h3>
              <div className="operation-logs">
                <Timeline>
                  {currentRoom.operationLogs.map((log) => {
                    const typeStyle = getOperationTypeStyle(log.operationType);
                    return (
                      <Timeline.Item
                        key={log.id}
                        color={typeStyle.color}
                      >
                        <div className="log-item">
                          <div className="log-header">
                            <span className="operation-type">
                              <Tag color={typeStyle.color}>{typeStyle.label}</Tag>
                            </span>
                            <span className="operation-time">{log.operationTime}</span>
                          </div>
                          <div className="log-content">
                            <div className="operation-desc">{log.operationDesc}</div>
                            {log.remark && (
                              <div className="operation-remark">备注：{log.remark}</div>
                            )}
                            <div className="operator">操作人：{log.operator}</div>
                          </div>
                        </div>
                      </Timeline.Item>
                    );
                  })}
                </Timeline>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </>
  );
};

export default RentalRoomsPage; 
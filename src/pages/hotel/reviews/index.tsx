import React, { useState } from 'react';
import { Table, Button, Input, Space, Tag, Select, Rate, Image, Drawer, Form, Radio, Card } from 'antd';
import { SearchOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Option } = Select;
const { TextArea } = Input;

// 评价记录接口定义
interface ReviewRecord {
  id: string;
  hotelName: string;
  roomType: string;
  orderNo: string;
  userName: string;
  rating: number;
  content: string;
  images?: string[];
  reply?: string;
  status: 'pending' | 'approved' | 'rejected' | 'hidden';
  createTime: string;
  tags: string[];
}

// 模拟评价数据
const mockReviewData: ReviewRecord[] = [
  {
    id: 'R001',
    hotelName: '北京国际酒店',
    roomType: '豪华双床房',
    orderNo: 'O202403200001',
    userName: '张先生',
    rating: 5,
    content: '房间非常干净整洁，服务态度很好，设施齐全，地理位置优越，交通便利。早餐种类丰富，味道可口。前台服务人员专业且热情，入住体验非常棒！',
    images: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421b',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421c',
    ],
    status: 'approved',
    createTime: '2024-03-20 10:00:00',
    tags: ['环境优美', '服务周到', '设施完善', '早餐丰富'],
    reply: '尊敬的张先生，感谢您对我们酒店的认可和好评！我们一直致力于为客人提供优质的服务和舒适的住宿体验。您的鼓励是我们继续前进的动力。期待您下次再次光临！',
  },
  {
    id: 'R002',
    hotelName: '上海浦东丽思卡尔顿',
    roomType: '行政套房',
    orderNo: 'O202403200002',
    userName: '李女士',
    rating: 4,
    content: '酒店位置很好，就在陆家嘴商圈，周边购物、餐饮都很方便。房间视野开阔，能看到外滩夜景。不过房间隔音稍微差了点，能听到走廊的声音。',
    status: 'approved',
    createTime: '2024-03-20 09:30:00',
    reply: '尊敬的李女士，感谢您的评价。我们已经注意到隔音问题，将会在后续改造中进行优化。同时，我们也会加强员工走廊巡视的培训，尽量减少噪音影响。如果您下次入住，我们可以为您安排相对安静的房间。',
    tags: ['位置优越', '视野开阔', '隔音一般'],
  },
  {
    id: 'R003',
    hotelName: '广州白天鹅宾馆',
    roomType: '海景房',
    orderNo: 'O202403190001',
    userName: '王先生',
    rating: 2,
    content: '房间设施老旧，空调声音很大，影响睡眠。服务态度也一般，叫了工程部来修空调，等了很久才来。价格不便宜，但体验很差。',
    status: 'approved',
    createTime: '2024-03-19 16:45:00',
    tags: ['设施陈旧', '服务不佳', '性价比低'],
    reply: '尊敬的王先生，对于您在入住期间遇到的问题，我们深表歉意。您反映的空调问题和服务响应速度问题，我们已经进行了严肃处理。工程部门已对所有客房空调设备进行了全面检修，同时我们也优化了工程部门的响应流程。作为补偿，我们将为您提供一晚免费住宿，希望能有机会重新为您服务。',
  },
  {
    id: 'R004',
    hotelName: '深圳星河丽思卡尔顿',
    roomType: '标准双床房',
    orderNo: 'O202403190002',
    userName: '赵女士',
    rating: 5,
    content: '第二次入住了，一如既往的好。房间干净整洁，床品舒适，洗浴用品都是欧舒丹的，很贴心。前台小姐姐服务很专业，办理入住很快。',
    images: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421d',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421e',
    ],
    status: 'approved',
    createTime: '2024-03-19 15:20:00',
    tags: ['干净整洁', '服务专业', '用品高档'],
    reply: '尊敬的赵女士，非常感谢您再次选择入住我们酒店！您的认可是对我们最大的鼓励。我们注意到这是您第二次入住，已将您加入我们的VIP客户名单。下次入住时可享受升级房型的优惠，期待再次见到您！',
  },
  {
    id: 'R005',
    hotelName: '杭州西子湖四季酒店',
    roomType: '亲子主题房',
    orderNo: 'O202403190003',
    userName: '陈女士',
    rating: 1,
    content: '酒店提供的儿童玩具和设施都很脏，明显没有及时清洁消毒。房间有异味，开窗通风后也没有改善。强烈不推荐带孩子入住！',
    status: 'approved',
    createTime: '2024-03-19 14:10:00',
    tags: ['卫生差', '异味大', '不适合儿童'],
    reply: '尊敬的陈女士，非常抱歉给您和孩子带来了不愉快的入住体验。您反映的问题确实非常严重，我们已经第一时间对亲子房的所有设施进行了彻底消毒和更换。同时也对房间进行了全面清洁和空气治理。我们的客房部经理已联系您，希望能当面向您致歉并提供相应的补偿方案。',
  },
  {
    id: 'R006',
    hotelName: '成都香格里拉大酒店',
    roomType: '豪华江景房',
    orderNo: 'O202403180001',
    userName: '刘先生',
    rating: 3,
    content: '硬件设施还不错，但是服务水平有待提高。入住时前台排队等候时间过长，叫客房服务也需要等很久。不过房间视野很好，能看到整个江景。',
    status: 'approved',
    createTime: '2024-03-18 16:30:00',
    tags: ['视野好', '服务效率低', '等待时间长'],
    reply: '尊敬的刘先生，感谢您的中肯评价。针对您提到的等候时间问题，我们已经着手优化入住流程，增加了高峰时段的前台人员配置。同时也对客房服务团队进行了培训，制定了服务响应时间标准。欢迎您再次光临，体验我们改进后的服务。',
  },
  {
    id: 'R007',
    hotelName: '三亚海棠湾威斯汀度假酒店',
    roomType: '海景套房',
    orderNo: 'O202403180002',
    userName: '周女士',
    rating: 4,
    content: '酒店的私人沙滩很棒，泳池也很干净。早餐种类丰富，中西式都有。房间稍微有点味道，可能是新装修的原因。服务人员态度很好，有求必应。',
    images: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421f',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421g',
    ],
    status: 'approved',
    createTime: '2024-03-18 14:20:00',
    tags: ['环境优美', '服务周到', '早餐丰富', '装修味道'],
    reply: '尊敬的周女士，感谢您的评价！很高兴您对我们的沙滩、泳池和早餐感到满意。关于房间的味道问题，我们深表歉意。这确实是由于近期部分房间进行了软装更新造成的，我们已加强通风措施。感谢您的理解，期待您的再次光临！',
  },
  {
    id: 'R008',
    hotelName: '西安钟楼艾尚酒店',
    roomType: '古城景观房',
    orderNo: 'O202403170001',
    userName: '孙先生',
    rating: 5,
    content: '位置绝佳，就在钟楼旁边，出行特别方便。房间装修很有特色，融合了古今元素。最让人印象深刻的是员工的服务，前台小哥很热情，不仅帮我们规划了游览路线，还推荐了很多当地美食。',
    status: 'pending',
    createTime: '2024-03-17 20:15:00',
    tags: ['位置优越', '特色装修', '服务贴心', '出行方便'],
  }
];

const HotelReviews: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>();
  const [ratingFilter, setRatingFilter] = useState<number>();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [currentReview, setCurrentReview] = useState<ReviewRecord>();
  const [form] = Form.useForm();

  // 处理搜索
  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  // 处理状态筛选
  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
  };

  // 处理评分筛选
  const handleRatingFilter = (value: number) => {
    setRatingFilter(value);
  };

  // 获取过滤后的数据
  const getFilteredData = () => {
    let filtered = [...mockReviewData];
    
    if (searchText) {
      filtered = filtered.filter(item => 
        item.hotelName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.userName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.orderNo.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    if (statusFilter) {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    if (ratingFilter) {
      filtered = filtered.filter(item => item.rating === ratingFilter);
    }
    
    return filtered;
  };

  // 查看评价详情
  const handleView = (record: ReviewRecord) => {
    setCurrentReview(record);
    setDrawerVisible(true);
  };

  // 获取状态标签样式
  const getStatusTag = (status: string) => {
    const statusMap = {
      pending: { color: 'processing', text: '待审核' },
      approved: { color: 'success', text: '已通过' },
      rejected: { color: 'error', text: '已拒绝' },
      hidden: { color: 'default', text: '已隐藏' },
    };
    const { color, text } = statusMap[status as keyof typeof statusMap];
    return <Tag color={color}>{text}</Tag>;
  };

  const columns: ColumnsType<ReviewRecord> = [
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
      title: '评分',
      dataIndex: 'rating',
      key: 'rating',
      width: 120,
      render: (rating) => <Rate disabled defaultValue={rating} />,
    },
    {
      title: '评价内容',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
    },
    {
      title: '酒店回复',
      dataIndex: 'reply',
      key: 'reply',
      width: 100,
      render: (reply) => (
        reply ? <Tag color="success">已回复</Tag> : <Tag color="default">未回复</Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => getStatusTag(status),
    },
    {
      title: '评价时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 160,
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_, record) => (
        <Space>
          <Button 
            type="link" 
            icon={<EyeOutlined />} 
            onClick={() => handleView(record)}
          >
            查看
          </Button>
          {record.status === 'pending' && (
            <>
              <Button type="link">通过</Button>
              <Button type="link" danger>拒绝</Button>
            </>
          )}
          {record.status === 'approved' && (
            <Button type="link" icon={<DeleteOutlined />} danger>
              隐藏
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Card 
      title="酒店评价管理"
      extra={
        <Space>
          <Button>导出评价</Button>
          <Button type="primary">批量回复</Button>
        </Space>
      }
    >
      <div className="mb-4">
        <Space size={8}>
          <Input
            placeholder="搜索酒店名称/订单号"
            prefix={<SearchOutlined />}
            style={{ width: 220 }}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <Select 
            placeholder="评价状态" 
            style={{ width: 100 }} 
            allowClear
            onChange={handleStatusFilter}
          >
            <Option value="pending">待审核</Option>
            <Option value="approved">已通过</Option>
            <Option value="rejected">已拒绝</Option>
            <Option value="hidden">已隐藏</Option>
          </Select>
          <Select
            placeholder="评分筛选"
            style={{ width: 100 }}
            allowClear
            onChange={handleRatingFilter}
          >
            <Option value={5}>5星</Option>
            <Option value={4}>4星</Option>
            <Option value={3}>3星</Option>
            <Option value={2}>2星</Option>
            <Option value={1}>1星</Option>
          </Select>
        </Space>
      </div>

      <Table<ReviewRecord>
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
        title="评价详情"
        placement="right"
        width={600}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        className="review-detail-drawer"
      >
        {currentReview && (
          <div className="review-detail">
            <div className="detail-section">
              <h3>基本信息</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="label">酒店名称：</span>
                  <span className="value">{currentReview.hotelName}</span>
                </div>
                <div className="detail-item">
                  <span className="label">房型：</span>
                  <span className="value">{currentReview.roomType}</span>
                </div>
                <div className="detail-item">
                  <span className="label">订单号：</span>
                  <span className="value">{currentReview.orderNo}</span>
                </div>
                <div className="detail-item">
                  <span className="label">评价人：</span>
                  <span className="value">{currentReview.userName}</span>
                </div>
                <div className="detail-item">
                  <span className="label">评价时间：</span>
                  <span className="value">{currentReview.createTime}</span>
                </div>
                <div className="detail-item">
                  <span className="label">状态：</span>
                  <span className="value">{getStatusTag(currentReview.status)}</span>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h3>评价内容</h3>
              <div className="review-content">
                <div className="rating">
                  <span className="label">评分：</span>
                  <Rate disabled defaultValue={currentReview.rating} />
                </div>
                <div className="tags">
                  <span className="label">标签：</span>
                  <Space size={[0, 8]} wrap>
                    {currentReview.tags.map((tag, index) => (
                      <Tag key={index}>{tag}</Tag>
                    ))}
                  </Space>
                </div>
                <div className="content">
                  <span className="label">评价：</span>
                  <div className="text">{currentReview.content}</div>
                </div>
                {currentReview.images && currentReview.images.length > 0 && (
                  <div className="images">
                    <span className="label">图片：</span>
                    <div className="image-list">
                      <Image.PreviewGroup>
                        {currentReview.images.map((image, index) => (
                          <Image
                            key={index}
                            src={image}
                            width="100%"
                            height={120}
                            style={{ objectFit: 'cover', borderRadius: '4px' }}
                          />
                        ))}
                      </Image.PreviewGroup>
                    </div>
                  </div>
                )}
                {currentReview.reply && (
                  <div className="reply">
                    <span className="label">回复：</span>
                    <div className="text">{currentReview.reply}</div>
                  </div>
                )}
              </div>
            </div>

            {currentReview.status === 'pending' && (
              <div className="detail-section">
                <h3>审核操作</h3>
                <Form form={form} layout="vertical">
                  <Form.Item
                    name="status"
                    label="审核结果"
                    rules={[{ required: true, message: '请选择审核结果' }]}
                  >
                    <Radio.Group>
                      <Radio value="approved">通过</Radio>
                      <Radio value="rejected">拒绝</Radio>
                    </Radio.Group>
                  </Form.Item>
                  <Form.Item
                    name="reply"
                    label="回复内容"
                  >
                    <TextArea rows={4} placeholder="请输入回复内容" />
                  </Form.Item>
                  <Form.Item>
                    <Space>
                      <Button type="primary">确认</Button>
                      <Button onClick={() => setDrawerVisible(false)}>取消</Button>
                    </Space>
                  </Form.Item>
                </Form>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </Card>
  );
};

export default HotelReviews; 
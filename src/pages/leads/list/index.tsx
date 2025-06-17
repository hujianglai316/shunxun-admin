import React, { useState } from 'react';
import { Card, Table, Button, Input, Space, Tag, DatePicker, Select, Radio } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { SorterResult } from 'antd/es/table/interface';
import { useNavigate, useLocation } from 'react-router-dom';

const { RangePicker } = DatePicker;
const { Option } = Select;

// 业务模块类型
enum BusinessModule {
  HOME = 'home',
  HOTEL = 'hotel',
  RENTAL = 'rental',
}

// 业务模块配置
const businessModules = [
  { 
    key: BusinessModule.HOME, 
    label: '首页', 
    path: '/dashboard',
    children: [
      { path: '/dashboard', label: '仪表盘' },
      { path: '/merchant/list', label: '商家管理' },
      { path: '/leads/list', label: '线索管理' },
      { path: '/order/list', label: '订单管理' },
      { path: '/user/list', label: '用户管理' },
      { path: '/finance/settlement', label: '财务管理' },
      { path: '/content/reviews', label: '内容管理' },
      { path: '/marketing/activities', label: '营销管理' },
      { path: '/stats/business', label: '数据报表' },
      { path: '/settings/account', label: '系统设置' },
    ]
  },
  { 
    key: BusinessModule.HOTEL, 
    label: '酒店业务管理', 
    path: '/hotel',
    children: []
  },
  { 
    key: BusinessModule.RENTAL, 
    label: '租房业务管理', 
    path: '/rental',
    children: []
  },
];

// 商家类型枚举
enum MerchantType {
  HOTEL = 'HOTEL',
  APARTMENT = 'APARTMENT',
  RESORT = 'RESORT',
  HOMESTAY = 'HOMESTAY',
}

// 商家类型映射
const merchantTypeMap = {
  [MerchantType.HOTEL]: '酒店',
  [MerchantType.APARTMENT]: '公寓',
  [MerchantType.RESORT]: '度假村',
  [MerchantType.HOMESTAY]: '民宿',
};

interface LeadItem {
  id: string;
  city: string;
  address: string;
  merchantType: MerchantType;
  contactName: string;
  contactPhone: string;
  source: string;
  status: string;
  createTime: string;
  followUpTime: string;
  remark: string;
  assignee?: string;
  priority: 'high' | 'medium' | 'low';
  [key: string]: string | undefined;
}

// 模拟数据
const mockData: LeadItem[] = [
  {
    id: '1',
    city: '北京市',
    address: '朝阳区三里屯',
    merchantType: MerchantType.HOTEL,
    contactName: '张三',
    contactPhone: '13800138001',
    source: '官网注册',
    status: 'pending',
    createTime: '2024-03-20 10:00:00',
    followUpTime: '2024-03-20 15:00:00',
    remark: '有意向合作，需要进一步跟进',
    assignee: '李四',
    priority: 'high',
  },
  {
    id: '2',
    city: '上海市',
    address: '浦东新区陆家嘴',
    merchantType: MerchantType.APARTMENT,
    contactName: '王五',
    contactPhone: '13800138002',
    source: '销售推荐',
    status: 'following',
    createTime: '2024-03-19 14:30:00',
    followUpTime: '2024-03-20 11:20:00',
    remark: '正在商谈具体合作细节',
    assignee: '赵六',
    priority: 'medium',
  },
  {
    id: '3',
    city: '广州市',
    address: '天河区珠江新城',
    merchantType: MerchantType.HOTEL,
    contactName: '李七',
    contactPhone: '13800138003',
    source: '展会获取',
    status: 'converted',
    createTime: '2024-03-18 09:15:00',
    followUpTime: '2024-03-19 16:40:00',
    remark: '已完成合同签署',
    assignee: '王八',
    priority: 'low',
  },
  {
    id: '4',
    city: '深圳市',
    address: '南山区科技园',
    merchantType: MerchantType.RESORT,
    contactName: '赵九',
    contactPhone: '13800138004',
    source: '朋友推荐',
    status: 'failed',
    createTime: '2024-03-17 11:00:00',
    followUpTime: '2024-03-18 14:30:00',
    remark: '因价格原因暂时搁置',
    assignee: '钱十',
    priority: 'low',
  },
  {
    id: '5',
    city: '杭州市',
    address: '西湖区湖滨',
    merchantType: MerchantType.HOMESTAY,
    contactName: '孙十一',
    contactPhone: '13800138005',
    source: '官网注册',
    status: 'pending',
    createTime: '2024-03-16 16:20:00',
    followUpTime: '2024-03-17 10:15:00',
    remark: '需要产品演示',
    assignee: '周十二',
    priority: 'medium',
  },
  {
    id: '6',
    city: '成都市',
    address: '锦江区春熙路',
    merchantType: MerchantType.HOTEL,
    contactName: '吴十三',
    contactPhone: '13800138006',
    source: '销售推荐',
    status: 'following',
    createTime: '2024-03-15 13:40:00',
    followUpTime: '2024-03-16 09:30:00',
    remark: '正在评估合作方案',
    assignee: '郑十四',
    priority: 'high',
  },
  {
    id: '7',
    city: '武汉市',
    address: '江汉区解放大道',
    merchantType: MerchantType.APARTMENT,
    contactName: '冯十五',
    contactPhone: '13800138007',
    source: '展会获取',
    status: 'converted',
    createTime: '2024-03-14 15:50:00',
    followUpTime: '2024-03-15 14:20:00',
    remark: '已安排系统对接',
    assignee: '陈十六',
    priority: 'medium',
  },
  {
    id: '8',
    city: '西安市',
    address: '碑林区南大街',
    merchantType: MerchantType.HOMESTAY,
    contactName: '楚十七',
    contactPhone: '13800138008',
    source: '朋友推荐',
    status: 'pending',
    createTime: '2024-03-13 10:30:00',
    followUpTime: '2024-03-14 11:45:00',
    remark: '等待客户反馈',
    assignee: '魏十八',
    priority: 'low',
  },
  {
    id: '9',
    city: '青岛市',
    address: '市南区香港中路',
    merchantType: MerchantType.RESORT,
    contactName: '蒋十九',
    contactPhone: '13800138009',
    source: '官网注册',
    status: 'following',
    createTime: '2024-03-12 14:15:00',
    followUpTime: '2024-03-13 16:30:00',
    remark: '准备第二次商务洽谈',
    assignee: '沈二十',
    priority: 'high',
  },
  {
    id: '10',
    city: '南京市',
    address: '秦淮区夫子庙',
    merchantType: MerchantType.HOTEL,
    contactName: '韩二十一',
    contactPhone: '13800138010',
    source: '销售推荐',
    status: 'pending',
    createTime: '2024-03-11 09:45:00',
    followUpTime: '2024-03-12 10:20:00',
    remark: '待安排现场考察',
    assignee: '杨二十二',
    priority: 'medium',
  },
];

const LeadsList: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<LeadItem[]>(mockData);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: mockData.length });
  const [selectedCity, setSelectedCity] = useState<string>();
  const [selectedType, setSelectedType] = useState<MerchantType>();
  const [selectedStatus, setSelectedStatus] = useState<string>();
  const [currentModule, setCurrentModule] = useState<BusinessModule>(BusinessModule.HOME);

  // 处理业务模块切换
  const handleModuleChange = (module: BusinessModule) => {
    setCurrentModule(module);
    const moduleConfig = businessModules.find(m => m.key === module);
    if (moduleConfig) {
      // 导航到模块的第一个子页面（如果有）
      const firstChild = moduleConfig.children[0];
      navigate(firstChild?.path || moduleConfig.path);
    }
  };

  // 判断当前路径是否属于某个模块
  React.useEffect(() => {
    const currentPath = location.pathname;
    const module = businessModules.find(m => 
      m.children.some(child => child.path === currentPath)
    );
    if (module) {
      setCurrentModule(module.key);
    }
  }, [location.pathname]);

  const columns: ColumnsType<LeadItem> = [
    {
      title: '商家信息',
      key: 'merchantInfo',
      render: (_, record) => (
        <div>
          <div>
            <a onClick={() => navigate(`/leads/detail/${record.id}`)}>{record.contactName}</a>
            <span className="ml-2">{record.contactPhone}</span>
          </div>
          <div className="text-gray-500 text-sm">
            {record.city} {record.address}
          </div>
        </div>
      ),
    },
    {
      title: '商家类型',
      dataIndex: 'merchantType',
      key: 'merchantType',
      render: (type: MerchantType) => (
        <Tag>{merchantTypeMap[type]}</Tag>
      ),
      filters: Object.entries(merchantTypeMap).map(([key, value]) => ({
        text: value,
        value: key,
      })),
    },
    {
      title: '来源',
      dataIndex: 'source',
      key: 'source',
      render: (text: string) => (
        <Tag color="blue">{text}</Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap = {
          'pending': { color: 'orange', text: '待跟进' },
          'following': { color: 'blue', text: '跟进中' },
          'converted': { color: 'green', text: '已转化' },
          'failed': { color: 'red', text: '已失效' },
        };
        const { color, text } = statusMap[status as keyof typeof statusMap] || { color: 'default', text: status };
        return <Tag color={color}>{text}</Tag>;
      },
      filters: [
        { text: '待跟进', value: 'pending' },
        { text: '跟进中', value: 'following' },
        { text: '已转化', value: 'converted' },
        { text: '已失效', value: 'failed' },
      ],
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => {
        const priorityMap = {
          'high': { color: 'red', text: '高' },
          'medium': { color: 'orange', text: '中' },
          'low': { color: 'blue', text: '低' },
        };
        const { color, text } = priorityMap[priority as keyof typeof priorityMap];
        return <Tag color={color}>{text}</Tag>;
      },
      filters: [
        { text: '高', value: 'high' },
        { text: '中', value: 'medium' },
        { text: '低', value: 'low' },
      ],
    },
    {
      title: '负责人',
      dataIndex: 'assignee',
      key: 'assignee',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      sorter: true,
    },
    {
      title: '最近跟进时间',
      dataIndex: 'followUpTime',
      key: 'followUpTime',
      sorter: true,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleFollowUp(record)}>跟进</a>
          <a onClick={() => handleEdit(record)}>编辑</a>
          <a onClick={() => handleAssign(record)}>分配</a>
        </Space>
      ),
    },
  ];

  const handleFollowUp = (record: LeadItem) => {
    // 处理跟进操作
    console.log('跟进线索:', record.id);
    navigate(`/leads/follow/${record.id}`);
  };

  const handleEdit = (record: LeadItem) => {
    // 处理编辑操作
    console.log('编辑线索:', record.id);
    navigate(`/leads/edit/${record.id}`);
  };

  const handleAssign = (record: LeadItem) => {
    // 处理分配操作
    console.log('分配线索:', record);
  };

  const handleSearch = (value: string) => {
    if (!value && !selectedCity && !selectedType && !selectedStatus) {
      setDataSource(mockData);
      return;
    }

    let filtered = [...mockData];

    if (value) {
      filtered = filtered.filter(item => 
        item.contactName.toLowerCase().includes(value.toLowerCase()) ||
        item.contactPhone.includes(value) ||
        item.address.toLowerCase().includes(value.toLowerCase())
      );
    }

    if (selectedCity) {
      filtered = filtered.filter(item => item.city === selectedCity);
    }

    if (selectedType) {
      filtered = filtered.filter(item => item.merchantType === selectedType);
    }

    if (selectedStatus) {
      filtered = filtered.filter(item => item.status === selectedStatus);
    }

    setDataSource(filtered);
    setPagination(prev => ({ ...prev, total: filtered.length }));
  };

  const handleTableChange = (
    newPagination: any,
    filters: any,
    sorter: SorterResult<LeadItem> | SorterResult<LeadItem>[]
  ) => {
    setPagination(newPagination);
    
    let filtered = [...mockData];

    // 处理筛选
    if (filters.merchantType) {
      filtered = filtered.filter(item => filters.merchantType.includes(item.merchantType));
    }
    if (filters.status) {
      filtered = filtered.filter(item => filters.status.includes(item.status));
    }
    if (filters.priority) {
      filtered = filtered.filter(item => filters.priority.includes(item.priority));
    }

    // 处理排序
    if ('field' in sorter && sorter.field) {
      filtered = filtered.sort((a, b) => {
        const field = sorter.field as keyof LeadItem;
        if (sorter.order === 'ascend') {
          return (a[field] || '') > (b[field] || '') ? 1 : -1;
        }
        return (a[field] || '') < (b[field] || '') ? 1 : -1;
      });
    }

    setDataSource(filtered);
  };

  const handleCreate = () => {
    navigate('/leads/edit');
  };

  // 城市选项（实际项目中应该从API获取）
  const cityOptions = [
    { value: '北京市', label: '北京市' },
    { value: '上海市', label: '上海市' },
    { value: '广州市', label: '广州市' },
    { value: '深圳市', label: '深圳市' },
  ];

  return (
    <div className="leads-list">
      <Card
        title="线索管理"
        extra={
          <Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>新建线索</Button>
          </Space>
        }
      >
        <div className="mb-4">
          <Space size="middle">
            <Input
              placeholder="搜索联系人/电话/地址"
              prefix={<SearchOutlined />}
              style={{ width: 250 }}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <Select
              placeholder="选择城市"
              style={{ width: 120 }}
              allowClear
              onChange={(value) => {
                setSelectedCity(value);
                handleSearch('');
              }}
            >
              {cityOptions.map(option => (
                <Option key={option.value} value={option.value}>{option.label}</Option>
              ))}
            </Select>
            <Select
              placeholder="商家类型"
              style={{ width: 120 }}
              allowClear
              onChange={(value) => {
                setSelectedType(value);
                handleSearch('');
              }}
            >
              {Object.entries(merchantTypeMap).map(([key, value]) => (
                <Option key={key} value={key}>{value}</Option>
              ))}
            </Select>
            <Select
              placeholder="线索状态"
              style={{ width: 120 }}
              allowClear
              onChange={(value) => {
                setSelectedStatus(value);
                handleSearch('');
              }}
            >
              <Option value="pending">待跟进</Option>
              <Option value="following">跟进中</Option>
              <Option value="converted">已转化</Option>
              <Option value="failed">已失效</Option>
            </Select>
            <RangePicker placeholder={['开始时间', '结束时间']} />
          </Space>
        </div>
        <Table<LeadItem>
          columns={columns}
          dataSource={dataSource}
          rowKey="id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
          onChange={handleTableChange}
        />
      </Card>
    </div>
  );
};

export default LeadsList; 
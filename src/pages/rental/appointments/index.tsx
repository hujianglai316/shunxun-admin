import React, { useState } from 'react';
import { Table, Button, Input, Space, Tag, Select, DatePicker, Drawer, Form, Modal, Tabs, Timeline, Row, Col, Card, Statistic, Badge } from 'antd';
import { SearchOutlined, EyeOutlined, CheckCircleOutlined, CloseCircleOutlined, CalendarOutlined, PhoneOutlined, UserOutlined, EnvironmentOutlined, ClockCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import './index.less';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
const { TextArea } = Input;

// 预约记录接口定义
interface AppointmentRecord {
  id: string;
  roomId: string;
  roomName: string;
  roomAddress: string;
  merchantId: string;
  merchantName: string;
  userName: string;
  userPhone: string;
  appointmentTime: string;
  expectedViewTime: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rejected';
  createTime: string;
  updateTime: string;
  remark?: string;
  cancelReason?: string;
  rejectReason?: string;
  userRemark?: string;
  appointmentLogs: AppointmentLog[];
  appointmentCode?: string;
}

// 预约日志接口定义
interface AppointmentLog {
  id: string;
  appointmentId: string;
  operationType: 'create' | 'confirm' | 'complete' | 'cancel' | 'reject';
  operationDesc: string;
  operator: string;
  operatorRole: 'user' | 'merchant' | 'admin';
  operationTime: string;
  remark?: string;
}

// 模拟预约数据
const mockAppointmentData: AppointmentRecord[] = [
  {
    id: 'AP001',
    roomId: 'R001',
    roomName: '阳光花园小区 3室2厅',
    roomAddress: '北京市朝阳区阳光花园小区B栋2单元501',
    merchantId: 'M001',
    merchantName: '北京优家房产',
    userName: '张先生',
    userPhone: '13800138000',
    appointmentTime: '2024-06-05 10:00:00',
    expectedViewTime: '2024-06-08 14:00:00',
    status: 'pending',
    createTime: '2024-06-04 15:30:00',
    updateTime: '2024-06-04 15:30:00',
    userRemark: '希望周末看房，最好有停车位',
    appointmentLogs: [
      {
        id: 'APL001',
        appointmentId: 'AP001',
        operationType: 'create',
        operationDesc: '创建预约',
        operator: '张先生',
        operatorRole: 'user',
        operationTime: '2024-06-04 15:30:00',
        remark: '通过小程序发起预约'
      }
    ],
    appointmentCode: 'APC10024863'
  },
  {
    id: 'AP002',
    roomId: 'R002',
    roomName: '星河湾 2室1厅',
    roomAddress: '北京市海淀区星河湾小区A栋1单元301',
    merchantId: 'M002',
    merchantName: '海淀房屋租赁公司',
    userName: '李女士',
    userPhone: '13900139000',
    appointmentTime: '2024-06-03 11:20:00',
    expectedViewTime: '2024-06-05 10:30:00',
    status: 'confirmed',
    createTime: '2024-06-03 11:20:00',
    updateTime: '2024-06-03 14:10:00',
    userRemark: '想了解房屋朝向和采光情况',
    appointmentLogs: [
      {
        id: 'APL002',
        appointmentId: 'AP002',
        operationType: 'create',
        operationDesc: '创建预约',
        operator: '李女士',
        operatorRole: 'user',
        operationTime: '2024-06-03 11:20:00',
        remark: '通过小程序发起预约'
      },
      {
        id: 'APL003',
        appointmentId: 'AP002',
        operationType: 'confirm',
        operationDesc: '确认预约',
        operator: '王经理',
        operatorRole: 'merchant',
        operationTime: '2024-06-03 14:10:00',
        remark: '已电话确认客户需求'
      }
    ],
    appointmentCode: 'APC10024739'
  },
  {
    id: 'AP003',
    roomId: 'R003',
    roomName: '金茂府 4室2厅',
    roomAddress: '北京市朝阳区金茂府C栋3单元1801',
    merchantId: 'M003',
    merchantName: '朝阳金茂房产',
    userName: '王先生',
    userPhone: '13700137000',
    appointmentTime: '2024-06-02 09:00:00',
    expectedViewTime: '2024-06-04 15:00:00',
    status: 'completed',
    createTime: '2024-06-02 09:00:00',
    updateTime: '2024-06-04 16:30:00',
    userRemark: '关注房屋的装修情况和周边设施',
    appointmentLogs: [
      {
        id: 'APL004',
        appointmentId: 'AP003',
        operationType: 'create',
        operationDesc: '创建预约',
        operator: '王先生',
        operatorRole: 'user',
        operationTime: '2024-06-02 09:00:00'
      },
      {
        id: 'APL005',
        appointmentId: 'AP003',
        operationType: 'confirm',
        operationDesc: '确认预约',
        operator: '赵经理',
        operatorRole: 'merchant',
        operationTime: '2024-06-02 10:30:00',
        remark: '已安排专人接待'
      },
      {
        id: 'APL006',
        appointmentId: 'AP003',
        operationType: 'complete',
        operationDesc: '完成看房',
        operator: '赵经理',
        operatorRole: 'merchant',
        operationTime: '2024-06-04 16:30:00',
        remark: '客户对房屋表示满意，考虑中'
      }
    ],
    appointmentCode: 'APC10024615'
  },
  {
    id: 'AP004',
    roomId: 'R004',
    roomName: '深圳星河丽湾 2室1厅',
    roomAddress: '深圳市南山区星河丽湾B栋1501',
    merchantId: 'M004',
    merchantName: '深圳市星河地产',
    userName: '陈女士',
    userPhone: '13600136000',
    appointmentTime: '2024-06-01 16:20:00',
    expectedViewTime: '2024-06-03 11:00:00',
    status: 'cancelled',
    createTime: '2024-06-01 16:20:00',
    updateTime: '2024-06-02 09:15:00',
    userRemark: '希望了解小区环境和物业情况',
    cancelReason: '行程有变，需要改期',
    appointmentLogs: [
      {
        id: 'APL007',
        appointmentId: 'AP004',
        operationType: 'create',
        operationDesc: '创建预约',
        operator: '陈女士',
        operatorRole: 'user',
        operationTime: '2024-06-01 16:20:00'
      },
      {
        id: 'APL008',
        appointmentId: 'AP004',
        operationType: 'confirm',
        operationDesc: '确认预约',
        operator: '黄经理',
        operatorRole: 'merchant',
        operationTime: '2024-06-01 17:30:00'
      },
      {
        id: 'APL009',
        appointmentId: 'AP004',
        operationType: 'cancel',
        operationDesc: '取消预约',
        operator: '陈女士',
        operatorRole: 'user',
        operationTime: '2024-06-02 09:15:00',
        remark: '行程有变，需要改期'
      }
    ],
    appointmentCode: 'APC10024582'
  },
  {
    id: 'AP005',
    roomId: 'R005',
    roomName: '杭州西湖公寓 3室1厅',
    roomAddress: '杭州市西湖区西湖公寓A区2栋602',
    merchantId: 'M005',
    merchantName: '杭州湖畔房产',
    userName: '林先生',
    userPhone: '13500135000',
    appointmentTime: '2024-06-03 10:30:00',
    expectedViewTime: '2024-06-06 14:30:00',
    status: 'rejected',
    createTime: '2024-06-03 10:30:00',
    updateTime: '2024-06-03 15:40:00',
    userRemark: '需要了解租约条款和物业费用',
    rejectReason: '该时段已约满，建议改期',
    appointmentLogs: [
      {
        id: 'APL010',
        appointmentId: 'AP005',
        operationType: 'create',
        operationDesc: '创建预约',
        operator: '林先生',
        operatorRole: 'user',
        operationTime: '2024-06-03 10:30:00'
      },
      {
        id: 'APL011',
        appointmentId: 'AP005',
        operationType: 'reject',
        operationDesc: '拒绝预约',
        operator: '周经理',
        operatorRole: 'merchant',
        operationTime: '2024-06-03 15:40:00',
        remark: '该时段已约满，建议改期'
      }
    ],
    appointmentCode: 'APC10024701'
  },
];

const RentalAppointmentsPage: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [dateRange, setDateRange] = useState<any>([null, null]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<AppointmentRecord>();
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [rejectForm] = Form.useForm();

  // 获取过滤后的数据
  const getFilteredData = () => {
    let filtered = [...mockAppointmentData];
    
    if (searchText) {
      filtered = filtered.filter(item => 
        item.roomName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.userName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.userPhone.includes(searchText) ||
        item.appointmentCode?.includes(searchText)
      );
    }
    
    if (statusFilter) {
      filtered = filtered.filter(item => item.status === statusFilter);
    }
    
    if (dateRange && dateRange[0] && dateRange[1]) {
      const startDate = dateRange[0].startOf('day');
      const endDate = dateRange[1].endOf('day');
      filtered = filtered.filter(item => {
        const appointmentDate = dayjs(item.appointmentTime);
        return appointmentDate.isAfter(startDate) && appointmentDate.isBefore(endDate);
      });
    }
    
    return filtered;
  };

  // 查看预约详情
  const handleView = (record: AppointmentRecord) => {
    setCurrentRecord(record);
    setDrawerVisible(true);
  };

  // 确认预约
  const handleConfirm = (record: AppointmentRecord) => {
    setCurrentRecord(record);
    setConfirmModalVisible(true);
  };

  // 拒绝预约
  const handleReject = (record: AppointmentRecord) => {
    setCurrentRecord(record);
    setRejectModalVisible(true);
  };

  // 提交确认预约
  const submitConfirm = () => {
    form.validateFields().then(values => {
      // 这里应该是API调用
      console.log('确认预约', values);
      setConfirmModalVisible(false);
      form.resetFields();
    });
  };

  // 提交拒绝预约
  const submitReject = () => {
    rejectForm.validateFields().then(values => {
      // 这里应该是API调用
      console.log('拒绝预约', values);
      setRejectModalVisible(false);
      rejectForm.resetFields();
    });
  };

  // 获取状态标签样式
  const getStatusTag = (status: string) => {
    const statusMap = {
      pending: { color: 'processing', text: '待确认' },
      confirmed: { color: 'warning', text: '已确认' },
      completed: { color: 'success', text: '已完成' },
      cancelled: { color: 'default', text: '已取消' },
      rejected: { color: 'error', text: '已拒绝' },
    };
    const { color, text } = statusMap[status as keyof typeof statusMap];
    return <Tag color={color}>{text}</Tag>;
  };

  // 获取操作类型对应的颜色和标签
  const getOperationTypeStyle = (type: AppointmentLog['operationType']) => {
    const styleMap = {
      create: { color: 'blue', label: '创建' },
      confirm: { color: 'warning', label: '确认' },
      complete: { color: 'success', label: '完成' },
      cancel: { color: 'default', label: '取消' },
      reject: { color: 'error', label: '拒绝' },
    };
    return styleMap[type];
  };

  const columns: ColumnsType<AppointmentRecord> = [
    {
      title: '预约编号',
      dataIndex: 'appointmentCode',
      key: 'appointmentCode',
      width: 120,
      ellipsis: true,
    },
    {
      title: '房源信息',
      dataIndex: 'roomName',
      key: 'roomName',
      width: 180,
      ellipsis: true,
    },
    {
      title: '预约用户',
      key: 'user',
      width: 120,
      ellipsis: true,
      render: (_, record) => (
        <span>{record.userName} ({record.userPhone.substring(0, 3)}****{record.userPhone.substring(7)})</span>
      ),
    },
    {
      title: '商家',
      dataIndex: 'merchantName',
      key: 'merchantName',
      width: 160,
      ellipsis: true,
    },
    {
      title: '预约时间',
      dataIndex: 'appointmentTime',
      key: 'appointmentTime',
      width: 170,
    },
    {
      title: '预计看房时间',
      dataIndex: 'expectedViewTime',
      key: 'expectedViewTime',
      width: 170,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => getStatusTag(status),
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 180,
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EyeOutlined />} onClick={() => handleView(record)}>查看</Button>
          {record.status === 'pending' && (
            <>
              <Button 
                type="link" 
                icon={<CheckCircleOutlined />} 
                onClick={() => handleConfirm(record)}
              >
                确认
              </Button>
              <Button 
                type="link" 
                danger 
                icon={<CloseCircleOutlined />} 
                onClick={() => handleReject(record)}
              >
                拒绝
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <>
      <div className="mb-4">
        <Space size={12} wrap>
          <Input
            placeholder="搜索房源/用户/预约号"
            prefix={<SearchOutlined />}
            style={{ width: 220 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Select
            placeholder="预约状态"
            style={{ width: 120 }}
            allowClear
            value={statusFilter || undefined}
            onChange={(value) => setStatusFilter(value || '')}
          >
            <Option value="pending">待确认</Option>
            <Option value="confirmed">已确认</Option>
            <Option value="completed">已完成</Option>
            <Option value="cancelled">已取消</Option>
            <Option value="rejected">已拒绝</Option>
          </Select>
          <RangePicker 
            placeholder={['预约开始日期', '预约结束日期']}
            value={dateRange}
            onChange={(dates) => setDateRange(dates)}
          />
          <Button 
            type="primary" 
            onClick={() => {
              setSearchText('');
              setStatusFilter('');
              setDateRange([null, null]);
            }}
          >
            重置
          </Button>
        </Space>
      </div>

      {/* 数据统计卡片 */}
      <Row gutter={16} className="mb-4">
        <Col span={4}>
          <Card>
            <Statistic 
              title="今日预约" 
              value={2} 
              prefix={<CalendarOutlined />} 
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic 
              title="待确认" 
              value={mockAppointmentData.filter(item => item.status === 'pending').length} 
              prefix={<Badge status="processing" />} 
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic 
              title="已确认" 
              value={mockAppointmentData.filter(item => item.status === 'confirmed').length} 
              prefix={<Badge status="warning" />} 
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic 
              title="已完成" 
              value={mockAppointmentData.filter(item => item.status === 'completed').length} 
              prefix={<Badge status="success" />} 
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic 
              title="已取消" 
              value={mockAppointmentData.filter(item => item.status === 'cancelled').length} 
              prefix={<Badge status="default" />} 
            />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic 
              title="已拒绝" 
              value={mockAppointmentData.filter(item => item.status === 'rejected').length} 
              prefix={<Badge status="error" />} 
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      <Table<AppointmentRecord>
        columns={columns}
        dataSource={getFilteredData()}
        rowKey="id"
        size="middle"
        scroll={{ x: 1200 }}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`,
          defaultPageSize: 10,
          size: 'small'
        }}
      />

      {/* 预约详情抽屉 */}
      <Drawer
        title="预约详情"
        placement="right"
        width={600}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        className="appointment-detail-drawer"
      >
        {currentRecord && (
          <div className="appointment-detail">
            <div className="detail-section">
              <h3>基本信息</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="label">预约编号：</span>
                  <span className="value">{currentRecord.appointmentCode}</span>
                </div>
                <div className="detail-item">
                  <span className="label">预约状态：</span>
                  <span className="value">{getStatusTag(currentRecord.status)}</span>
                </div>
                <div className="detail-item full-width">
                  <span className="label">房源名称：</span>
                  <span className="value">{currentRecord.roomName}</span>
                </div>
                <div className="detail-item full-width">
                  <span className="label">房源地址：</span>
                  <span className="value">{currentRecord.roomAddress}</span>
                </div>
                <div className="detail-item">
                  <span className="label">所属商家：</span>
                  <span className="value">{currentRecord.merchantName}</span>
                </div>
                <div className="detail-item">
                  <span className="label">创建时间：</span>
                  <span className="value">{currentRecord.createTime}</span>
                </div>
                <div className="detail-item">
                  <span className="label">预约用户：</span>
                  <span className="value">{currentRecord.userName}</span>
                </div>
                <div className="detail-item">
                  <span className="label">联系电话：</span>
                  <span className="value">{currentRecord.userPhone}</span>
                </div>
                <div className="detail-item">
                  <span className="label">预约时间：</span>
                  <span className="value">{currentRecord.appointmentTime}</span>
                </div>
                <div className="detail-item">
                  <span className="label">预计看房：</span>
                  <span className="value">{currentRecord.expectedViewTime}</span>
                </div>
                {currentRecord.userRemark && (
                  <div className="detail-item full-width">
                    <span className="label">用户备注：</span>
                    <span className="value">{currentRecord.userRemark}</span>
                  </div>
                )}
                {currentRecord.cancelReason && (
                  <div className="detail-item full-width">
                    <span className="label">取消原因：</span>
                    <span className="value">{currentRecord.cancelReason}</span>
                  </div>
                )}
                {currentRecord.rejectReason && (
                  <div className="detail-item full-width">
                    <span className="label">拒绝原因：</span>
                    <span className="value">{currentRecord.rejectReason}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="detail-section">
              <h3>预约记录</h3>
              <div className="appointment-logs">
                <Timeline>
                  {currentRecord.appointmentLogs.map((log) => {
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
                            <div className="operator">
                              操作人：{log.operator}
                              <Tag size="small" className="ml-2">
                                {log.operatorRole === 'user' ? '用户' : 
                                 log.operatorRole === 'merchant' ? '商家' : '管理员'}
                              </Tag>
                            </div>
                          </div>
                        </div>
                      </Timeline.Item>
                    );
                  })}
                </Timeline>
              </div>
            </div>

            {currentRecord.status === 'pending' && (
              <div className="detail-section">
                <h3>操作</h3>
                <div className="appointment-actions">
                  <Space>
                    <Button 
                      type="primary" 
                      icon={<CheckCircleOutlined />}
                      onClick={() => {
                        setDrawerVisible(false);
                        handleConfirm(currentRecord);
                      }}
                    >
                      确认预约
                    </Button>
                    <Button 
                      danger 
                      icon={<CloseCircleOutlined />}
                      onClick={() => {
                        setDrawerVisible(false);
                        handleReject(currentRecord);
                      }}
                    >
                      拒绝预约
                    </Button>
                  </Space>
                </div>
              </div>
            )}
          </div>
        )}
      </Drawer>

      {/* 确认预约弹窗 */}
      <Modal
        title="确认预约"
        open={confirmModalVisible}
        onCancel={() => setConfirmModalVisible(false)}
        onOk={submitConfirm}
        destroyOnClose
      >
        <Form form={form} layout="vertical" preserve={false}>
          <Form.Item
            name="confirmRemark"
            label="确认备注"
            rules={[{ required: true, message: '请输入确认备注' }]}
          >
            <TextArea rows={4} placeholder="请输入确认备注，如接待人员信息、注意事项等" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 拒绝预约弹窗 */}
      <Modal
        title="拒绝预约"
        open={rejectModalVisible}
        onCancel={() => setRejectModalVisible(false)}
        onOk={submitReject}
        destroyOnClose
      >
        <Form form={rejectForm} layout="vertical" preserve={false}>
          <Form.Item
            name="rejectReason"
            label="拒绝原因"
            rules={[{ required: true, message: '请输入拒绝原因' }]}
          >
            <TextArea rows={4} placeholder="请输入拒绝原因，如时间冲突、房源不可用等" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default RentalAppointmentsPage; 
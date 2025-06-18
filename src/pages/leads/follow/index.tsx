import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  Select, 
  DatePicker, 
  message, 
  Space, 
  Timeline, 
  Divider, 
  Tag 
} from 'antd';
import { 
  PhoneOutlined, 
  MessageOutlined, 
  MailOutlined, 
  ScheduleOutlined, 
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

// 跟进方式
const followUpMethodOptions = [
  { label: '电话', value: 'phone', icon: <PhoneOutlined /> },
  { label: '短信', value: 'message', icon: <MessageOutlined /> },
  { label: '邮件', value: 'email', icon: <MailOutlined /> },
  { label: '会面', value: 'meeting', icon: <ScheduleOutlined /> },
];

// 跟进结果
const followUpResultOptions = [
  { label: '积极', value: 'positive', color: 'green' },
  { label: '中性', value: 'neutral', color: 'blue' },
  { label: '消极', value: 'negative', color: 'red' },
  { label: '待定', value: 'pending', color: 'orange' },
];

// 线索状态
const leadStatusOptions = [
  { label: '待跟进', value: 'pending', icon: <SyncOutlined spin /> },
  { label: '跟进中', value: 'following', icon: <SyncOutlined spin /> },
  { label: '已转化', value: 'converted', icon: <CheckCircleOutlined /> },
  { label: '已失效', value: 'failed', icon: <CloseCircleOutlined /> },
];

interface FollowUpRecord {
  id: string;
  method: string;
  content: string;
  result: string;
  nextPlan?: string;
  nextTime?: string;
  status: string;
  createTime: string;
  creator: string;
}

interface LeadInfo {
  id: string;
  contactName: string;
  contactPhone: string;
  merchantType: string;
  status: string;
  source: string;
  createTime: string;
}

interface FollowUpFormData {
  method: string;
  content: string;
  result: string;
  nextPlan?: string;
  nextTime?: Dayjs;
  status: string;
}

const LeadsFollow: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm<FollowUpFormData>();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [leadInfo, setLeadInfo] = useState<LeadInfo | null>(null);
  const [followUpRecords, setFollowUpRecords] = useState<FollowUpRecord[]>([]);

  useEffect(() => {
    if (id) {
      fetchLeadData();
      fetchFollowUpRecords();
    }
  }, [id]);

  // 模拟获取线索数据
  const fetchLeadData = async () => {
    setLoading(true);
    try {
      // 实际项目中应从API获取数据
      // 这里使用模拟数据
      setTimeout(() => {
        const mockData = {
          id: id || '',
          contactName: '张三',
          contactPhone: '13800138001',
          merchantType: '酒店',
          status: 'pending',
          source: '官网注册',
          createTime: '2024-03-20 10:00:00',
        };
        
        setLeadInfo(mockData);
        setLoading(false);
      }, 500);
    } catch (error) {
      message.error('获取线索数据失败');
      setLoading(false);
    }
  };

  // 模拟获取跟进记录
  const fetchFollowUpRecords = async () => {
    setLoading(true);
    try {
      // 实际项目中应从API获取数据
      // 这里使用模拟数据
      setTimeout(() => {
        const mockRecords = [
          {
            id: '1',
            method: 'phone',
            content: '电话联系客户，介绍了我们的平台功能和优势',
            result: 'positive',
            nextPlan: '发送详细的产品资料',
            nextTime: '2024-03-22 10:00:00',
            status: 'following',
            createTime: '2024-03-20 15:30:00',
            creator: '李四',
          },
          {
            id: '2',
            method: 'email',
            content: '发送了产品介绍和合作方案',
            result: 'neutral',
            nextPlan: '电话回访确认收到资料',
            nextTime: '2024-03-23 14:00:00',
            status: 'following',
            createTime: '2024-03-22 11:20:00',
            creator: '李四',
          },
        ];
        
        setFollowUpRecords(mockRecords);
        setLoading(false);
      }, 500);
    } catch (error) {
      message.error('获取跟进记录失败');
      setLoading(false);
    }
  };

  const handleSubmit = async (values: FollowUpFormData) => {
    setSubmitting(true);
    try {
      // 转换日期格式
      const formData = {
        ...values,
        nextTime: values.nextTime?.format('YYYY-MM-DD HH:mm:ss'),
      };
      
      console.log('提交的跟进记录:', formData);
      
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 模拟添加新记录
      const newRecord = {
        id: (followUpRecords.length + 1).toString(),
        ...formData,
        createTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        creator: '当前用户',
      } as FollowUpRecord;
      
      setFollowUpRecords([newRecord, ...followUpRecords]);
      form.resetFields();
      
      message.success('跟进记录添加成功');
    } catch (error) {
      message.error('保存失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate(`/leads/detail/${id}`);
  };

  const getResultTag = (result: string) => {
    const option = followUpResultOptions.find(opt => opt.value === result);
    if (!option) return <Tag>未知</Tag>;
    return <Tag color={option.color}>{option.label}</Tag>;
  };

  const getStatusTag = (status: string) => {
    const option = leadStatusOptions.find(opt => opt.value === status);
    if (!option) return <Tag>未知</Tag>;
    
    let color = '';
    switch (status) {
      case 'pending':
        color = 'orange';
        break;
      case 'following':
        color = 'blue';
        break;
      case 'converted':
        color = 'green';
        break;
      case 'failed':
        color = 'red';
        break;
      default:
        color = 'default';
    }
    
    return (
      <Tag icon={option.icon} color={color}>
        {option.label}
      </Tag>
    );
  };

  const getMethodIcon = (method: string) => {
    const option = followUpMethodOptions.find(opt => opt.value === method);
    return option ? option.icon : null;
  };

  return (
    <div className="leads-follow p-6 bg-white min-h-full">
      <Card
        title="线索跟进"
        extra={
          <Button onClick={handleBack}>返回</Button>
        }
        loading={loading}
      >
        {leadInfo && (
          <div className="lead-info mb-6">
            <h3 className="text-lg font-medium mb-2">线索基本信息</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="text-gray-500">联系人：</span>
                <span>{leadInfo.contactName}</span>
              </div>
              <div>
                <span className="text-gray-500">联系电话：</span>
                <span>{leadInfo.contactPhone}</span>
              </div>
              <div>
                <span className="text-gray-500">商家类型：</span>
                <span>{leadInfo.merchantType}</span>
              </div>
              <div>
                <span className="text-gray-500">线索来源：</span>
                <span>{leadInfo.source}</span>
              </div>
              <div>
                <span className="text-gray-500">创建时间：</span>
                <span>{leadInfo.createTime}</span>
              </div>
              <div>
                <span className="text-gray-500">当前状态：</span>
                <span>{getStatusTag(leadInfo.status)}</span>
              </div>
            </div>
          </div>
        )}

        <Divider />

        <div className="follow-up-form mb-6">
          <h3 className="text-lg font-medium mb-4">添加跟进记录</h3>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              method: 'phone',
              result: 'neutral',
              status: leadInfo?.status || 'following',
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Form.Item
                name="method"
                label="跟进方式"
                rules={[{ required: true, message: '请选择跟进方式' }]}
              >
                <Select placeholder="请选择跟进方式">
                  {followUpMethodOptions.map(option => (
                    <Option key={option.value} value={option.value}>
                      <Space>
                        {option.icon}
                        {option.label}
                      </Space>
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="result"
                label="跟进结果"
                rules={[{ required: true, message: '请选择跟进结果' }]}
              >
                <Select placeholder="请选择跟进结果">
                  {followUpResultOptions.map(option => (
                    <Option key={option.value} value={option.value}>
                      <Tag color={option.color}>{option.label}</Tag>
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="status"
                label="更新状态"
                rules={[{ required: true, message: '请选择线索状态' }]}
              >
                <Select placeholder="请选择线索状态">
                  {leadStatusOptions.map(option => (
                    <Option key={option.value} value={option.value}>
                      <Space>
                        {option.icon}
                        {option.label}
                      </Space>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

            <Form.Item
              name="content"
              label="跟进内容"
              rules={[{ required: true, message: '请输入跟进内容' }]}
            >
              <TextArea rows={4} placeholder="请详细描述本次跟进的内容和沟通要点" />
            </Form.Item>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Form.Item
                name="nextPlan"
                label="下一步计划"
              >
                <Input placeholder="请输入下一步跟进计划" />
              </Form.Item>

              <Form.Item
                name="nextTime"
                label="下次跟进时间"
              >
                <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} />
              </Form.Item>
            </div>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={submitting}>
                保存跟进记录
              </Button>
            </Form.Item>
          </Form>
        </div>

        <Divider />

        <div className="follow-up-history">
          <h3 className="text-lg font-medium mb-4">跟进历史记录</h3>
          {followUpRecords.length > 0 ? (
            <Timeline mode="left">
              {followUpRecords.map(record => (
                <Timeline.Item 
                  key={record.id} 
                  dot={getMethodIcon(record.method)}
                >
                  <div className="mb-2">
                    <span className="font-medium">{record.createTime}</span>
                    <span className="mx-2">|</span>
                    <span className="text-gray-500">跟进人: {record.creator}</span>
                    <span className="mx-2">|</span>
                    <span>结果: {getResultTag(record.result)}</span>
                    <span className="mx-2">|</span>
                    <span>状态: {getStatusTag(record.status)}</span>
                  </div>
                  <div className="mb-2">
                    <p>{record.content}</p>
                  </div>
                  {(record.nextPlan || record.nextTime) && (
                    <div className="text-gray-500">
                      <span>下一步: {record.nextPlan}</span>
                      {record.nextTime && (
                        <>
                          <span className="mx-2">|</span>
                          <span>计划时间: {record.nextTime}</span>
                        </>
                      )}
                    </div>
                  )}
                </Timeline.Item>
              ))}
            </Timeline>
          ) : (
            <div className="text-center text-gray-500 py-8">
              暂无跟进记录
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default LeadsFollow; 
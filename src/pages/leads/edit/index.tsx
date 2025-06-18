import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Select, DatePicker, message, Space } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

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

// 线索状态
const leadStatusOptions = [
  { label: '待跟进', value: 'pending' },
  { label: '跟进中', value: 'following' },
  { label: '已转化', value: 'converted' },
  { label: '已失效', value: 'failed' },
];

// 线索优先级
const priorityOptions = [
  { label: '高', value: 'high' },
  { label: '中', value: 'medium' },
  { label: '低', value: 'low' },
];

// 线索来源
const sourceOptions = [
  { label: '官网注册', value: '官网注册' },
  { label: '销售推荐', value: '销售推荐' },
  { label: '展会获取', value: '展会获取' },
  { label: '朋友推荐', value: '朋友推荐' },
  { label: '其他', value: '其他' },
];

interface LeadFormData {
  contactName: string;
  contactPhone: string;
  email?: string;
  city: string;
  address: string;
  merchantType: MerchantType;
  source: string;
  status: string;
  priority: 'high' | 'medium' | 'low';
  followUpTime?: Dayjs;
  assignee?: string;
  remark?: string;
}

const LeadsEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm<LeadFormData>();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchLeadData();
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
          id: id,
          contactName: '张三',
          contactPhone: '13800138001',
          email: 'zhangsan@example.com',
          city: '北京市',
          address: '朝阳区三里屯',
          merchantType: MerchantType.HOTEL,
          source: '官网注册',
          status: 'pending',
          priority: 'high' as const,
          followUpTime: dayjs('2024-03-20 15:00:00'),
          assignee: '李四',
          remark: '有意向合作，需要进一步跟进',
        };
        
        form.setFieldsValue(mockData);
        setLoading(false);
      }, 500);
    } catch (error) {
      message.error('获取线索数据失败');
      setLoading(false);
    }
  };

  const handleSubmit = async (values: LeadFormData) => {
    setSubmitting(true);
    try {
      // 转换日期格式
      const formData = {
        ...values,
        followUpTime: values.followUpTime?.format('YYYY-MM-DD HH:mm:ss'),
      };
      
      console.log('提交的数据:', formData);
      
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      message.success('保存成功');
      navigate('/leads/list');
    } catch (error) {
      message.error('保存失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(id ? `/leads/detail/${id}` : '/leads/list');
  };

  return (
    <div className="leads-edit p-6 bg-white min-h-full">
      <Card
        title={id ? '编辑线索' : '新建线索'}
        loading={loading}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            status: 'pending',
            priority: 'medium',
            source: '官网注册',
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Form.Item
              name="contactName"
              label="联系人姓名"
              rules={[{ required: true, message: '请输入联系人姓名' }]}
            >
              <Input placeholder="请输入联系人姓名" />
            </Form.Item>

            <Form.Item
              name="contactPhone"
              label="联系电话"
              rules={[
                { required: true, message: '请输入联系电话' },
                { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' }
              ]}
            >
              <Input placeholder="请输入联系电话" />
            </Form.Item>

            <Form.Item
              name="email"
              label="电子邮箱"
              rules={[
                { type: 'email', message: '请输入正确的邮箱格式' }
              ]}
            >
              <Input placeholder="请输入电子邮箱" />
            </Form.Item>

            <Form.Item
              name="city"
              label="城市"
              rules={[{ required: true, message: '请输入城市' }]}
            >
              <Input placeholder="请输入城市" />
            </Form.Item>

            <Form.Item
              name="address"
              label="详细地址"
              rules={[{ required: true, message: '请输入详细地址' }]}
            >
              <Input placeholder="请输入详细地址" />
            </Form.Item>

            <Form.Item
              name="merchantType"
              label="商家类型"
              rules={[{ required: true, message: '请选择商家类型' }]}
            >
              <Select placeholder="请选择商家类型">
                {Object.entries(merchantTypeMap).map(([key, value]) => (
                  <Option key={key} value={key}>{value}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="source"
              label="线索来源"
              rules={[{ required: true, message: '请选择线索来源' }]}
            >
              <Select placeholder="请选择线索来源">
                {sourceOptions.map(option => (
                  <Option key={option.value} value={option.value}>{option.label}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="status"
              label="线索状态"
              rules={[{ required: true, message: '请选择线索状态' }]}
            >
              <Select placeholder="请选择线索状态">
                {leadStatusOptions.map(option => (
                  <Option key={option.value} value={option.value}>{option.label}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="priority"
              label="优先级"
              rules={[{ required: true, message: '请选择优先级' }]}
            >
              <Select placeholder="请选择优先级">
                {priorityOptions.map(option => (
                  <Option key={option.value} value={option.value}>{option.label}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="followUpTime"
              label="计划跟进时间"
            >
              <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="assignee"
              label="负责人"
            >
              <Input placeholder="请输入负责人" />
            </Form.Item>
          </div>

          <Form.Item
            name="remark"
            label="备注"
          >
            <TextArea rows={4} placeholder="请输入备注信息" />
          </Form.Item>

          <Form.Item className="mt-6">
            <Space>
              <Button type="primary" htmlType="submit" loading={submitting}>
                保存
              </Button>
              <Button onClick={handleCancel}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LeadsEdit; 
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Descriptions, Tag, Timeline, Button, Space, Tabs } from 'antd';
import type { Lead, FollowUpRecord } from '@/types/leads';
import { LeadStatus, LeadPriority, FollowUpType } from '@/types/leads';
import { MerchantType } from '@/types/merchant';
import FollowUpForm from '../components/FollowUpForm';

const { TabPane } = Tabs;

// 模拟数据
const mockLead: Lead = {
  id: 1,
  city: '北京市',
  address: '朝阳区三里屯',
  merchantType: MerchantType.HOTEL,
  contactName: '张三',
  contactPhone: '13800138000',
  contactEmail: 'zhangsan@example.com',
  status: LeadStatus.FOLLOWING,
  priority: LeadPriority.HIGH,
  source: '官网注册',
  remarks: '有意向开设连锁酒店',
  createdAt: '2024-03-15 10:00:00',
  updatedAt: '2024-03-15 10:00:00',
  lastFollowUpAt: '2024-03-15 14:00:00',
  nextFollowUpAt: '2024-03-20 14:00:00',
  assignedToName: '李四',
};

const mockFollowUps: FollowUpRecord[] = [
  {
    id: 1,
    leadId: 1,
    type: FollowUpType.PHONE,
    content: '电话沟通，客户表示对我们的平台很感兴趣，计划下周实地考察',
    nextFollowUpTime: '2024-03-20 14:00:00',
    operator: '李四',
    createdAt: '2024-03-15 14:00:00',
  },
  // 更多跟进记录...
];

const LeadDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [lead, setLead] = useState<Lead>(mockLead);
  const [followUps, setFollowUps] = useState<FollowUpRecord[]>(mockFollowUps);
  const [followUpVisible, setFollowUpVisible] = useState(false);

  // 状态标签颜色映射
  const statusColors = {
    [LeadStatus.PENDING]: 'gold',
    [LeadStatus.FOLLOWING]: 'processing',
    [LeadStatus.CONVERTED]: 'success',
    [LeadStatus.INVALID]: 'default',
    [LeadStatus.REJECTED]: 'error',
  };

  // 优先级标签颜色映射
  const priorityColors = {
    [LeadPriority.HIGH]: 'red',
    [LeadPriority.MEDIUM]: 'orange',
    [LeadPriority.LOW]: 'blue',
  };

  const handleFollowUp = async (values: any) => {
    // 实际项目中这里会调用API
    console.log('跟进记录：', values);
    setFollowUpVisible(false);
  };

  return (
    <div className="lead-detail">
      <Card
        title="线索详情"
        extra={
          <Space>
            <Button onClick={() => setFollowUpVisible(true)} type="primary">
              添加跟进
            </Button>
            <Button>编辑</Button>
            <Button>转为商家</Button>
          </Space>
        }
      >
        <Tabs defaultActiveKey="1">
          <TabPane tab="基本信息" key="1">
            <Descriptions bordered column={2}>
              <Descriptions.Item label="联系人">{lead.contactName}</Descriptions.Item>
              <Descriptions.Item label="联系电话">{lead.contactPhone}</Descriptions.Item>
              <Descriptions.Item label="邮箱">{lead.contactEmail}</Descriptions.Item>
              <Descriptions.Item label="商家类型">
                <Tag>{lead.merchantType === MerchantType.HOTEL ? '酒店' : '民宿'}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="城市">{lead.city}</Descriptions.Item>
              <Descriptions.Item label="详细地址">{lead.address}</Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={statusColors[lead.status]}>
                  {lead.status === LeadStatus.PENDING ? '待跟进' :
                   lead.status === LeadStatus.FOLLOWING ? '跟进中' :
                   lead.status === LeadStatus.CONVERTED ? '已转化' :
                   lead.status === LeadStatus.INVALID ? '无效线索' : '已拒绝'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="优先级">
                <Tag color={priorityColors[lead.priority]}>
                  {lead.priority === LeadPriority.HIGH ? '高' :
                   lead.priority === LeadPriority.MEDIUM ? '中' : '低'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="来源">{lead.source}</Descriptions.Item>
              <Descriptions.Item label="负责人">{lead.assignedToName}</Descriptions.Item>
              <Descriptions.Item label="创建时间">{lead.createdAt}</Descriptions.Item>
              <Descriptions.Item label="最后跟进时间">{lead.lastFollowUpAt}</Descriptions.Item>
              <Descriptions.Item label="下次跟进时间">{lead.nextFollowUpAt}</Descriptions.Item>
              <Descriptions.Item label="备注" span={2}>{lead.remarks}</Descriptions.Item>
            </Descriptions>
          </TabPane>

          <TabPane tab="跟进记录" key="2">
            <Timeline>
              {followUps.map(record => (
                <Timeline.Item key={record.id}>
                  <div style={{ marginBottom: 8 }}>
                    <Tag>{record.type === FollowUpType.PHONE ? '电话沟通' :
                         record.type === FollowUpType.VISIT ? '实地考察' :
                         record.type === FollowUpType.MEETING ? '商务会谈' : '其他'}
                    </Tag>
                    <span style={{ marginLeft: 8 }}>{record.createdAt}</span>
                    <span style={{ marginLeft: 8 }}>跟进人：{record.operator}</span>
                  </div>
                  <div>{record.content}</div>
                  {record.nextFollowUpTime && (
                    <div style={{ marginTop: 8 }}>
                      下次跟进时间：{record.nextFollowUpTime}
                    </div>
                  )}
                </Timeline.Item>
              ))}
            </Timeline>
          </TabPane>
        </Tabs>
      </Card>

      <FollowUpForm
        visible={followUpVisible}
        onCancel={() => setFollowUpVisible(false)}
        onSubmit={handleFollowUp}
        lead={lead}
      />
    </div>
  );
};

export default LeadDetail; 
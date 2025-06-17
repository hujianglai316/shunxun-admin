import React from 'react';
import { Card, Descriptions, Button, Space } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';

const LeadsDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // 模拟数据，实际项目中应该从API获取
  const leadData = {
    id: id,
    name: '测试商家',
    phone: '13800138000',
    source: '官网注册',
    status: 'pending',
    createTime: '2024-03-20 10:00:00',
    followUpTime: '2024-03-20 15:00:00',
    remark: '有意向合作，需要进一步跟进',
    address: '北京市朝阳区',
    contactPerson: '张三',
    email: 'test@example.com',
  };

  const handleBack = () => {
    navigate('/leads/list');
  };

  const handleEdit = () => {
    // 处理编辑操作
    console.log('编辑线索:', id);
    navigate(`/leads/edit/${id}`);
  };

  const handleFollowUp = () => {
    // 处理跟进操作
    console.log('跟进线索:', id);
    navigate(`/leads/follow/${id}`);
  };

  return (
    <div className="leads-detail">
      <Card
        title="线索详情"
        extra={
          <Space>
            <Button onClick={handleBack}>返回</Button>
            <Button type="primary" onClick={handleFollowUp}>跟进</Button>
            <Button type="primary" onClick={handleEdit}>编辑</Button>
          </Space>
        }
      >
        <Descriptions bordered column={2}>
          <Descriptions.Item label="商家名称">{leadData.name}</Descriptions.Item>
          <Descriptions.Item label="联系电话">{leadData.phone}</Descriptions.Item>
          <Descriptions.Item label="联系人">{leadData.contactPerson}</Descriptions.Item>
          <Descriptions.Item label="电子邮箱">{leadData.email}</Descriptions.Item>
          <Descriptions.Item label="商家地址">{leadData.address}</Descriptions.Item>
          <Descriptions.Item label="来源">{leadData.source}</Descriptions.Item>
          <Descriptions.Item label="创建时间">{leadData.createTime}</Descriptions.Item>
          <Descriptions.Item label="最近跟进时间">{leadData.followUpTime}</Descriptions.Item>
          <Descriptions.Item label="备注" span={2}>{leadData.remark}</Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default LeadsDetail; 
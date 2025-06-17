import React from 'react';
import { Descriptions, Tag, Divider, Form, Input, Button } from 'antd';

interface PromotionAudit {
  id: string;
  merchantName: string;
  promotionName: string;
  type: 'property' | 'brand' | 'activity';
  budget: number;
  status: 'pending' | 'approved' | 'rejected';
  submitTime: string;
}

interface Props {
  record: PromotionAudit;
}

const AuditDetail: React.FC<Props> = ({ record }) => {
  const getTypeTag = (type: string) => {
    const typeMap = {
      property: { color: 'blue', text: '房源推广' },
      brand: { color: 'purple', text: '品牌推广' },
      activity: { color: 'orange', text: '活动推广' },
    };
    const { color, text } = typeMap[type as keyof typeof typeMap];
    return <Tag color={color}>{text}</Tag>;
  };

  const getStatusTag = (status: string) => {
    const statusMap = {
      pending: { color: 'processing', text: '待审核' },
      approved: { color: 'success', text: '已通过' },
      rejected: { color: 'error', text: '已拒绝' },
    };
    const { color, text } = statusMap[status as keyof typeof statusMap];
    return <Tag color={color}>{text}</Tag>;
  };

  return (
    <div>
      <Descriptions title="基本信息" column={2}>
        <Descriptions.Item label="商家名称">{record.merchantName}</Descriptions.Item>
        <Descriptions.Item label="活动名称">{record.promotionName}</Descriptions.Item>
        <Descriptions.Item label="推广类型">{getTypeTag(record.type)}</Descriptions.Item>
        <Descriptions.Item label="预算金额">¥{record.budget.toLocaleString()}</Descriptions.Item>
        <Descriptions.Item label="提交时间">{record.submitTime}</Descriptions.Item>
        <Descriptions.Item label="状态">{getStatusTag(record.status)}</Descriptions.Item>
      </Descriptions>

      <Divider />

      {record.status === 'pending' && (
        <Form layout="vertical">
          <Form.Item
            label="审核意见"
            name="remark"
            rules={[{ required: true, message: '请输入审核意见' }]}
          >
            <Input.TextArea rows={4} placeholder="请输入审核意见" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" style={{ marginRight: 8 }}>
              通过
            </Button>
            <Button danger>拒绝</Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

export default AuditDetail; 
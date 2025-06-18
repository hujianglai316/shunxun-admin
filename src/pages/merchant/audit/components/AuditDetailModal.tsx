import React from 'react';
import { 
  Modal, 
  Descriptions, 
  Image, 
  Space, 
  Tag, 
  Button, 
  Form,
  Input,
  Radio,
  Divider
} from 'antd';
import { MerchantAuditStatus, MerchantType } from '../../../../types/merchant';
import type { MerchantAuditRecord } from '../../../../types/merchant';

const { TextArea } = Input;

interface AuditDetailModalProps {
  open: boolean;
  onClose: () => void;
  data: any | null;
  onAudit: (status: MerchantAuditStatus, reason?: string) => Promise<void>;
  loading?: boolean;
}

const AuditDetailModal: React.FC<AuditDetailModalProps> = ({
  open,
  onClose,
  data,
  onAudit,
  loading = false,
}) => {
  const [form] = Form.useForm();

  const handleSubmit = async (values: { status: MerchantAuditStatus; reason?: string }) => {
    await onAudit(values.status, values.reason);
    form.resetFields();
  };

  const renderAuditStatus = (status: string) => {
    const statusMap: Record<string, { text: string; color: string }> = {
      'pending': { text: '待审核', color: 'warning' },
      'approved': { text: '已通过', color: 'success' },
      'rejected': { text: '已拒绝', color: 'error' },
    };
    const { text, color } = statusMap[status];
    return <Tag color={color}>{text}</Tag>;
  };

  const renderMerchantType = (type: string) => {
    const typeMap: Record<string, string> = {
      'hotel': '酒店',
      'apartment': '公寓',
      'house': '民宿',
    };
    return typeMap[type] || type;
  };

  return (
    <Modal
      title="商家审核详情"
      open={open}
      onCancel={onClose}
      width={800}
      footer={null}
    >
      {data && (
        <>
          <Descriptions title="基本信息" bordered column={2}>
            <Descriptions.Item label="商家名称">{data.merchantName}</Descriptions.Item>
            <Descriptions.Item label="商家类型">{renderMerchantType(data.type)}</Descriptions.Item>
            <Descriptions.Item label="提交时间">{data.submitTime}</Descriptions.Item>
            <Descriptions.Item label="审核状态">
              {renderAuditStatus(data.status)}
            </Descriptions.Item>
            {data.auditTime && (
              <Descriptions.Item label="审核时间">{data.auditTime}</Descriptions.Item>
            )}
            {data.auditor && (
              <Descriptions.Item label="审核人">{data.auditor}</Descriptions.Item>
            )}
            {data.remark && (
              <Descriptions.Item label="审核意见" span={2}>
                {data.remark}
              </Descriptions.Item>
            )}
          </Descriptions>

          <Divider />

          {data.status === 'pending' && (
            <div style={{ marginTop: 24 }}>
              <Form
                form={form}
                onFinish={handleSubmit}
                layout="vertical"
              >
                <Form.Item
                  name="status"
                  label="审核结果"
                  rules={[{ required: true, message: '请选择审核结果' }]}
                >
                  <Radio.Group>
                    <Radio value={MerchantAuditStatus.APPROVED}>通过</Radio>
                    <Radio value={MerchantAuditStatus.REJECTED}>拒绝</Radio>
                  </Radio.Group>
                </Form.Item>

                <Form.Item
                  noStyle
                  shouldUpdate={(prevValues, currentValues) => 
                    prevValues?.status !== currentValues?.status
                  }
                >
                  {({ getFieldValue }) => 
                    getFieldValue('status') === MerchantAuditStatus.REJECTED && (
                      <Form.Item
                        name="reason"
                        label="拒绝原因"
                        rules={[{ required: true, message: '请输入拒绝原因' }]}
                      >
                        <TextArea rows={4} placeholder="请输入拒绝原因" />
                      </Form.Item>
                    )
                  }
                </Form.Item>

                <Form.Item>
                  <Space>
                    <Button type="primary" htmlType="submit" loading={loading}>
                      提交审核
                    </Button>
                    <Button onClick={onClose}>取消</Button>
                  </Space>
                </Form.Item>
              </Form>
            </div>
          )}
        </>
      )}
    </Modal>
  );
};

export default AuditDetailModal; 
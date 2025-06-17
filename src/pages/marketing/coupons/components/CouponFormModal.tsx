import React from 'react';
import { Modal, Form } from 'antd';
import CouponForm from './CouponForm';
import type { CouponTemplate } from '../../../../types/marketing';

interface CouponFormModalProps {
  visible: boolean;
  title: string;
  initialValues?: Partial<CouponTemplate>;
  onCancel: () => void;
  onSubmit: (values: any) => Promise<void>;
  loading?: boolean;
}

const CouponFormModal: React.FC<CouponFormModalProps> = ({
  visible,
  title,
  initialValues,
  onCancel,
  onSubmit,
  loading,
}) => {
  const [form] = Form.useForm();

  const handleSubmit = async (values: any) => {
    try {
      await onSubmit(values);
      form.resetFields();
    } catch (error) {
      console.error('提交优惠券失败:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={title}
      open={visible}
      onCancel={handleCancel}
      width={1000}
      footer={null}
      destroyOnClose
      maskClosable={false}
    >
      <CouponForm
        form={form}
        initialValues={initialValues}
        onFinish={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
      />
    </Modal>
  );
};

export default CouponFormModal; 
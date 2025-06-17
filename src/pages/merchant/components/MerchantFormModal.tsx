import React, { useState } from 'react';
import { Modal, message } from 'antd';
import type { MerchantDetailInfo } from '../../../types/merchant';
import MerchantForm from './MerchantForm';

interface MerchantFormModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialValues?: Partial<MerchantDetailInfo>;
  mode: 'create' | 'edit';
}

const MerchantFormModal: React.FC<MerchantFormModalProps> = ({
  open,
  onClose,
  onSuccess,
  initialValues,
  mode,
}) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      // 这里添加实际的提交逻辑
      console.log('提交的数据:', values);
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      message.success(mode === 'create' ? '创建成功' : '更新成功');
      onSuccess();
      onClose();
    } catch (error) {
      message.error(mode === 'create' ? '创建失败' : '更新失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={mode === 'create' ? '新增商家' : '编辑商家'}
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
      destroyOnClose
    >
      <MerchantForm
        initialValues={initialValues}
        onFinish={handleSubmit}
        onCancel={onClose}
        loading={loading}
      />
    </Modal>
  );
};

export default MerchantFormModal; 
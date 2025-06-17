import React, { useState } from 'react';
import { Form, Input, Button, Space, Table, Switch, Modal, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { Facility } from '../../../../types/merchant';

const { Option } = Select;

interface FacilitiesFormProps {
  data: Facility[];
  onSave: (values: Facility[]) => Promise<void>;
  loading?: boolean;
}

const facilityCategories = [
  '通用设施',
  '休闲设施',
  '餐饮设施',
  '客房设施',
  '商务设施',
  '其他设施',
];

const FacilitiesForm: React.FC<FacilitiesFormProps> = ({
  data,
  onSave,
  loading = false,
}) => {
  const [facilities, setFacilities] = useState<Facility[]>(data);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingFacility, setEditingFacility] = useState<Facility | null>(null);
  const [form] = Form.useForm();

  const handleSave = async () => {
    await onSave(facilities);
  };

  const handleAdd = () => {
    setEditingFacility(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: Facility) => {
    setEditingFacility(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个设施吗？',
      onOk: () => {
        setFacilities(facilities.filter(item => item.id !== id));
      },
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingFacility) {
        setFacilities(
          facilities.map(item =>
            item.id === editingFacility.id ? { ...item, ...values } : item
          )
        );
      } else {
        const newFacility: Facility = {
          id: Math.max(...facilities.map(f => f.id), 0) + 1,
          ...values,
          isEnabled: true,
        };
        setFacilities([...facilities, newFacility]);
      }
      setModalVisible(false);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleStatusChange = (id: number, isEnabled: boolean) => {
    setFacilities(
      facilities.map(item =>
        item.id === id ? { ...item, isEnabled } : item
      )
    );
  };

  const columns = [
    {
      title: '设施名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'isEnabled',
      key: 'isEnabled',
      render: (isEnabled: boolean, record: Facility) => (
        <Switch
          checked={isEnabled}
          onChange={(checked) => handleStatusChange(record.id, checked)}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Facility) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          添加设施
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={facilities}
        rowKey="id"
        pagination={false}
      />

      <div style={{ marginTop: 16 }}>
        <Button type="primary" onClick={handleSave} loading={loading}>
          保存
        </Button>
      </div>

      <Modal
        title={editingFacility ? '编辑设施' : '添加设施'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="设施名称"
            rules={[
              { required: true, message: '请输入设施名称' },
              { max: 50, message: '设施名称不能超过50个字符' },
            ]}
          >
            <Input placeholder="请输入设施名称" />
          </Form.Item>

          <Form.Item
            name="category"
            label="设施分类"
            rules={[{ required: true, message: '请选择设施分类' }]}
          >
            <Select placeholder="请选择设施分类">
              {facilityCategories.map(category => (
                <Option key={category} value={category}>
                  {category}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label="设施描述"
            rules={[{ max: 200, message: '设施描述不能超过200个字符' }]}
          >
            <Input.TextArea
              rows={3}
              placeholder="请输入设施描述"
            />
          </Form.Item>

          <Form.Item
            name="icon"
            label="图标"
          >
            <Input placeholder="请输入图标名称" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FacilitiesForm; 
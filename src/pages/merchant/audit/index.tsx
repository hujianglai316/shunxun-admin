import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Input, 
  Space, 
  Tag, 
  Form, 
  Select, 
  Row, 
  Col,
  message,
  DatePicker
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { MerchantAuditRecord } from '../../../types/merchant';
import { MerchantType, MerchantAuditStatus } from '../../../types/merchant';
import AuditDetailModal from './components/AuditDetailModal';
import { mockAuditRecords } from '@/mock/merchant';

const { Option } = Select;
const { RangePicker } = DatePicker;

interface MerchantAuditSearchParams {
  merchantName?: string;
  type?: MerchantType;
  status?: MerchantAuditStatus;
  timeRange?: [string, string];
}

const MerchantAudit: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<MerchantAuditRecord | null>(null);
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditRecords, setAuditRecords] = useState<MerchantAuditRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<MerchantAuditRecord[]>([]);

  useEffect(() => {
    // 初始化数据
    setAuditRecords(mockAuditRecords);
    setFilteredRecords(mockAuditRecords);
  }, []);

  const handleSearch = (values: MerchantAuditSearchParams) => {
    console.log('搜索条件：', values);
    setLoading(true);
    
    // 模拟搜索逻辑
    setTimeout(() => {
      let filtered = [...auditRecords];
      
      if (values.merchantName) {
        filtered = filtered.filter(record => 
          record.merchantName.includes(values.merchantName!)
        );
      }
      
      if (values.type) {
        filtered = filtered.filter(record => 
          record.type === values.type
        );
      }
      
      if (values.status) {
        filtered = filtered.filter(record => 
          record.status === values.status
        );
      }
      
      if (values.timeRange && values.timeRange.length === 2) {
        // 实际项目中应该使用proper日期时间库来处理
        filtered = filtered.filter(record => 
          record.submitTime >= values.timeRange![0] && 
          record.submitTime <= values.timeRange![1]
        );
      }
      
      setFilteredRecords(filtered);
      setLoading(false);
    }, 500);
  };

  const handleViewDetail = (record: MerchantAuditRecord) => {
    setCurrentRecord(record);
    setDetailModalVisible(true);
  };

  const handleAudit = async (status: MerchantAuditStatus, reason?: string) => {
    if (!currentRecord) return;
    
    try {
      setAuditLoading(true);
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 更新本地状态
      const updatedRecords = auditRecords.map(record => {
        if (record.id === currentRecord.id) {
          return {
            ...record,
            status,
            auditTime: new Date().toLocaleString(),
            auditor: 'admin',
            remark: reason || ''
          };
        }
        return record;
      });
      
      setAuditRecords(updatedRecords);
      setFilteredRecords(
        filteredRecords.map(record => {
          if (record.id === currentRecord.id) {
            return {
              ...record,
              status,
              auditTime: new Date().toLocaleString(),
              auditor: 'admin',
              remark: reason || ''
            };
          }
          return record;
        })
      );
      
      message.success('审核成功');
      setDetailModalVisible(false);
    } catch (error) {
      message.error('审核失败');
    } finally {
      setAuditLoading(false);
    }
  };

  const renderAuditStatus = (status: MerchantAuditStatus) => {
    const statusMap = {
      [MerchantAuditStatus.PENDING]: { text: '待审核', color: 'warning' },
      [MerchantAuditStatus.APPROVED]: { text: '已通过', color: 'success' },
      [MerchantAuditStatus.REJECTED]: { text: '已拒绝', color: 'error' },
    };
    const { text, color } = statusMap[status];
    return <Tag color={color}>{text}</Tag>;
  };

  const columns = [
    {
      title: '商家名称',
      dataIndex: 'merchantName',
      key: 'merchantName',
      render: (text: string, record: MerchantAuditRecord) => (
        <a onClick={() => handleViewDetail(record)}>{text}</a>
      ),
    },
    {
      title: '商家类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: MerchantType) => {
        const typeMap = {
          [MerchantType.HOTEL]: '酒店',
          [MerchantType.APARTMENT]: '公寓',
          [MerchantType.HOUSE]: '民宿',
        };
        return typeMap[type];
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: MerchantAuditStatus) => renderAuditStatus(status),
    },
    {
      title: '提交时间',
      dataIndex: 'submitTime',
      key: 'submitTime',
      sorter: (a, b) => a.submitTime.localeCompare(b.submitTime),
    },
    {
      title: '审核时间',
      dataIndex: 'auditTime',
      key: 'auditTime',
      render: (text: string) => text || '-',
    },
    {
      title: '审核人',
      dataIndex: 'auditor',
      key: 'auditor',
      render: (text: string) => text || '-',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      ellipsis: true,
      render: (text: string) => text || '-',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: MerchantAuditRecord) => (
        <Space size="middle">
          <Button 
            type="link" 
            onClick={() => handleViewDetail(record)}
          >
            {record.status === MerchantAuditStatus.PENDING ? '审核' : '查看'}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="merchant-audit">
      <Card>
        <Form
          form={form}
          name="audit_search"
          onFinish={handleSearch}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item name="merchantName" label="商家名称">
                <Input placeholder="请输入商家名称" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="type" label="商家类型">
                <Select placeholder="请选择商家类型" allowClear>
                  <Option value={MerchantType.HOTEL}>酒店</Option>
                  <Option value={MerchantType.APARTMENT}>公寓</Option>
                  <Option value={MerchantType.HOUSE}>民宿</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="status" label="审核状态">
                <Select placeholder="请选择审核状态" allowClear>
                  <Option value={MerchantAuditStatus.PENDING}>待审核</Option>
                  <Option value={MerchantAuditStatus.APPROVED}>已通过</Option>
                  <Option value={MerchantAuditStatus.REJECTED}>已拒绝</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="timeRange" label="提交时间">
                <RangePicker showTime style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{ textAlign: 'right' }}>
              <Space>
                <Button 
                  type="primary" 
                  icon={<SearchOutlined />} 
                  htmlType="submit"
                >
                  搜索
                </Button>
                <Button onClick={() => {
                  form.resetFields();
                  setFilteredRecords(auditRecords);
                }}>
                  重置
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>

      <Card style={{ marginTop: 16 }}>
        <div style={{ marginBottom: 16 }}>
          <span style={{ marginRight: 8 }}>
            待审核:
            <span style={{ color: '#faad14', marginLeft: 4, fontWeight: 'bold' }}>
              {auditRecords.filter(r => r.status === MerchantAuditStatus.PENDING).length}
            </span>
          </span>
          <span style={{ marginRight: 8 }}>
            已通过:
            <span style={{ color: '#52c41a', marginLeft: 4, fontWeight: 'bold' }}>
              {auditRecords.filter(r => r.status === MerchantAuditStatus.APPROVED).length}
            </span>
          </span>
          <span>
            已拒绝:
            <span style={{ color: '#f5222d', marginLeft: 4, fontWeight: 'bold' }}>
              {auditRecords.filter(r => r.status === MerchantAuditStatus.REJECTED).length}
            </span>
          </span>
        </div>
        
        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredRecords}
          loading={loading}
          pagination={{
            total: filteredRecords.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>

      <AuditDetailModal
        open={detailModalVisible}
        onClose={() => setDetailModalVisible(false)}
        data={currentRecord}
        onAudit={handleAudit}
        loading={auditLoading}
      />
    </div>
  );
};

export default MerchantAudit; 
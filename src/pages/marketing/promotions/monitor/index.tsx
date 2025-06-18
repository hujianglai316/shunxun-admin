import React, { useState } from 'react';
import { Card, Table, Button, Input, Space, Tag, Select, Alert, Modal, Row, Col, Statistic } from 'antd';
import { SearchOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Option } = Select;

interface PromotionMonitor {
  id: string;
  merchantName: string;
  promotionName: string;
  type: 'property' | 'brand' | 'activity';
  budget: number;
  spent: number;
  status: 'running' | 'paused' | 'ended';
  startTime: string;
  endTime: string;
  metrics: {
    impressions: number;
    clicks: number;
    conversions: number;
    ctr: number;
    cvr: number;
  };
}

const PromotionMonitor: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<PromotionMonitor>();

  const columns: ColumnsType<PromotionMonitor> = [
    {
      title: '商家名称',
      dataIndex: 'merchantName',
      key: 'merchantName',
      width: 180,
    },
    {
      title: '活动名称',
      dataIndex: 'promotionName',
      key: 'promotionName',
      width: 200,
    },
    {
      title: '推广类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type: string) => {
        const typeMap = {
          property: { color: 'blue', text: '房源推广' },
          brand: { color: 'purple', text: '品牌推广' },
          activity: { color: 'orange', text: '活动推广' },
        };
        const { color, text } = typeMap[type as keyof typeof typeMap];
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '预算/消耗',
      key: 'budget',
      width: 150,
      render: (_, record) => (
        <span>
          ¥{record.spent.toLocaleString()} / ¥{record.budget.toLocaleString()}
        </span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const statusMap = {
          running: { color: 'success', text: '进行中' },
          paused: { color: 'warning', text: '已暂停' },
          ended: { color: 'default', text: '已结束' },
        };
        const { color, text } = statusMap[status as keyof typeof statusMap];
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '展示/点击',
      key: 'performance',
      width: 150,
      render: (_, record) => (
        <span>
          {record.metrics.impressions.toLocaleString()} / {record.metrics.clicks.toLocaleString()}
        </span>
      ),
    },
    {
      title: '转化率',
      dataIndex: ['metrics', 'cvr'],
      key: 'cvr',
      width: 100,
      render: (cvr: number) => `${(cvr * 100).toFixed(2)}%`,
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleView(record)}>
            查看
          </Button>
          {record.status === 'running' && (
            <Button type="link" onClick={() => handlePause(record)}>
              暂停
            </Button>
          )}
          {record.status === 'paused' && (
            <Button type="link" onClick={() => handleResume(record)}>
              恢复
            </Button>
          )}
          <Button type="link" danger onClick={() => handleStop(record)}>
            终止
          </Button>
        </Space>
      ),
    },
  ];

  const handleView = (record: PromotionMonitor) => {
    setCurrentRecord(record);
    setModalVisible(true);
  };

  const handlePause = (record: PromotionMonitor) => {
    Modal.confirm({
      title: '确认暂停',
      icon: <ExclamationCircleOutlined />,
      content: `确定要暂停活动"${record.promotionName}"吗？`,
      onOk() {
        console.log('Pause:', record.id);
      },
    });
  };

  const handleResume = (record: PromotionMonitor) => {
    Modal.confirm({
      title: '确认恢复',
      icon: <ExclamationCircleOutlined />,
      content: `确定要恢复活动"${record.promotionName}"吗？`,
      onOk() {
        console.log('Resume:', record.id);
      },
    });
  };

  const handleStop = (record: PromotionMonitor) => {
    Modal.confirm({
      title: '确认终止',
      icon: <ExclamationCircleOutlined />,
      content: `确定要终止活动"${record.promotionName}"吗？终止后不可恢复。`,
      okType: 'danger',
      onOk() {
        console.log('Stop:', record.id);
      },
    });
  };

  const mockData: PromotionMonitor[] = [
    {
      id: '1',
      merchantName: '北京房源中介',
      promotionName: '春季特惠房源推广',
      type: 'property',
      budget: 5000,
      spent: 2360,
      status: 'running',
      startTime: '2024-03-15',
      endTime: '2024-04-15',
      metrics: {
        impressions: 12000,
        clicks: 450,
        conversions: 28,
        ctr: 0.0375,
        cvr: 0.0622,
      },
    },
    {
      id: '2',
      merchantName: '上海租房平台',
      promotionName: '品牌形象推广',
      type: 'brand',
      budget: 10000,
      spent: 8900,
      status: 'running',
      startTime: '2024-03-10',
      endTime: '2024-04-10',
      metrics: {
        impressions: 25000,
        clicks: 890,
        conversions: 45,
        ctr: 0.0356,
        cvr: 0.0506,
      },
    },
  ];

  return (
    <Card title="活动监控管理">
      <Alert
        type="warning"
        message="系统监测到 3 个活动预算即将耗尽，2 个活动效果异常"
        className="mb-4"
      />

      <div style={{ marginBottom: 16 }}>
        <Space size={8}>
          <Input
            placeholder="商家名称/活动名称"
            prefix={<SearchOutlined />}
            style={{ width: 220 }}
          />
          <Select placeholder="推广类型" style={{ width: 120 }}>
            <Option value="property">房源推广</Option>
            <Option value="brand">品牌推广</Option>
            <Option value="activity">活动推广</Option>
          </Select>
          <Select placeholder="活动状态" style={{ width: 120 }}>
            <Option value="running">进行中</Option>
            <Option value="paused">已暂停</Option>
            <Option value="ended">已结束</Option>
          </Select>
        </Space>
      </div>

      <Table<PromotionMonitor>
        columns={columns}
        dataSource={mockData}
        rowKey="id"
        pagination={{
          total: mockData.length,
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`,
        }}
      />

      <Modal
        title="活动详情"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        {currentRecord && (
          <div>
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="预算使用"
                    value={currentRecord.spent}
                    suffix={` / ${currentRecord.budget}`}
                    precision={2}
                    prefix="¥"
                  />
                  <div style={{ marginTop: 8 }}>
                    使用率：{((currentRecord.spent / currentRecord.budget) * 100).toFixed(1)}%
                  </div>
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="点击率(CTR)"
                    value={currentRecord.metrics.ctr * 100}
                    precision={2}
                    suffix="%"
                  />
                  <div style={{ marginTop: 8 }}>
                    点击：{currentRecord.metrics.clicks.toLocaleString()}
                  </div>
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="转化率(CVR)"
                    value={currentRecord.metrics.cvr * 100}
                    precision={2}
                    suffix="%"
                  />
                  <div style={{ marginTop: 8 }}>
                    转化：{currentRecord.metrics.conversions.toLocaleString()}
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </Card>
  );
};

export default PromotionMonitor; 
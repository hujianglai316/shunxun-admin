import React, { useState } from 'react';
import { Card, Button, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { AdListItem, AdStatus, AdDetail } from './types';
import AdList from './components/AdList';
import AdFilter, { AdFilterValues } from './components/AdFilter';
import AdForm from './components/AdForm';

// 模拟数据
const mockListData: AdDetail[] = [
  {
    id: '1',
    title: '新年特惠酒店',
    position: '开屏广告',
    status: '投放中',
    startDate: '2024-01-01',
    endDate: '2024-02-01',
    schedule: [],
    priority: 90,
    targetUrl: 'https://example.com/hotel/1',
    creative: {
      imageUrl: 'https://placeholder.com/1080x1920',
      size: { width: 1080, height: 1920 },
      fileSize: 1024,
      format: 'jpg'
    },
    stats: {
      impressions: 12800,
      clicks: 960,
      ctr: 0.075,
      conversions: 320,
      conversionRate: 0.33
    },
    createTime: '2024-01-01 00:00:00',
    updateTime: '2024-01-01 00:00:00',
    creator: 'admin',
    remarks: '新年特惠活动开屏广告'
  },
  {
    id: '2',
    title: '春节住宿优惠',
    position: 'banner广告',
    status: '待发布',
    startDate: '2024-02-01',
    endDate: '2024-02-15',
    schedule: [],
    priority: 85,
    targetUrl: 'https://example.com/hotel/2',
    creative: {
      imageUrl: 'https://placeholder.com/750x280',
      size: { width: 750, height: 280 },
      fileSize: 512,
      format: 'jpg'
    },
    stats: {
      impressions: 0,
      clicks: 0,
      ctr: 0,
      conversions: 0,
      conversionRate: 0
    },
    createTime: '2024-01-15 00:00:00',
    updateTime: '2024-01-15 00:00:00',
    creator: 'admin',
    remarks: '春节促销活动banner'
  },
  {
    id: '3',
    title: '品质公寓推荐',
    position: '商家产品广告',
    status: '已暂停',
    startDate: '2024-01-15',
    endDate: '2024-03-15',
    schedule: [],
    priority: 80,
    targetUrl: 'https://example.com/apartment/1',
    creative: {
      imageUrl: 'https://placeholder.com/360x360',
      size: { width: 360, height: 360 },
      fileSize: 256,
      format: 'jpg'
    },
    stats: {
      impressions: 5600,
      clicks: 320,
      ctr: 0.057,
      conversions: 80,
      conversionRate: 0.25
    },
    createTime: '2024-01-10 00:00:00',
    updateTime: '2024-01-15 12:00:00',
    creator: 'admin',
    remarks: '优质公寓推广'
  },
];

const AdManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<AdDetail[]>(mockListData);
  const [showForm, setShowForm] = useState(false);
  const [currentAd, setCurrentAd] = useState<AdDetail | undefined>();

  const handleFilter = (filters: AdFilterValues) => {
    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      let filteredData = [...mockListData];
      
      if (filters.keyword) {
        filteredData = filteredData.filter(item => 
          item.title.toLowerCase().includes(filters.keyword!.toLowerCase())
        );
      }
      
      if (filters.position) {
        filteredData = filteredData.filter(item => 
          item.position === filters.position
        );
      }
      
      if (filters.status) {
        filteredData = filteredData.filter(item => 
          item.status === filters.status
        );
      }
      
      setDataSource(filteredData);
      setLoading(false);
    }, 500);
  };

  const handleAdd = () => {
    setCurrentAd(undefined);
    setShowForm(true);
  };

  const handleEdit = (id: string) => {
    const ad = dataSource.find(item => item.id === id);
    setCurrentAd(ad);
    setShowForm(true);
  };

  const handleView = (id: string) => {
    const ad = dataSource.find(item => item.id === id);
    setCurrentAd(ad);
    // 实现查看详情的逻辑
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条广告吗？',
      onOk: () => {
        setDataSource(prev => prev.filter(item => item.id !== id));
        message.success('删除成功');
      },
    });
  };

  const handleStatusChange = (id: string, status: AdStatus) => {
    setDataSource(prev =>
      prev.map(item =>
        item.id === id ? { ...item, status } : item
      )
    );
    message.success('状态更新成功');
  };

  const handleSubmit = (values: any) => {
    if (currentAd) {
      // 编辑模式
      setDataSource(prev =>
        prev.map(item =>
          item.id === currentAd.id ? { ...item, ...values } : item
        )
      );
      message.success('编辑成功');
    } else {
      // 新增模式
      const newAd: AdDetail = {
        id: String(Date.now()),
        ...values,
        status: '待发布',
        stats: {
          impressions: 0,
          clicks: 0,
          ctr: 0,
          conversions: 0,
          conversionRate: 0
        },
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString(),
        creator: 'admin',
        remarks: ''
      };
      setDataSource(prev => [...prev, newAd]);
      message.success('创建成功');
    }
    setShowForm(false);
  };

  return (
    <div className="p-6">
      <Card>
        <div className="mb-4 flex justify-between items-center">
          <AdFilter
            loading={loading}
            onFilter={handleFilter}
            onReset={() => setDataSource(mockListData)}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            新建广告
          </Button>
        </div>

        <AdList
          loading={loading}
          dataSource={dataSource}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
        />
      </Card>

      <Modal
        title={currentAd ? '编辑广告' : '新建广告'}
        open={showForm}
        onCancel={() => setShowForm(false)}
        footer={null}
        width={800}
      >
        <AdForm
          initialValues={currentAd}
          loading={loading}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
        />
      </Modal>
    </div>
  );
};

export default AdManagement; 
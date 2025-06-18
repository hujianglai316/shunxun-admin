import React from 'react';
import { Card, Row, Col, Statistic, Divider, Progress, Tooltip } from 'antd';
import { TagsOutlined, RiseOutlined, FallOutlined, ShoppingOutlined, UserOutlined } from '@ant-design/icons';
import type { CouponStats } from '../../../../types/marketing';

interface CouponStatsCardProps {
  stats: CouponStats;
  loading?: boolean;
}

const CouponStatsCard: React.FC<CouponStatsCardProps> = ({ stats, loading = false }) => {
  return (
    <Card loading={loading} className="coupon-stats-card">
      <Row gutter={24}>
        <Col span={6}>
          <Statistic
            title="进行中活动"
            value={stats.activeCoupons}
            prefix={<TagsOutlined style={{ color: '#1890ff' }} />}
            valueStyle={{ color: '#1890ff' }}
          />
          <div style={{ color: 'rgba(0,0,0,0.45)', fontSize: '14px', marginTop: '8px' }}>
            优惠券活动总数
          </div>
        </Col>
        <Col span={6}>
          <Statistic
            title="已发放总数"
            value={stats.totalIssued}
            prefix={<ShoppingOutlined style={{ color: '#52c41a' }} />}
            valueStyle={{ color: '#52c41a' }}
          />
          <div style={{ color: 'rgba(0,0,0,0.45)', fontSize: '14px', marginTop: '8px' }}>
            优惠券发放总量
          </div>
        </Col>
        <Col span={6}>
          <Statistic
            title="已使用总数"
            value={stats.totalUsed}
            prefix={<UserOutlined style={{ color: '#722ed1' }} />}
            valueStyle={{ color: '#722ed1' }}
          />
          <div style={{ color: 'rgba(0,0,0,0.45)', fontSize: '14px', marginTop: '8px' }}>
            已经被用户使用的数量
          </div>
        </Col>
        <Col span={6}>
          <Statistic
            title="平均使用率"
            value={stats.usageRate}
            suffix="%"
            precision={2}
            prefix={stats.usageRate >= 50 ? 
              <RiseOutlined style={{ color: '#52c41a' }} /> : 
              <FallOutlined style={{ color: '#f5222d' }} />
            }
            valueStyle={{ color: stats.usageRate >= 50 ? '#52c41a' : '#f5222d' }}
          />
          <div style={{ color: 'rgba(0,0,0,0.45)', fontSize: '14px', marginTop: '8px' }}>
            优惠券使用率 = 已使用/已发放
          </div>
        </Col>
      </Row>

      <Divider style={{ margin: '24px 0' }} />
      
      <Row gutter={24}>
        <Col span={12}>
          <Statistic
            title="优惠总金额"
            value={stats.totalValue}
            precision={2}
            prefix="¥"
            valueStyle={{ color: '#cf1322' }}
          />
          <div style={{ color: 'rgba(0,0,0,0.45)', fontSize: '14px', marginTop: '8px' }}>
            所有已使用优惠券的优惠总金额
          </div>
        </Col>
        <Col span={12}>
          <Statistic
            title="平均优惠金额"
            value={stats.avgDiscount}
            precision={2}
            prefix="¥"
            valueStyle={{ color: '#cf1322' }}
          />
          <div style={{ color: 'rgba(0,0,0,0.45)', fontSize: '14px', marginTop: '8px' }}>
            平均每张优惠券的优惠金额
          </div>
        </Col>
      </Row>

      <Divider style={{ margin: '24px 0' }}>热门优惠券TOP5</Divider>
      
      <div className="top-coupons">
        {stats.topCoupons.map((coupon, index) => (
          <Tooltip key={coupon.id} title={`发放数量: ${coupon.issuedCount}, 使用数量: ${coupon.usedCount}, 使用率: ${(coupon.usageRate * 100).toFixed(2)}%`}>
            <div className="top-coupon-item" style={{ marginBottom: '12px' }}>
              <div className="coupon-name" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>
                  <span style={{ marginRight: '8px', color: index < 3 ? '#f5222d' : 'rgba(0,0,0,0.65)' }}>
                    {index + 1}.
                  </span>
                  {coupon.name}
                </span>
                <span>{(coupon.usageRate * 100).toFixed(2)}%</span>
              </div>
              <Progress 
                percent={coupon.usageRate * 100} 
                showInfo={false} 
                strokeColor={index < 3 ? '#f5222d' : '#1890ff'} 
                size="small" 
              />
            </div>
          </Tooltip>
        ))}
      </div>
    </Card>
  );
};

export default CouponStatsCard; 
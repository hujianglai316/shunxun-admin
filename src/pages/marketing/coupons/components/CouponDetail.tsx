import React from 'react';
import { Descriptions, Tag, Badge, Divider, Card, Row, Col, Progress, Statistic } from 'antd';
import { CalendarOutlined, UserOutlined, ShopOutlined, MobileOutlined } from '@ant-design/icons';
import type { CouponTemplate, CouponType, CouponStatus, DistributionType, UseChannel, UseScope } from '../../../../types/marketing';

interface CouponDetailProps {
  coupon: CouponTemplate;
}

const CouponDetail: React.FC<CouponDetailProps> = ({ coupon }) => {
  // 渲染优惠券类型
  const renderCouponType = (type: CouponType) => {
    const typeMap: Record<CouponType, { color: string; text: string }> = {
      DISCOUNT: { color: 'blue', text: '折扣券' },
      CASH: { color: 'green', text: '满减券' },
      DIRECT: { color: 'red', text: '直减券' },
      FREE: { color: 'purple', text: '免费券' },
      GIFT: { color: 'orange', text: '赠品券' },
    };
    
    const { color, text } = typeMap[type] || { color: 'default', text: '未知类型' };
    return <Tag color={color}>{text}</Tag>;
  };

  // 渲染优惠券状态
  const renderCouponStatus = (status: CouponStatus) => {
    const statusMap: Record<CouponStatus, { status: 'success' | 'processing' | 'warning' | 'error' | 'default', text: string }> = {
      DRAFT: { status: 'default', text: '草稿' },
      PENDING: { status: 'warning', text: '待发布' },
      ACTIVE: { status: 'success', text: '进行中' },
      PAUSED: { status: 'warning', text: '已暂停' },
      EXPIRED: { status: 'error', text: '已过期' },
      FINISHED: { status: 'default', text: '已结束' },
    };
    
    const { status: badgeStatus, text } = statusMap[status] || { status: 'default', text: '未知状态' };
    return <Badge status={badgeStatus} text={text} />;
  };

  // 渲染发放方式
  const renderDistributionType = (type: DistributionType) => {
    const typeMap: Record<DistributionType, string> = {
      CODE: '兑换码',
      DIRECT: '直接发放',
      ACTIVITY: '活动奖励',
      MANUAL: '人工发放',
    };
    
    return typeMap[type] || '未知方式';
  };

  // 渲染使用渠道
  const renderUseChannels = (channels: UseChannel[]) => {
    const channelMap: Record<UseChannel, { icon: React.ReactNode, text: string }> = {
      ALL: { icon: <ShopOutlined />, text: '全部渠道' },
      APP: { icon: <MobileOutlined />, text: '仅APP' },
      MINI: { icon: <MobileOutlined />, text: '仅小程序' },
      WEB: { icon: <ShopOutlined />, text: '仅网页' },
      OFFLINE: { icon: <ShopOutlined />, text: '线下渠道' },
    };
    
    return (
      <>
        {channels.map((channel) => {
          const { icon, text } = channelMap[channel] || { icon: null, text: '未知渠道' };
          return (
            <Tag key={channel} icon={icon} color="blue" style={{ marginRight: 8 }}>
              {text}
            </Tag>
          );
        })}
      </>
    );
  };

  // 渲染使用范围
  const renderUseScope = (scope: UseScope, scopeIds?: string[]) => {
    const scopeMap: Record<UseScope, string> = {
      ALL: '全部商品',
      CATEGORY: '指定分类',
      PRODUCT: '指定商品',
      MERCHANT: '指定商家',
    };
    
    const scopeText = scopeMap[scope] || '未知范围';
    
    if (scope === 'ALL') {
      return <Tag color="green">{scopeText}</Tag>;
    }
    
    return (
      <>
        <Tag color="green">{scopeText}</Tag>
        {scopeIds && scopeIds.length > 0 && (
          <span style={{ marginLeft: 8 }}>
            共 {scopeIds.length} 项
          </span>
        )}
      </>
    );
  };

  // 计算发放进度
  const issuedPercent = Math.min(Math.round((coupon.totalIssued / coupon.rule.totalLimit) * 100), 100);
  
  // 计算使用进度
  const usedPercent = coupon.totalIssued > 0 
    ? Math.round((coupon.totalUsed / coupon.totalIssued) * 100) 
    : 0;

  return (
    <div className="coupon-detail">
      <Card bordered={false}>
        <Row gutter={16}>
          <Col span={8}>
            <Statistic
              title="已发放数量"
              value={coupon.totalIssued}
              suffix={`/ ${coupon.rule.totalLimit}`}
            />
            <Progress percent={issuedPercent} status={issuedPercent === 100 ? 'success' : 'active'} />
          </Col>
          <Col span={8}>
            <Statistic
              title="已使用数量"
              value={coupon.totalUsed}
              suffix={`/ ${coupon.totalIssued}`}
            />
            <Progress percent={usedPercent} status="active" strokeColor="#52c41a" />
          </Col>
          <Col span={8}>
            <Statistic
              title="使用率"
              value={coupon.totalIssued > 0 ? (coupon.totalUsed / coupon.totalIssued * 100).toFixed(2) : 0}
              suffix="%"
            />
          </Col>
        </Row>
      </Card>

      <Card title="基本信息" style={{ marginTop: 16 }}>
        <Descriptions bordered column={2}>
          <Descriptions.Item label="优惠券ID">{coupon.id}</Descriptions.Item>
          <Descriptions.Item label="优惠券名称">{coupon.name}</Descriptions.Item>
          <Descriptions.Item label="优惠券类型">{renderCouponType(coupon.type)}</Descriptions.Item>
          <Descriptions.Item label="优惠券状态">{renderCouponStatus(coupon.status)}</Descriptions.Item>
          
          <Descriptions.Item label="优惠券面值">
            {coupon.type === 'DISCOUNT' 
              ? `${(coupon.value * 100).toFixed(0)}% 折扣` 
              : coupon.type === 'CASH' || coupon.type === 'DIRECT' 
                ? `¥ ${coupon.value.toFixed(2)}` 
                : '-'}
          </Descriptions.Item>
          
          <Descriptions.Item label="发放方式">{renderDistributionType(coupon.distributionType)}</Descriptions.Item>
          
          {coupon.distributionType === 'CODE' && (
            <Descriptions.Item label="兑换码" span={2}>{coupon.code}</Descriptions.Item>
          )}
          
          <Descriptions.Item label="活动时间" span={2}>
            {coupon.startTime} ~ {coupon.endTime}
          </Descriptions.Item>
          
          <Descriptions.Item label="领取后有效期" span={2}>
            {coupon.validDays} 天
          </Descriptions.Item>
          
          <Descriptions.Item label="创建人">{coupon.createdBy}</Descriptions.Item>
          <Descriptions.Item label="创建时间">{coupon.createdAt}</Descriptions.Item>
          
          <Descriptions.Item label="更新人">{coupon.updatedBy || '-'}</Descriptions.Item>
          <Descriptions.Item label="更新时间">{coupon.updatedAt || '-'}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="使用规则" style={{ marginTop: 16 }}>
        <Descriptions bordered column={2}>
          <Descriptions.Item label="每人限领数量">{coupon.rule.perLimit} 张</Descriptions.Item>
          <Descriptions.Item label="总发放数量">{coupon.rule.totalLimit} 张</Descriptions.Item>
          
          {coupon.type === 'CASH' && (
            <Descriptions.Item label="使用门槛" span={2}>
              {coupon.rule.minAmount ? `满 ¥${coupon.rule.minAmount.toFixed(2)} 可用` : '无门槛'}
            </Descriptions.Item>
          )}
          
          {coupon.type === 'DISCOUNT' && coupon.rule.maxDiscount && (
            <Descriptions.Item label="最高优惠金额" span={2}>
              ¥ {coupon.rule.maxDiscount.toFixed(2)}
            </Descriptions.Item>
          )}
          
          <Descriptions.Item label="使用渠道" span={2}>
            {renderUseChannels(coupon.rule.useChannels)}
          </Descriptions.Item>
          
          <Descriptions.Item label="使用范围" span={2}>
            {renderUseScope(coupon.rule.useScope, coupon.rule.scopeIds)}
          </Descriptions.Item>
          
          <Descriptions.Item label="适用用户" span={2}>
            {coupon.rule.newUserOnly ? <Tag color="blue">仅限新用户</Tag> : <Tag color="green">所有用户</Tag>}
            {coupon.rule.userLevel && coupon.rule.userLevel.length > 0 && (
              <span style={{ marginLeft: 8 }}>
                {coupon.rule.userLevel.map(level => (
                  <Tag key={level} color="purple" icon={<UserOutlined />} style={{ marginRight: 8 }}>
                    {level === 'ALL' ? '全部用户' : 
                     level === 'NORMAL' ? '普通会员' : 
                     level === 'SILVER' ? '银卡会员' : 
                     level === 'GOLD' ? '金卡会员' : 
                     level === 'DIAMOND' ? '钻石会员' : level}
                  </Tag>
                ))}
              </span>
            )}
          </Descriptions.Item>
          
          <Descriptions.Item label="叠加规则" span={2}>
            {coupon.rule.excludePromotion 
              ? <Tag color="red">不可与其他优惠叠加使用</Tag> 
              : <Tag color="green">可与其他优惠叠加使用</Tag>}
          </Descriptions.Item>
          
          <Descriptions.Item label="使用时间限制" span={2}>
            {coupon.rule.weekendOnly && <Tag color="blue" icon={<CalendarOutlined />}>仅周末可用</Tag>}
            {coupon.rule.holidayOnly && <Tag color="blue" icon={<CalendarOutlined />} style={{ marginLeft: 8 }}>仅节假日可用</Tag>}
            {!coupon.rule.weekendOnly && !coupon.rule.holidayOnly && <span>无限制</span>}
          </Descriptions.Item>
          
          {coupon.rule.description && (
            <Descriptions.Item label="使用说明" span={2}>
              {coupon.rule.description}
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>
    </div>
  );
};

export default CouponDetail; 
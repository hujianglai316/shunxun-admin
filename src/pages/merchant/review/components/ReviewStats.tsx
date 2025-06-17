import React from 'react';
import { Card, Row, Col, Statistic, Progress, Space } from 'antd';
import { StarOutlined, MessageOutlined, PictureOutlined, CheckCircleOutlined } from '@ant-design/icons';
import type { ReviewStats } from '../../../../types/merchant';
import { RatingType } from '../../../../types/merchant';

interface ReviewStatsProps {
  data: ReviewStats;
}

const ReviewStats: React.FC<ReviewStatsProps> = ({ data }) => {
  const renderRatingName = (type: RatingType) => {
    const nameMap = {
      [RatingType.OVERALL]: '总体评分',
      [RatingType.CLEANLINESS]: '卫生评分',
      [RatingType.SERVICE]: '服务评分',
      [RatingType.LOCATION]: '位置评分',
      [RatingType.FACILITIES]: '设施评分',
      [RatingType.VALUE]: '性价比评分',
    };
    return nameMap[type];
  };

  const renderRatingDistribution = () => {
    return (
      <div>
        {[5, 4, 3, 2, 1].map(star => (
          <div key={star} style={{ marginBottom: 8 }}>
            <Space align="center" style={{ width: '100%' }}>
              <span style={{ width: 60 }}>{star}星</span>
              <Progress
                percent={Math.round((data.ratingDistribution[star] || 0) / data.totalCount * 100)}
                strokeColor="#ffd700"
                trailColor="#f5f5f5"
                size="small"
              />
              <span style={{ width: 60, textAlign: 'right' }}>
                {data.ratingDistribution[star] || 0}条
              </span>
            </Space>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总评价数"
              value={data.totalCount}
              prefix={<MessageOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="平均评分"
              value={data.averageRating.overall}
              precision={1}
              prefix={<StarOutlined />}
              suffix="/5"
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="有图评价"
              value={data.hasImageCount}
              prefix={<PictureOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已回复评价"
              value={data.hasReplyCount}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card title="评分分布">
            {renderRatingDistribution()}
          </Card>
        </Col>
        <Col span={12}>
          <Card title="分项评分">
            {Object.entries(data.averageRating).map(([type, score]) => (
              <div key={type} style={{ marginBottom: 16 }}>
                <Space align="center" style={{ width: '100%' }}>
                  <span style={{ width: 80 }}>{renderRatingName(type as RatingType)}</span>
                  <Progress
                    percent={Math.round(score * 20)} // 转换为百分比
                    strokeColor="#ffd700"
                    trailColor="#f5f5f5"
                    size="small"
                    format={(percent) => `${(percent! / 20).toFixed(1)}`}
                  />
                </Space>
              </div>
            ))}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ReviewStats; 
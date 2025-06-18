import React from 'react';
import { Card, Row, Col, Statistic, Progress } from 'antd';
import { Line } from '@ant-design/charts';
import { RatingType, type ReviewStats } from '../../../../types/merchant';

interface ReviewStatsComponentProps {
  data: ReviewStats;
}

const ReviewStatsComponent: React.FC<ReviewStatsComponentProps> = ({ data }) => {
  const trendConfig = {
    data: data.recentTrend,
    xField: 'date',
    yField: 'count',
    smooth: true,
    meta: {
      count: {
        alias: '评价数量',
      },
    },
  };

  const ratingConfig = {
    data: data.recentTrend,
    xField: 'date',
    yField: 'averageRating',
    smooth: true,
    meta: {
      averageRating: {
        alias: '平均评分',
        min: 0,
        max: 5,
      },
    },
  };

  const renderRatingDistribution = () => {
    const total = Object.values(data.ratingDistribution).reduce((a, b) => a + b, 0);
    return Object.entries(data.ratingDistribution)
      .sort(([a], [b]) => Number(b) - Number(a))
      .map(([score, count]) => {
        const percentage = (count / total) * 100;
        return (
          <div key={score} style={{ marginBottom: 8 }}>
            <Row align="middle" gutter={8}>
              <Col span={4}>{score}星</Col>
              <Col span={16}>
                <Progress
                  percent={percentage}
                  size="small"
                  showInfo={false}
                  strokeColor="#1890ff"
                />
              </Col>
              <Col span={4} style={{ textAlign: 'right' }}>
                {percentage.toFixed(1)}%
              </Col>
            </Row>
          </div>
        );
      });
  };

  return (
    <div>
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总评价数"
              value={data.totalCount}
              suffix="条"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总体评分"
              value={data.averageRating[RatingType.OVERALL]}
              precision={1}
              suffix="分"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="待回复评价"
              value={data.pendingCount}
              suffix="条"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="有图评价"
              value={data.hasImageCount}
              suffix={`条 (${((data.hasImageCount / data.totalCount) * 100).toFixed(1)}%)`}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={8}>
          <Card title="评分分布">
            {renderRatingDistribution()}
          </Card>
        </Col>
        <Col span={8}>
          <Card title="评价趋势">
            <Line {...trendConfig} height={200} />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="评分趋势">
            <Line {...ratingConfig} height={200} />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card title="分项评分">
            <Row gutter={16}>
              {Object.entries(data.averageRating)
                .filter(([key]) => key !== RatingType.OVERALL)
                .map(([key, value]) => (
                  <Col span={4} key={key}>
                    <Statistic
                      title={key}
                      value={value}
                      precision={1}
                      suffix="分"
                    />
                  </Col>
                ))}
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ReviewStatsComponent; 
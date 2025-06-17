import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Form,
  Input,
  Select,
  Button,
  Card,
  Breadcrumb,
  Space,
  message,
  Divider,
  Row,
  Col,
  Upload,
  DatePicker,
  InputNumber,
  Modal,
} from 'antd';
import {
  HomeOutlined,
  ShopOutlined,
  SaveOutlined,
  RollbackOutlined,
  UploadOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import type { MerchantBasicInfo } from '@/types/merchant';
import { MerchantType, MerchantStatus, PlatformType } from '@/types/merchant';
import { getMerchantDetail } from '@/mock/merchant';
import dayjs from 'dayjs';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import type { RcFile } from 'antd/es/upload';

const { Option } = Select;
const { TextArea } = Input;

// 模拟商家设置数据
const mockSettings = {
  basicInfo: {
    name: '瑞森酒店',
    description: '位于市中心的豪华酒店',
    contactPerson: '张经理',
    contactPhone: '13800138000',
    contactEmail: 'contact@ruisen.com',
    address: '北京市朝阳区建国路88号',
    latitude: 39.9042,
    longitude: 116.4074,
    images: [
      'https://example.com/hotel1.jpg',
      'https://example.com/hotel2.jpg',
    ],
    notice: '欢迎入住瑞森酒店',
  }
};

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });

const MerchantEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [merchant, setMerchant] = useState<any>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  const isEdit = !!id;

  useEffect(() => {
    if (isEdit) {
      fetchMerchantData();
    }
  }, [id]);

  const fetchMerchantData = async () => {
    try {
      setLoading(true);
      // 模拟API请求获取商家数据
      const data = getMerchantDetail(Number(id));
      if (data) {
        setMerchant(data);
        
        // 准备图片文件列表
        const initialImages = mockSettings.basicInfo.images.map((url, index) => ({
          uid: `-${index}`,
          name: `image-${index}.jpg`,
          status: 'done' as const,
          url,
        }));
        
        setFileList(initialImages);
        
        // 设置表单初始值
        form.setFieldsValue({
          ...data,
          // 将日期字符串转换为 dayjs 对象
          openingTime: data.openingTime ? dayjs(data.openingTime) : undefined,
          // 设置额外信息
          contactEmail: mockSettings.basicInfo.contactEmail,
          latitude: mockSettings.basicInfo.latitude,
          longitude: mockSettings.basicInfo.longitude,
          notice: mockSettings.basicInfo.notice,
          // 将图片URL数组转换为Upload组件需要的格式
          images: initialImages,
        });
      }
    } catch (error) {
      console.error('获取商家数据失败:', error);
      message.error('获取商家数据失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      setSubmitting(true);
      // 转换日期格式
      const formData = {
        ...values,
        openingTime: values.openingTime?.format('YYYY-MM-DD'),
        // 从fileList中提取图片URL
        images: fileList.map(file => file.url || file.thumbUrl),
      };
      
      // 模拟API请求
      console.log('提交的数据:', formData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      message.success('保存成功');
      navigate(`/merchant/detail/${id || 'new'}`);
    } catch (error) {
      console.error('保存失败:', error);
      message.error('保存失败');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(isEdit ? `/merchant/detail/${id}` : '/merchant/list');
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
  };

  const handleChange = ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
    setFileList(newFileList);
  };

  const handlePreviewCancel = () => setPreviewOpen(false);

  return (
    <div className="merchant-edit">
      {/* 顶部导航和操作按钮 */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 16 
      }}>
        <Breadcrumb>
          <Breadcrumb.Item href="/">
            <HomeOutlined />
            <span>首页</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item href="/merchant/list">
            <ShopOutlined />
            <span>商家管理</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{isEdit ? '编辑商家' : '新增商家'}</Breadcrumb.Item>
        </Breadcrumb>

        <Space>
          <Button 
            icon={<SaveOutlined />} 
            type="primary" 
            onClick={() => form.submit()}
            loading={submitting}
          >
            保存
          </Button>
          <Button 
            icon={<RollbackOutlined />} 
            onClick={handleCancel}
          >
            取消
          </Button>
        </Space>
      </div>

      <Card loading={loading}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            status: MerchantStatus.ACTIVE,
            type: MerchantType.HOTEL,
            platformType: PlatformType.HOTEL,
          }}
        >
          <Divider orientation="left">基本信息</Divider>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                name="name"
                label="商家名称"
                rules={[{ required: true, message: '请输入商家名称' }]}
              >
                <Input placeholder="请输入商家名称" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="type"
                label="商家类型"
                rules={[{ required: true, message: '请选择商家类型' }]}
              >
                <Select placeholder="请选择商家类型">
                  <Option value={MerchantType.HOTEL}>酒店</Option>
                  <Option value={MerchantType.APARTMENT}>公寓</Option>
                  <Option value={MerchantType.HOUSE}>民宿</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="platformType"
                label="平台类型"
                rules={[{ required: true, message: '请选择平台类型' }]}
              >
                <Select placeholder="请选择平台类型">
                  <Option value={PlatformType.HOTEL}>酒店平台</Option>
                  <Option value={PlatformType.RENTAL}>租房平台</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="status"
                label="状态"
                rules={[{ required: true, message: '请选择状态' }]}
              >
                <Select placeholder="请选择状态">
                  <Option value={MerchantStatus.ACTIVE}>正常</Option>
                  <Option value={MerchantStatus.INACTIVE}>已禁用</Option>
                  <Option value={MerchantStatus.PENDING}>待审核</Option>
                  <Option value={MerchantStatus.REJECTED}>已拒绝</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="city"
                label="所在城市"
                rules={[{ required: true, message: '请输入所在城市' }]}
              >
                <Input placeholder="请输入所在城市" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="roomCount"
                label="房间数量"
                rules={[{ required: true, message: '请输入房间数量' }]}
              >
                <InputNumber 
                  placeholder="请输入房间数量" 
                  style={{ width: '100%' }}
                  min={1}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="address"
                label="详细地址"
                rules={[{ required: true, message: '请输入详细地址' }]}
              >
                <Input placeholder="请输入详细地址" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="latitude"
                label="纬度"
                rules={[
                  { required: true, message: '请输入纬度' },
                  { type: 'number', message: '纬度必须是数字' },
                  { min: -90, max: 90, message: '纬度范围是-90到90之间' }
                ]}
              >
                <InputNumber 
                  placeholder="请输入纬度" 
                  style={{ width: '100%' }}
                  precision={6}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="longitude"
                label="经度"
                rules={[
                  { required: true, message: '请输入经度' },
                  { type: 'number', message: '经度必须是数字' },
                  { min: -180, max: 180, message: '经度范围是-180到180之间' }
                ]}
              >
                <InputNumber 
                  placeholder="请输入经度" 
                  style={{ width: '100%' }}
                  precision={6}
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">联系信息</Divider>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                name="contact"
                label="联系人"
                rules={[{ required: true, message: '请输入联系人' }]}
              >
                <Input placeholder="请输入联系人" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="phone"
                label="联系电话"
                rules={[
                  { required: true, message: '请输入联系电话' },
                  { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' }
                ]}
              >
                <Input placeholder="请输入联系电话" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="contactEmail"
                label="联系邮箱"
                rules={[
                  { required: true, message: '请输入联系邮箱' },
                  { type: 'email', message: '请输入正确的邮箱格式' }
                ]}
              >
                <Input placeholder="请输入联系邮箱" />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">营业信息</Divider>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                name="businessLicense"
                label="营业执照号"
                rules={[{ required: true, message: '请输入营业执照号' }]}
              >
                <Input placeholder="请输入营业执照号" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="legalPerson"
                label="法人代表"
                rules={[{ required: true, message: '请输入法人代表' }]}
              >
                <Input placeholder="请输入法人代表" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="openingTime"
                label="开业时间"
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="checkInTime"
                label="入住时间"
              >
                <Input placeholder="例如: 14:00" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="checkOutTime"
                label="退房时间"
              >
                <Input placeholder="例如: 12:00" />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">其他信息</Divider>
          <Row gutter={24}>
            <Col span={24}>
              <Form.Item
                name="description"
                label="商家简介"
                rules={[{ required: true, message: '请输入商家简介' }]}
              >
                <TextArea rows={4} placeholder="请输入商家简介" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="notice"
                label="商家公告"
              >
                <TextArea rows={3} placeholder="请输入商家公告" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="facilities"
                label="配套设施"
              >
                <Select
                  mode="multiple"
                  placeholder="请选择配套设施"
                  style={{ width: '100%' }}
                >
                  <Option value="wifi">WiFi</Option>
                  <Option value="parking">停车场</Option>
                  <Option value="restaurant">餐厅</Option>
                  <Option value="gym">健身房</Option>
                  <Option value="swimming">游泳池</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="images"
                label="商家图片"
                valuePropName="fileList"
                getValueFromEvent={e => e.fileList}
              >
                <Upload
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={handlePreview}
                  onChange={handleChange}
                  beforeUpload={() => false}
                >
                  {fileList.length >= 8 ? null : (
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>上传图片</div>
                    </div>
                  )}
                </Upload>
              </Form.Item>
              <Modal
                open={previewOpen}
                title={previewTitle}
                footer={null}
                onCancel={handlePreviewCancel}
              >
                <img alt="预览图片" style={{ width: '100%' }} src={previewImage} />
              </Modal>
            </Col>
          </Row>

          <Divider orientation="left">财务信息</Divider>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                name={['bankAccount', 'accountName']}
                label="账户名称"
              >
                <Input placeholder="请输入账户名称" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name={['bankAccount', 'bankName']}
                label="开户银行"
              >
                <Input placeholder="请输入开户银行" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name={['bankAccount', 'accountNumber']}
                label="银行账号"
              >
                <Input placeholder="请输入银行账号" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name={['settleInfo', 'settleType']}
                label="结算周期"
              >
                <Select placeholder="请选择结算周期">
                  <Option value="monthly">月结</Option>
                  <Option value="weekly">周结</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name={['settleInfo', 'settleDay']}
                label="结算日"
              >
                <InputNumber min={1} max={31} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name={['settleInfo', 'commissionRate']}
                label="佣金比例(%)"
              >
                <InputNumber 
                  min={0}
                  max={100}
                  step={0.1}
                  style={{ width: '100%' }}
                  addonAfter="%"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
};

export default MerchantEdit; 
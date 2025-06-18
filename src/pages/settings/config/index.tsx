import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Tabs, 
  Form, 
  Input, 
  Button, 
  Switch, 
  InputNumber, 
  Select, 
  Space, 
  Divider,
  Row,
  Col,
  Upload,
  message,
  Modal
} from 'antd';
import { 
  SaveOutlined, 
  UploadOutlined, 
  PlusOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';

const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;

interface SystemConfig {
  basic: {
    siteName: string;
    siteDescription: string;
    logo: string;
    recordNumber: string;
    contactEmail: string;
    contactPhone: string;
    address: string;
  };
  security: {
    passwordPolicy: {
      minLength: number;
      requireNumber: boolean;
      requireLowercase: boolean;
      requireUppercase: boolean;
      requireSpecialChar: boolean;
      maxAge: number;
    };
    loginPolicy: {
      maxLoginAttempts: number;
      lockDuration: number;
      sessionTimeout: number;
      singleDeviceLogin: boolean;
      allowedIpRanges: string[];
    };
  };
  notification: {
    email: {
      enabled: boolean;
      smtpServer: string;
      smtpPort: number;
      username: string;
      password: string;
      senderEmail: string;
      senderName: string;
      useTLS: boolean;
    };
    sms: {
      enabled: boolean;
      provider: string;
      apiKey: string;
      secretKey: string;
      signName: string;
    };
    wechat: {
      enabled: boolean;
      appId: string;
      appSecret: string;
      templateIds: Record<string, string>;
    };
  };
}

// 模拟系统配置数据
const mockSystemConfig: SystemConfig = {
  basic: {
    siteName: '瞬寻平台管理系统',
    siteDescription: '酒店与租房商家统一管理平台',
    logo: 'https://example.com/logo.png',
    recordNumber: '粤ICP备XXXXXXXX号',
    contactEmail: 'contact@example.com',
    contactPhone: '400-000-0000',
    address: '广东省广州市天河区XXX大厦',
  },
  security: {
    passwordPolicy: {
      minLength: 8,
      requireNumber: true,
      requireLowercase: true,
      requireUppercase: true,
      requireSpecialChar: true,
      maxAge: 90, // 密码有效期（天）
    },
    loginPolicy: {
      maxLoginAttempts: 5,
      lockDuration: 30, // 锁定时长（分钟）
      sessionTimeout: 120, // 会话超时（分钟）
      singleDeviceLogin: false,
      allowedIpRanges: [],
    },
  },
  notification: {
    email: {
      enabled: true,
      smtpServer: 'smtp.example.com',
      smtpPort: 465,
      username: 'noreply@example.com',
      password: '******',
      senderEmail: 'noreply@example.com',
      senderName: '瞬寻平台',
      useTLS: true,
    },
    sms: {
      enabled: true,
      provider: 'aliyun',
      apiKey: '******',
      secretKey: '******',
      signName: '瞬寻平台',
    },
    wechat: {
      enabled: false,
      appId: '',
      appSecret: '',
      templateIds: {
        orderCreate: '',
        orderCancel: '',
        orderComplete: '',
      },
    },
  },
};

const SettingsConfig: React.FC = () => {
  const [activeTab, setActiveTab] = useState('basic');
  const [basicForm] = Form.useForm();
  const [securityForm] = Form.useForm();
  const [notificationForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<SystemConfig>(mockSystemConfig);
  const [logoFile, setLogoFile] = useState<UploadFile | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  // 初始化表单数据
  useEffect(() => {
    // 实际项目中应通过API获取配置
    basicForm.setFieldsValue(config.basic);
    securityForm.setFieldsValue(config.security);
    notificationForm.setFieldsValue(config.notification);

    // 设置Logo文件
    if (config.basic.logo) {
      setLogoFile({
        uid: '-1',
        name: 'logo.png',
        status: 'done',
        url: config.basic.logo,
      });
    }
  }, [config]);

  // 处理标签页切换
  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  // 保存基本配置
  const handleSaveBasic = async () => {
    try {
      const values = await basicForm.validateFields();
      setLoading(true);
      // 模拟API请求
      setTimeout(() => {
        setConfig({
          ...config,
          basic: {
            ...values,
            logo: logoFile?.url || values.logo || '',
          },
        });
        message.success('保存成功');
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 保存安全配置
  const handleSaveSecurity = async () => {
    try {
      const values = await securityForm.validateFields();
      setLoading(true);
      // 模拟API请求
      setTimeout(() => {
        setConfig({
          ...config,
          security: values,
        });
        message.success('保存成功');
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 保存通知配置
  const handleSaveNotification = async () => {
    try {
      const values = await notificationForm.validateFields();
      setLoading(true);
      // 模拟API请求
      setTimeout(() => {
        setConfig({
          ...config,
          notification: values,
        });
        message.success('保存成功');
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  // 处理Logo上传
  const handleLogoChange = ({ fileList }: { fileList: UploadFile[] }) => {
    const file = fileList[0];
    if (file) {
      setLogoFile(file);
      // 实际项目中应有文件上传逻辑
      if (file.status === 'done' && file.response) {
        // 使用上传后的URL
        basicForm.setFieldsValue({ logo: file.response.url });
      }
    } else {
      setLogoFile(null);
      basicForm.setFieldsValue({ logo: '' });
    }
  };

  // 处理图片预览
  const handlePreview = async (file: UploadFile) => {
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  // 上传前验证
  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('只能上传图片文件!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片不能超过2MB!');
    }
    return isImage && isLt2M;
  };

  // 渲染基本配置表单
  const renderBasicForm = () => {
    return (
      <Form
        form={basicForm}
        layout="vertical"
        initialValues={config.basic}
      >
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="siteName"
              label="系统名称"
              rules={[{ required: true, message: '请输入系统名称' }]}
            >
              <Input placeholder="请输入系统名称" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="logo"
              label="系统Logo"
              valuePropName="logo"
            >
              <Upload
                listType="picture-card"
                maxCount={1}
                fileList={logoFile ? [logoFile] : []}
                onChange={handleLogoChange}
                onPreview={handlePreview}
                beforeUpload={beforeUpload}
                action="/api/upload" // 实际项目中的上传接口
              >
                {!logoFile && (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>上传</div>
                  </div>
                )}
              </Upload>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="siteDescription"
          label="系统描述"
        >
          <TextArea rows={2} placeholder="请输入系统描述" />
        </Form.Item>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="recordNumber"
              label="备案号"
            >
              <Input placeholder="请输入备案号" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="contactEmail"
              label="联系邮箱"
              rules={[
                { type: 'email', message: '请输入有效的邮箱地址' },
              ]}
            >
              <Input placeholder="请输入联系邮箱" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="contactPhone"
              label="联系电话"
            >
              <Input placeholder="请输入联系电话" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="address"
              label="公司地址"
            >
              <Input placeholder="请输入公司地址" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button 
            type="primary" 
            icon={<SaveOutlined />} 
            onClick={handleSaveBasic}
            loading={loading}
          >
            保存配置
          </Button>
        </Form.Item>
      </Form>
    );
  };

  // 渲染安全配置表单
  const renderSecurityForm = () => {
    return (
      <Form
        form={securityForm}
        layout="vertical"
        initialValues={config.security}
      >
        <Divider orientation="left">密码策略</Divider>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item
              name={['passwordPolicy', 'minLength']}
              label="最小长度"
              rules={[{ required: true, message: '请输入密码最小长度' }]}
            >
              <InputNumber min={6} max={32} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name={['passwordPolicy', 'maxAge']}
              label="有效期(天)"
              tooltip="0表示永不过期"
            >
              <InputNumber min={0} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={6}>
            <Form.Item
              name={['passwordPolicy', 'requireNumber']}
              valuePropName="checked"
              label="必须包含数字"
            >
              <Switch />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name={['passwordPolicy', 'requireLowercase']}
              valuePropName="checked"
              label="必须包含小写字母"
            >
              <Switch />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name={['passwordPolicy', 'requireUppercase']}
              valuePropName="checked"
              label="必须包含大写字母"
            >
              <Switch />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name={['passwordPolicy', 'requireSpecialChar']}
              valuePropName="checked"
              label="必须包含特殊字符"
            >
              <Switch />
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left">登录策略</Divider>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item
              name={['loginPolicy', 'maxLoginAttempts']}
              label="最大登录尝试次数"
              tooltip="超过次数账号将被锁定"
            >
              <InputNumber min={1} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name={['loginPolicy', 'lockDuration']}
              label="锁定时长(分钟)"
            >
              <InputNumber min={1} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name={['loginPolicy', 'sessionTimeout']}
              label="会话超时(分钟)"
            >
              <InputNumber min={1} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name={['loginPolicy', 'singleDeviceLogin']}
              valuePropName="checked"
              label="单设备登录"
              tooltip="启用后同一账号只能在一个设备上登录"
            >
              <Switch />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name={['loginPolicy', 'allowedIpRanges']}
          label="允许登录的IP范围"
          tooltip="留空表示不限制IP"
        >
          <Select
            mode="tags"
            placeholder="请输入IP范围，如192.168.1.0/24"
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary" 
            icon={<SaveOutlined />} 
            onClick={handleSaveSecurity}
            loading={loading}
          >
            保存配置
          </Button>
        </Form.Item>
      </Form>
    );
  };

  // 渲染通知配置表单
  const renderNotificationForm = () => {
    return (
      <Form
        form={notificationForm}
        layout="vertical"
        initialValues={config.notification}
      >
        <Divider orientation="left">邮件配置</Divider>
        <Form.Item
          name={['email', 'enabled']}
          valuePropName="checked"
          label="启用邮件通知"
        >
          <Switch />
        </Form.Item>

        <Form.Item noStyle shouldUpdate={(prev, curr) => {
          return prev.email?.enabled !== curr.email?.enabled;
        }}>
          {({ getFieldValue }) => getFieldValue(['email', 'enabled']) ? (
            <>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name={['email', 'smtpServer']}
                    label="SMTP服务器"
                    rules={[{ required: true, message: '请输入SMTP服务器' }]}
                  >
                    <Input placeholder="如: smtp.example.com" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name={['email', 'smtpPort']}
                    label="SMTP端口"
                    rules={[{ required: true, message: '请输入SMTP端口' }]}
                  >
                    <InputNumber min={1} max={65535} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name={['email', 'username']}
                    label="用户名"
                    rules={[{ required: true, message: '请输入用户名' }]}
                  >
                    <Input placeholder="请输入用户名" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name={['email', 'password']}
                    label="密码"
                    rules={[{ required: true, message: '请输入密码' }]}
                  >
                    <Input.Password placeholder="请输入密码" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name={['email', 'senderEmail']}
                    label="发件人邮箱"
                    rules={[
                      { required: true, message: '请输入发件人邮箱' },
                      { type: 'email', message: '请输入有效的邮箱地址' },
                    ]}
                  >
                    <Input placeholder="请输入发件人邮箱" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name={['email', 'senderName']}
                    label="发件人名称"
                    rules={[{ required: true, message: '请输入发件人名称' }]}
                  >
                    <Input placeholder="请输入发件人名称" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name={['email', 'useTLS']}
                valuePropName="checked"
                label="使用TLS加密"
              >
                <Switch />
              </Form.Item>
            </>
          ) : null}
        </Form.Item>

        <Divider orientation="left">短信配置</Divider>
        <Form.Item
          name={['sms', 'enabled']}
          valuePropName="checked"
          label="启用短信通知"
        >
          <Switch />
        </Form.Item>

        <Form.Item noStyle shouldUpdate={(prev, curr) => {
          return prev.sms?.enabled !== curr.sms?.enabled;
        }}>
          {({ getFieldValue }) => getFieldValue(['sms', 'enabled']) ? (
            <>
              <Form.Item
                name={['sms', 'provider']}
                label="短信服务商"
                rules={[{ required: true, message: '请选择短信服务商' }]}
              >
                <Select placeholder="请选择短信服务商">
                  <Option value="aliyun">阿里云</Option>
                  <Option value="tencent">腾讯云</Option>
                  <Option value="netease">网易云信</Option>
                </Select>
              </Form.Item>

              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name={['sms', 'apiKey']}
                    label="API Key"
                    rules={[{ required: true, message: '请输入API Key' }]}
                  >
                    <Input.Password placeholder="请输入API Key" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name={['sms', 'secretKey']}
                    label="Secret Key"
                    rules={[{ required: true, message: '请输入Secret Key' }]}
                  >
                    <Input.Password placeholder="请输入Secret Key" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name={['sms', 'signName']}
                label="短信签名"
                rules={[{ required: true, message: '请输入短信签名' }]}
              >
                <Input placeholder="请输入短信签名" />
              </Form.Item>
            </>
          ) : null}
        </Form.Item>

        <Divider orientation="left">微信配置</Divider>
        <Form.Item
          name={['wechat', 'enabled']}
          valuePropName="checked"
          label="启用微信通知"
        >
          <Switch />
        </Form.Item>

        <Form.Item noStyle shouldUpdate={(prev, curr) => {
          return prev.wechat?.enabled !== curr.wechat?.enabled;
        }}>
          {({ getFieldValue }) => getFieldValue(['wechat', 'enabled']) ? (
            <>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name={['wechat', 'appId']}
                    label="AppID"
                    rules={[{ required: true, message: '请输入AppID' }]}
                  >
                    <Input placeholder="请输入AppID" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name={['wechat', 'appSecret']}
                    label="AppSecret"
                    rules={[{ required: true, message: '请输入AppSecret' }]}
                  >
                    <Input.Password placeholder="请输入AppSecret" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label="消息模板ID"
                required
              >
                <Row gutter={24}>
                  <Col span={8}>
                    <Form.Item
                      name={['wechat', 'templateIds', 'orderCreate']}
                      label="订单创建通知"
                      rules={[{ required: true, message: '请输入模板ID' }]}
                    >
                      <Input placeholder="请输入模板ID" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name={['wechat', 'templateIds', 'orderCancel']}
                      label="订单取消通知"
                      rules={[{ required: true, message: '请输入模板ID' }]}
                    >
                      <Input placeholder="请输入模板ID" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      name={['wechat', 'templateIds', 'orderComplete']}
                      label="订单完成通知"
                      rules={[{ required: true, message: '请输入模板ID' }]}
                    >
                      <Input placeholder="请输入模板ID" />
                    </Form.Item>
                  </Col>
                </Row>
              </Form.Item>
            </>
          ) : null}
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary" 
            icon={<SaveOutlined />} 
            onClick={handleSaveNotification}
            loading={loading}
          >
            保存配置
          </Button>
        </Form.Item>
      </Form>
    );
  };

  return (
    <Card title="系统配置">
      <Tabs activeKey={activeTab} onChange={handleTabChange}>
        <TabPane tab="基本配置" key="basic">
          {renderBasicForm()}
        </TabPane>
        <TabPane tab="安全配置" key="security">
          {renderSecurityForm()}
        </TabPane>
        <TabPane tab="通知配置" key="notification">
          {renderNotificationForm()}
        </TabPane>
      </Tabs>

      <Modal
        open={previewOpen}
        title="图片预览"
        footer={null}
        onCancel={() => setPreviewOpen(false)}
      >
        <img alt="预览" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </Card>
  );
};

export default SettingsConfig; 
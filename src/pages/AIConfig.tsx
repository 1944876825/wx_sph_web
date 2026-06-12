import { Button, Card, Form, Input, message, Space, Switch } from 'antd';
import { useEffect, useState } from 'react';
import axiosInstance from '../request/base';

const AIConfig = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const loadConfig = async () => {
    try {
      const res = await axiosInstance.post('/aiConfig');
      if (res.data.status === 0) {
        const d = res.data.data;
        form.setFieldsValue({
          enabled: d.enabled,
          apiKey: d.apiKey,
          baseURL: d.baseURL || 'https://open.bigmodel.cn/api/paas/v4',
          model: d.model || 'glm-5-turbo',
          defaultPrompt: d.defaultPrompt || '',
        });
      }
    } catch (e: any) {
      message.error(e.message);
    }
  };

  const onSave = async () => {
    setLoading(true);
    try {
      const values = await form.validateFields();
      const res = await axiosInstance.post('/saveAIConfig', values);
      if (res.data.status === 0) {
        message.success('保存成功');
        loadConfig();
      } else {
        message.error(res.data.msg || '保存失败');
      }
    } catch (e: any) {
      message.error(e.message);
    }
    setLoading(false);
  };

  useEffect(() => { loadConfig(); }, []);

  return (
    <div style={{ padding: '24px', maxWidth: 600 }}>
      <Card title="🤖 AI 智能回复配置" extra={<a href="./#/">返回</a>}>
        <Form form={form} layout="vertical">
          <Form.Item label="启用 AI 回复" name="enabled" valuePropName="checked">
            <Switch checkedChildren="开启" unCheckedChildren="关闭" />
          </Form.Item>
          <Form.Item label="API Key" name="apiKey" rules={[{ required: true, message: '请输入 API Key' }]}>
            <Input.Password placeholder="输入智谱 AI API Key" />
          </Form.Item>
          <Form.Item label="API 地址" name="baseURL">
            <Input placeholder="https://open.bigmodel.cn/api/paas/v4" />
          </Form.Item>
          <Form.Item label="模型" name="model">
            <Input placeholder="glm-5-turbo" />
          </Form.Item>
          <Form.Item label="默认系统提示词" name="defaultPrompt">
            <Input.TextArea rows={4} placeholder="设置 AI 回复的默认角色和行为..." />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" onClick={onSave} loading={loading}>保存配置</Button>
              <Button onClick={loadConfig}>重置</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AIConfig;

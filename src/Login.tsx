import { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './Login.css';

interface LoginProps {
  onLoginSuccess: () => void;
}

const Login = ({ onLoginSuccess }: LoginProps) => {
  const [loading, setLoading] = useState(false);

  const onFinish = (values: { username: string; password: string }) => {
    setLoading(true);
    
    setTimeout(() => {
      if (values.username === 'admin' && values.password === '123456') {
        message.success('登錄成功！');
        onLoginSuccess();
      } else {
        message.error('賬號或密碼錯誤！');
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="login-container">
      <Card className="login-card" title="圖片標註系統登錄">
        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '請輸入賬號！' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="賬號：admin" 
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '請輸入密碼！' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密碼：123456"
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              block
            >
              登錄
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;


import React, { Component } from 'react';
import { Button, Checkbox, Col, Form, Input, Row } from 'antd';
import { Typography } from 'antd';
import { connect } from 'react-redux';
import { login } from './Store/Actions';

const { Text, Title, Paragraph } = Typography;

interface LoginProps {
  login: Function;
}

class Login extends Component<LoginProps, any> {

  onSubmit(values: any) {
    console.log(this.props);
    
    const { login } = this.props;
    login({
      data: values,
      onSuccess: () => console.log('success'),
      onError: () => console.error('error')
    });
  }

  render() {
    return (
      <Row justify='center' align='middle' style={{ height: '100vh' }}>
        <Col>
    
          <Form
            name="login"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            onFinish={(values) => this.onSubmit(values)}
            autoComplete="off"
          >
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>

              <Paragraph style={{ margin: '.8em 0' }}>
                <Title level={3} style={{ margin: 0 }}>Torpedo!</Title>
                <Text>Enter your credentials</Text>
              </Paragraph>
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email!' },
              ]}
            >
              <Input type='email' />
            </Form.Item>
    
            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password />
            </Form.Item>
    
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Login
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    );
    
  }

}


export default connect(null, {
  login
})(Login);
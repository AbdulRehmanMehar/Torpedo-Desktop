import React, { Component } from 'react';
import { Alert, Button, Checkbox, Col, Form, Input, Row } from 'antd';
import { Typography } from 'antd';
import { connect } from 'react-redux';
import { login } from './Store/Actions';
import { Spin } from 'antd';
import { toast } from 'react-toastify';
import messages from '../../config/messages';


const { Text, Title, Paragraph } = Typography;

interface LoginProps {
  login: Function;
}

class Login extends Component<LoginProps, { isProcessing: boolean }> {

  constructor(props: LoginProps) {
    super(props);

    this.state = {
      isProcessing: false,
    }
  }

  onSubmit(values: any) {
    console.log(this.props);
    
    const { login } = this.props;
    this.setState({ isProcessing: true });
    login({
      data: values,
      onError: (message: string) => toast.error(message),
      onComplete: () => this.setState({ isProcessing: false }),
    });
  }

  render() {
    const { isProcessing } = this.state;

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

              <Paragraph style={{ margin: '.3em 0' }}>
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
              <Button type={ isProcessing ? 'default' : 'primary' } htmlType="submit">
                { isProcessing ? <Spin /> : 'Login' }
              </Button>
            </Form.Item>
          </Form>
        </Col>

        <Paragraph style={{
          position: 'absolute',
          bottom: '0',
        }}>
          {messages.FOOTER} Developed by <b><a href='https://abdurehman.com'>Abdul Rehman</a></b>.
        </Paragraph>

      </Row>
    );
    
  }

}


export default connect(null, {
  login
})(Login);
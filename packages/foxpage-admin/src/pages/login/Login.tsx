import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, message, Spin } from 'antd';
import styled from 'styled-components';
import { RootState } from 'typesafe-actions';

import * as ACTIONS from '@/actions/login';
import * as SYS_ACTIONS from '@/actions/system';
import Logo from '@/components/common/Logo';
import { UserLoginResult } from '@/types/user';
import { setLoginUser } from '@/utils/login-user';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const FormContainer = styled.div`
  width: 300px;
  margin: 0 auto;
  background: rgb(255, 255, 255);
  padding: 18px;
  border: 1px solid rgb(217, 217, 217);
  border-radius: 4px;
`;

const mapStateToProps = (store: RootState) => ({
  loading: store.login.loading,
});

const mapDispatchToProps = {
  login: ACTIONS.login,
  updateOrganizationId: SYS_ACTIONS.updateOrganizationId,
};

type LoadingType = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

const Login: React.FC<LoadingType> = (props) => {
  const { loading, login, updateOrganizationId } = props;
  const [form] = Form.useForm();
  const [, forceUpdate] = useState({});
  const history = useHistory();

  useEffect(() => {
    forceUpdate({});
  }, []);

  const onFinish = (values) => {
    login({
      ...values,
      onSuccess: (user: UserLoginResult) => {
        const organizationId = user?.userInfo?.organizationId;
        if (!organizationId) {
          message.warn('请联系管理员加入组织');
          return;
        }
        message.success('Login succeed!');
        setLoginUser({
          token: user.token,
          organizationId,
          userInfo: user?.userInfo,
        });

        // push organization id to store
        updateOrganizationId(organizationId);

        history.push('/workspace');
      },
    });
  };
  return (
    <Container>
      <Spin spinning={loading}>
        <FormContainer>
          <Form
            name="normal_login"
            className="login-form"
            form={form}
            initialValues={{ remember: true }}
            onFinish={onFinish}>
            <Logo />
            <Form.Item name="account" rules={[{ required: true, message: 'Please input your Account!' }]}>
              <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Account" />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: 'Please input your Password!' }]}>
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
                style={{ width: '100%' }}>
                Log in
              </Button>
            </Form.Item>
          </Form>
        </FormContainer>
      </Spin>
    </Container>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);

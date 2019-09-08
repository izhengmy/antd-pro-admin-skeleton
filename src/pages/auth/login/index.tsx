import { AnyAction, Dispatch } from 'redux';
import React, { Component } from 'react';

import { AuthModelState } from '@/models/auth';
import { ConnectState } from '@/models/connect';
import { FormComponentProps } from 'antd/es/form';
import LoginComponents from './components/Login';
import { connect } from 'dva';
import { okResponse } from '@/utils/utils';
import rules from './rules';
import styles from './style.less';

const { Tab, Username, Password, MobileNumber, SmsCaptcha, Submit, Captcha } = LoginComponents;

interface LoginProps {
  dispatch: Dispatch<AnyAction>;
  auth: AuthModelState;
  submitting: boolean;
  smsCaptchaGetting: boolean;
}

interface LoginState {
  type: string;
}

export interface FormDataType {
  passwordLogin: {
    username: string;
    password: string;
    captcha: string;
  };
  smsCaptchaLogin: {
    mobileNumber: string;
    captcha: string;
    smsCaptcha: string;
  };
  forgotPassword: {
    mobileNumber: string;
    captcha: string;
    smsCaptcha: string;
    password: string;
    passwordConfirmation: string;
  };
}

@connect(({ auth, loading }: ConnectState) => ({
  auth,
  submitting: loading.effects['auth/login'] || loading.effects['auth/resetPassword'],
  smsCaptchaGetting: loading.effects['auth/getSmsCaptcha'],
}))
class Login extends Component<LoginProps, LoginState> {
  loginForm: FormComponentProps['form'] | undefined | null = undefined;

  state: LoginState = {
    type: 'passwordLogin',
  };

  handleSubmit = (err: unknown, values: FormDataType) => {
    const { type } = this.state;

    if (!err) {
      const { dispatch } = this.props;
      if (type === 'forgotPassword') {
        dispatch({
          type: 'auth/resetPassword',
          payload: {
            ...values.forgotPassword,
            type,
          },
        });
      } else {
        dispatch({
          type: 'auth/login',
          payload: {
            ...values[type],
            type,
          },
        });
      }
    }
  };

  onTabChange = (type: string) => {
    this.setState({
      type,
    });
  };

  onGetSmsCaptcha = () =>
    new Promise((resolve, reject) => {
      const { type } = this.state;
      if (!this.loginForm) {
        return;
      }

      this.loginForm.validateFields(
        [`${type}.mobileNumber`, `${type}.captcha`],
        {},
        (err: any, values: FormDataType) => {
          if (err) {
            reject(err);
          } else {
            const { dispatch } = this.props;
            ((dispatch({
              type: 'auth/getSmsCaptcha',
              payload: {
                type,
                captcha: values[type].captcha,
                mobileNumber: values[type].mobileNumber,
              },
            }) as unknown) as Promise<any>).then(response => {
              if (okResponse(response)) {
                resolve();
              } else {
                reject(response.message);
              }
            });
          }
        },
      );
    });

  render() {
    const { auth, submitting, smsCaptchaGetting } = this.props;
    const { type } = this.state;
    return (
      <div className={styles.main}>
        <LoginComponents
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          onCreate={(form?: FormComponentProps['form']) => {
            this.loginForm = form;
          }}
        >
          <Tab key="passwordLogin" tab="密码登录">
            <Username name="passwordLogin.username" placeholder="用户名" rules={rules.username} />
            <Password name="passwordLogin.password" placeholder="密码" rules={rules.password} />
            <Captcha
              name="passwordLogin.captcha"
              placeholder="验证码"
              rules={rules.captcha}
              captcha={auth.passwordLogin.captcha}
              onGetCaptcha={() => {
                const { dispatch } = this.props;
                dispatch({
                  type: 'auth/getCaptcha',
                  payload: {
                    type: 'passwordLogin',
                  },
                });
              }}
            />
          </Tab>
          <Tab key="smsCaptchaLogin" tab="短信登录">
            <MobileNumber name="smsCaptchaLogin.mobileNumber" placeholder="手机号码" rules={rules.mobileNumber} />
            <Captcha
              name="smsCaptchaLogin.captcha"
              placeholder="验证码"
              rules={rules.captcha}
              captcha={auth.smsCaptchaLogin.captcha}
              onGetCaptcha={() => {
                const { dispatch } = this.props;
                dispatch({
                  type: 'auth/getCaptcha',
                  payload: {
                    type: 'smsCaptchaLogin',
                  },
                });
              }}
            />
            <SmsCaptcha
              name="smsCaptchaLogin.smsCaptcha"
              placeholder="短信验证码"
              countDown={60}
              onGetSmsCaptcha={this.onGetSmsCaptcha}
              getSmsCaptchaButtonText="点击获取"
              getSmsCaptchaSecondText="秒"
              smsCaptchaGetting={smsCaptchaGetting}
              smsCaptchaGettingText="获取中..."
              rules={rules.smsCaptcha}
            />
          </Tab>
          <Tab key="forgotPassword" tab="找回密码">
            <MobileNumber name="forgotPassword.mobileNumber" placeholder="手机号码" rules={rules.mobileNumber} />
            <Captcha
              name="forgotPassword.captcha"
              placeholder="验证码"
              rules={rules.captcha}
              captcha={auth.forgotPassword.captcha}
              onGetCaptcha={() => {
                const { dispatch } = this.props;
                dispatch({
                  type: 'auth/getCaptcha',
                  payload: {
                    type: 'forgotPassword',
                  },
                });
              }}
            />
            <SmsCaptcha
              name="forgotPassword.smsCaptcha"
              placeholder="短信验证码"
              countDown={60}
              onGetSmsCaptcha={this.onGetSmsCaptcha}
              getSmsCaptchaButtonText="点击获取"
              getSmsCaptchaSecondText="秒"
              smsCaptchaGetting={smsCaptchaGetting}
              smsCaptchaGettingText="获取中..."
              rules={rules.smsCaptcha}
            />
            <Password
              name="forgotPassword.password"
              placeholder="密码"
              rules={rules.password.concat([
                { min: 8, max: 16, message: '密码长度必须在 8 - 16 个字符之间' },
                {
                  validator: (rule, value, callback) => {
                    if (this.loginForm) {
                      this.loginForm.validateFields(['forgotPassword.passwordConfirmation'], { force: true });
                    }
                    callback();
                  },
                },
              ])}
            />
            <Password
              name="forgotPassword.passwordConfirmation"
              placeholder="确认密码"
              rules={rules.passwordConfirmation.concat([
                {
                  validator: (rule, value, callback) => {
                    if (this.loginForm) {
                      if (value && value !== this.loginForm.getFieldValue('forgotPassword.password')) {
                        callback('两次输入密码不一致');
                      } else {
                        callback();
                      }
                    }
                  },
                },
              ])}
            />
          </Tab>
          <Submit loading={submitting}>{type === 'forgotPassword' ? '重置密码' : '登录'}</Submit>
        </LoginComponents>
      </div>
    );
  }
}

export default Login;

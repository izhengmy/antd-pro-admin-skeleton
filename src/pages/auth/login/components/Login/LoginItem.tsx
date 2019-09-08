import { Button, Col, Form, Input, Row, Tooltip } from 'antd';
import LoginContext, { LoginContextProps } from './LoginContext';
import React, { Component } from 'react';

import { FormComponentProps } from 'antd/es/form';
import { GetFieldDecoratorOptions } from 'antd/es/form/Form';
import ItemMap from './map';
import omit from 'omit.js';
import styles from './index.less';

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type WrappedLoginItemProps = Omit<LoginItemProps, 'form' | 'type' | 'updateActive'>;
export type LoginItemKeyType = keyof typeof ItemMap;
export interface LoginItemType {
  Username: React.FC<WrappedLoginItemProps>;
  Password: React.FC<WrappedLoginItemProps>;
  MobileNumber: React.FC<WrappedLoginItemProps>;
  SmsCaptcha: React.FC<WrappedLoginItemProps>;
  Captcha: React.FC<WrappedLoginItemProps>;
}

export interface LoginItemProps extends GetFieldDecoratorOptions {
  name?: string;
  style?: React.CSSProperties;
  onGetSmsCaptcha?: (event?: MouseEvent) => void | Promise<unknown> | false;
  placeholder?: string;
  buttonText?: React.ReactNode;
  onPressEnter?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  countDown?: number;
  getSmsCaptchaButtonText?: string;
  getSmsCaptchaSecondText?: string;
  updateActive?: LoginContextProps['updateActive'];
  type?: string;
  defaultValue?: string;
  form?: FormComponentProps['form'];
  customProps?: { [key: string]: unknown };
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  tabUtil?: LoginContextProps['tabUtil'];
  smsCaptchaGetting?: boolean;
  smsCaptchaGettingText?: string;
  captcha?: string;
  onGetCaptcha?: () => void | Promise<unknown> | undefined;
}

interface LoginItemState {
  count: number;
}

const FormItem = Form.Item;

class WrapFormItem extends Component<LoginItemProps, LoginItemState> {
  static defaultProps = {
    getSmsCaptchaButtonText: 'captcha',
    getSmsCaptchaSecondText: 'second',
  };

  interval: number | undefined = undefined;

  constructor(props: LoginItemProps) {
    super(props);
    this.state = {
      count: 0,
    };
  }

  componentDidMount() {
    const { updateActive, name = '', type, onGetCaptcha } = this.props;
    if (updateActive) {
      updateActive(name);
    }
    if (type === 'Captcha' && onGetCaptcha) {
      onGetCaptcha();
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  onGetSmsCaptcha = () => {
    const { onGetSmsCaptcha } = this.props;
    const result = onGetSmsCaptcha ? onGetSmsCaptcha() : null;
    if (result === false) {
      return;
    }
    if (result instanceof Promise) {
      result.then(this.runGetSmsCaptchaCountDown);
    } else {
      this.runGetSmsCaptchaCountDown();
    }
  };

  getFormItemOptions = ({ onChange, defaultValue, customProps = {}, rules }: LoginItemProps) => {
    const options: {
      rules?: LoginItemProps['rules'];
      onChange?: LoginItemProps['onChange'];
      initialValue?: LoginItemProps['defaultValue'];
    } = {
      rules: rules || (customProps.rules as LoginItemProps['rules']),
    };
    if (onChange) {
      options.onChange = onChange;
    }
    if (defaultValue) {
      options.initialValue = defaultValue;
    }
    return options;
  };

  runGetSmsCaptchaCountDown = () => {
    const { countDown } = this.props;
    let count = countDown || 59;
    this.setState({ count });
    this.interval = window.setInterval(() => {
      count -= 1;
      this.setState({ count });
      if (count === 0) {
        clearInterval(this.interval);
      }
    }, 1000);
  };

  renderGetCaptchaText = () => {
    const { count } = this.state;
    const { smsCaptchaGetting, smsCaptchaGettingText, getSmsCaptchaSecondText, getSmsCaptchaButtonText } = this.props;
    if (smsCaptchaGetting) {
      return smsCaptchaGettingText;
    }
    return count ? `${count} ${getSmsCaptchaSecondText}` : getSmsCaptchaButtonText;
  };

  render() {
    const { count } = this.state;

    // 这么写是为了防止restProps中 带入 onChange, defaultValue, rules props tabUtil
    const {
      onChange,
      customProps,
      defaultValue,
      rules,
      name,
      getSmsCaptchaButtonText,
      getSmsCaptchaSecondText,
      updateActive,
      type,
      form,
      tabUtil,
      smsCaptchaGetting,
      smsCaptchaGettingText,
      ...restProps
    } = this.props;
    if (!name) {
      return null;
    }
    if (!form) {
      return null;
    }
    const { getFieldDecorator } = form;
    // get getFieldDecorator props
    const options = this.getFormItemOptions(this.props);
    const otherProps = restProps || {};

    if (type === 'SmsCaptcha') {
      const inputProps = omit(otherProps, ['onGetSmsCaptcha', 'countDown']);

      return (
        <FormItem>
          <Row gutter={8}>
            <Col span={16}>{getFieldDecorator(name, options)(<Input {...customProps} {...inputProps} />)}</Col>
            <Col span={8}>
              <Button disabled={!!count} className={styles.getSmsCaptcha} size="large" onClick={this.onGetSmsCaptcha}>
                {this.renderGetCaptchaText()}
              </Button>
            </Col>
          </Row>
        </FormItem>
      );
    }
    if (type === 'Captcha') {
      const inputProps = omit(otherProps, ['captcha', 'onGetCaptcha']);
      return (
        <FormItem>
          <Row gutter={8}>
            <Col span={16}>{getFieldDecorator(name, options)(<Input {...customProps} {...inputProps} />)}</Col>
            <Col span={8}>
              <div>
                <Tooltip title="看不清楚？换一张">
                  <img
                    src={otherProps.captcha}
                    alt="验证码"
                    width="100%"
                    height="40"
                    style={{ display: 'block', cursor: 'pointer' }}
                    onClick={otherProps.onGetCaptcha}
                  />
                </Tooltip>
              </div>
            </Col>
          </Row>
        </FormItem>
      );
    }
    return <FormItem>{getFieldDecorator(name, options)(<Input {...customProps} {...otherProps} />)}</FormItem>;
  }
}

const LoginItem: Partial<LoginItemType> = {};

Object.keys(ItemMap).forEach(key => {
  const item = ItemMap[key];
  LoginItem[key] = (props: LoginItemProps) => (
    <LoginContext.Consumer>
      {context => (
        <WrapFormItem
          customProps={item.props}
          rules={item.rules}
          {...props}
          type={key}
          {...context}
          updateActive={context.updateActive}
        />
      )}
    </LoginContext.Consumer>
  );
});

export default LoginItem as LoginItemType;

import { Button, Form, Input } from 'antd';
import { FormComponentProps, ValidationRule } from 'antd/es/form';
import React, { Component } from 'react';

import { PasswordUpdateParamsType } from '@/services/account';
import { okResponse } from '@/utils/utils';

interface SecurityProps extends FormComponentProps {
  handleSubmit: (params: PasswordUpdateParamsType) => Promise<any>;
}

interface SecurityState {
  submitting: boolean;
}

const FormItem = Form.Item;
const { Password } = Input;

class Security extends Component<SecurityProps> {
  rules: {
    oldPassword: ValidationRule[];
    newPassword: ValidationRule[];
    newPasswordConfirmation: ValidationRule[];
  } = {
    oldPassword: [
      {
        required: true,
        message: '请输入旧密码',
      },
    ],
    newPassword: [
      {
        required: true,
        message: '请输入新密码',
      },
      {
        min: 8,
        max: 16,
        message: '新密码长度必须在 8 - 16 个字符之间',
      },
      {
        validator: (rule, value, callback) => {
          this.props.form.validateFields(['newPasswordConfirmation'], { force: true });
          callback();
        },
      },
    ],
    newPasswordConfirmation: [
      {
        required: true,
        message: '请再次输入新密码',
      },
      {
        validator: (rule, value, callback) => {
          if (value && value !== this.props.form.getFieldValue('newPassword')) {
            callback('两次输入密码不一致');
          } else {
            callback();
          }
        },
      },
    ],
  };

  state: SecurityState = {
    submitting: false,
  };

  handleSubmit = () => {
    const { form, handleSubmit } = this.props;
    form.validateFields(async (error, values) => {
      if (error) {
        return;
      }
      this.setState({
        submitting: true,
      });
      const response = await handleSubmit(values);
      this.setState({
        submitting: false,
      });
      if (okResponse(response)) {
        this.handleReset();
      }
    });
  };

  handleReset = () => {
    const { form } = this.props;
    form.resetFields();
  };

  render() {
    const { rules } = this;
    const { form } = this.props;
    const { submitting } = this.state;
    return (
      <Form style={{ width: '300px' }}>
        <FormItem label="旧密码">
          {form.getFieldDecorator('oldPassword', { rules: rules.oldPassword })(<Password placeholder="请输入旧密码" />)}
        </FormItem>
        <FormItem label="新密码">
          {form.getFieldDecorator('newPassword', { rules: rules.newPassword })(<Password placeholder="请输入新密码" />)}
        </FormItem>
        <FormItem label="确认密码">
          {form.getFieldDecorator('newPasswordConfirmation', { rules: rules.newPasswordConfirmation })(
            <Password placeholder="请再次输入新密码" />,
          )}
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit" loading={submitting} onClick={this.handleSubmit}>
            保存
          </Button>
          <Button onClick={this.handleReset} style={{ marginLeft: '12px' }}>
            重置
          </Button>
        </FormItem>
      </Form>
    );
  }
}

export default Form.create<SecurityProps>()(Security);

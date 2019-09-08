import { Button, Form, Input } from 'antd';
import { FormComponentProps, ValidationRule } from 'antd/es/form';
import React, { Component } from 'react';

import { Profile } from '@/services/schemas';
import { ProfileUpdateParamsType } from '@/services/account';
import regex from '@/utils/regex';

interface BasicProps extends FormComponentProps {
  profile: Profile;
  handleSubmit: (params: ProfileUpdateParamsType) => Promise<any>;
}

interface BasicState {
  submitting: boolean;
}

const FormItem = Form.Item;

const rules: {
  username: ValidationRule[];
  mobileNumber: ValidationRule[];
  realName: ValidationRule[];
} = {
  username: [
    {
      required: true,
      message: '请输入用户名',
    },
    {
      max: 20,
      message: '用户名长度不能多于 20 个字符',
    },
  ],
  mobileNumber: [
    {
      required: true,
      message: '请输入手机号码',
    },
    {
      pattern: regex.chinaMobileNumber,
      message: '手机号码格式不正确',
    },
  ],
  realName: [
    {
      required: true,
      message: '请输入真实姓名',
    },
    {
      max: 20,
      message: '真实姓名长度不能多于 20 个字符',
    },
  ],
};

class Basic extends Component<BasicProps, BasicState> {
  state: BasicState = {
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
      await handleSubmit(values);
      this.setState({
        submitting: false,
      });
    });
  };

  handleReset = () => {
    const { form } = this.props;
    form.resetFields();
  };

  render() {
    const { profile, form } = this.props;
    const { submitting } = this.state;
    if (!profile) {
      return null;
    }
    return (
      <Form style={{ width: '300px' }}>
        <FormItem label="用户名">
          {form.getFieldDecorator('username', { rules: rules.username, initialValue: profile.username })(
            <Input placeholder="请输入用户名" />,
          )}
        </FormItem>
        <FormItem label="手机号码">
          {form.getFieldDecorator('mobileNumber', { rules: rules.mobileNumber, initialValue: profile.mobileNumber })(
            <Input placeholder="请输入手机号码" />,
          )}
        </FormItem>
        <FormItem label="真实姓名">
          {form.getFieldDecorator('realName', { rules: rules.realName, initialValue: profile.realName })(
            <Input placeholder="请输入真实姓名" />,
          )}
        </FormItem>
        <FormItem label="角色">
          {profile.roles.length > 0 ? profile.roles.map(role => role.cnName).join('、') : '暂无'}
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

export default Form.create<BasicProps>()(Basic);

import { AdminStoreParamsType, AdminUpdateParamsType } from '@/services/admin';
import { Form, Input, Switch } from 'antd';

import React from 'react';
import RolesSelect from '../../role/components/RolesSelect';
import { ValidationRule } from 'antd/es/form';
import { WrappedComponentProps } from '@/components/FormDrawer';
import regex from '@/utils/regex';

const FormItem = Form.Item;

interface Rules {
  username: ValidationRule[];
  mobileNumber: ValidationRule[];
  password: ValidationRule[];
  passwordConfirmation: ValidationRule[];
  realName: ValidationRule[];
}

interface BaseFormProps extends WrappedComponentProps {
  record: AdminStoreParamsType | AdminUpdateParamsType;
}

const BaseForm = ({ form, record, id }: BaseFormProps) => {
  const rules: Rules = {
    username: [{ required: true, message: '请输入用户名' }, { max: 20, message: '用户名长度不能多于 20 个字符' }],
    mobileNumber: [
      { required: true, message: '请输入手机号码' },
      { pattern: regex.chinaMobileNumber, message: '手机号码格式不正确' },
    ],
    password: [
      { required: true, message: '请输入密码' },
      { min: 8, max: 16, message: '密码长度必须在 8 - 16 个字符之间' },
      {
        validator: (rule, value, callback) => {
          form.validateFields(['passwordConfirmation'], { force: true });
          callback();
        },
      },
    ],
    passwordConfirmation: [
      { required: true, message: '请再次输入密码' },
      {
        validator: (rule, value, callback) => {
          const check = id ? true : value;
          if (check && value !== form.getFieldValue('password')) {
            callback('两次输入密码不一致');
          } else {
            callback();
          }
        },
      },
    ],
    realName: [{ required: true, message: '请输入真实姓名' }, { max: 20, message: '真实姓名长度不能多于 20 个字符' }],
  };
  if (id) {
    rules.password.shift();
    rules.passwordConfirmation.shift();
  }
  return (
    <Form>
      <FormItem label="用户名">
        {form.getFieldDecorator('username', { rules: rules.username, initialValue: record.username })(
          <Input placeholder="请输入用户名" />,
        )}
      </FormItem>
      <FormItem label="手机号码">
        {form.getFieldDecorator('mobileNumber', { rules: rules.mobileNumber, initialValue: record.mobileNumber })(
          <Input placeholder="请输入用户名" />,
        )}
      </FormItem>
      <FormItem label="密码">
        {form.getFieldDecorator('password', { rules: rules.password })(<Input.Password placeholder="请输入密码" />)}
      </FormItem>
      <FormItem label="确认密码">
        {form.getFieldDecorator('passwordConfirmation', { rules: rules.passwordConfirmation })(
          <Input.Password placeholder="请再次输入密码" />,
        )}
      </FormItem>
      <FormItem label="真实姓名">
        {form.getFieldDecorator('realName', { rules: rules.realName, initialValue: record.realName })(
          <Input placeholder="请输入真实姓名" />,
        )}
      </FormItem>
      <FormItem label="关联角色">
        {form.getFieldDecorator('roleIds', { initialValue: record.roleIds })(
          <RolesSelect placeholder="请选择关联角色" />,
        )}
      </FormItem>
      <FormItem label="是否启用">
        {form.getFieldDecorator('enabled', {
          initialValue: record.enabled,
          valuePropName: 'checked',
        })(<Switch />)}
      </FormItem>
    </Form>
  );
};

export default BaseForm;

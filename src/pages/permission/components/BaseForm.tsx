import { Form, Input } from 'antd';

import { PermissionParamsType } from '@/services/permission';
import React from 'react';
import { ValidationRule } from 'antd/es/form';
import { WrappedComponentProps } from '@/components/FormDrawer';

const rules: {
  name: ValidationRule[];
  cnName: ValidationRule[];
} = {
  name: [{ required: true, message: '请输入权限名称' }, { max: 255, message: '权限名称长度不能多于 255 个字符' }],
  cnName: [
    { required: true, message: '请输入权限中文名称' },
    { max: 255, message: '权限中文名称长度不能多于 255 个字符' },
  ],
};

const FormItem = Form.Item;

interface BaseFormProps extends WrappedComponentProps {
  record: PermissionParamsType;
}

const BaseForm = ({ form, record }: BaseFormProps) => (
  <Form>
    <FormItem label="权限名称">
      {form.getFieldDecorator('name', { rules: rules.name, initialValue: record.name })(
        <Input placeholder="请输入权限名称" />,
      )}
    </FormItem>
    <FormItem label="权限中文名称">
      {form.getFieldDecorator('cnName', { rules: rules.cnName, initialValue: record.cnName })(
        <Input placeholder="请输入权限中文名称" />,
      )}
    </FormItem>
  </Form>
);

export default BaseForm;

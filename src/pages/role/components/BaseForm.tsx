import { Form, Input } from 'antd';

import MenusSelect from '../../menu/components/MenusSelect';
import PermissionsSelect from '../../permission/components/PermissionsSelect';
import React from 'react';
import { RoleParamsType } from '@/services/role';
import { ValidationRule } from 'antd/es/form';
import { WrappedComponentProps } from '@/components/FormDrawer';

const rules: {
  name: ValidationRule[];
  cnName: ValidationRule[];
} = {
  name: [{ required: true, message: '请输入角色名称' }, { max: 255, message: '角色名称长度不能多于 255 个字符' }],
  cnName: [
    { required: true, message: '请输入角色中文名称' },
    { max: 255, message: '角色中文名称长度不能多于 255 个字符' },
  ],
};

const FormItem = Form.Item;

interface BaseFormProps extends WrappedComponentProps {
  record: RoleParamsType;
}

const BaseForm = ({ form, record }: BaseFormProps) => (
  <Form>
    <FormItem label="角色名称">
      {form.getFieldDecorator('name', { rules: rules.name, initialValue: record.name })(
        <Input placeholder="请输入角色名称" />,
      )}
    </FormItem>
    <FormItem label="角色中文名称">
      {form.getFieldDecorator('cnName', { rules: rules.cnName, initialValue: record.cnName })(
        <Input placeholder="请输入角色中文名称" />,
      )}
    </FormItem>
    <FormItem label="关联权限">
      {form.getFieldDecorator('permissionIds', { initialValue: record.permissionIds })(
        <PermissionsSelect placeholder="请选择关联权限" />,
      )}
    </FormItem>
    <FormItem label="关联菜单">
      {form.getFieldDecorator('menuIds', { initialValue: record.menuIds })(
        <MenusSelect placeholder="请选择关联菜单" multiple />,
      )}
    </FormItem>
  </Form>
);

export default BaseForm;

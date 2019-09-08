import { Form, Input, InputNumber, Switch } from 'antd';

import IconSelect from '@/components/IconSelect';
import { MenuParamsType } from '@/services/menu';
import MenusSelect from './MenusSelect';
import React from 'react';
import { ValidationRule } from 'antd/es/form';
import { WrappedComponentProps } from '@/components/FormDrawer';

const rules: {
  path: ValidationRule[];
  name: ValidationRule[];
  icon: ValidationRule[];
  sort: ValidationRule[];
} = {
  path: [{ required: true, message: '请输入菜单路径' }, { max: 2048, message: '菜单路径长度不能多于 2048 个字符' }],
  name: [{ required: true, message: '请输入菜单名称' }, { max: 20, message: '菜单名称长度不能多于 20 个字符' }],
  icon: [{ max: 20, message: '菜单图标长度不能多于 20 个字符' }],
  sort: [{ required: true, message: '请输入排序值' }],
};

const FormItem = Form.Item;

interface BaseFormProps extends WrappedComponentProps {
  record: MenuParamsType;
}

const BaseForm = ({ form, record, id }: BaseFormProps) => (
  <Form>
    <FormItem label="上级菜单">
      {form.getFieldDecorator('parentId', { initialValue: record.parentId })(
        <MenusSelect
          placeholder="请选择上级菜单"
          disabledIds={id ? [id as number] : undefined}
          treeDefaultExpandedKeys={record.parentId ? [record.parentId.toString()] : undefined}
        />,
      )}
    </FormItem>
    <FormItem label="菜单路径">
      {form.getFieldDecorator('path', { rules: rules.path, initialValue: record.path })(
        <Input placeholder="请输入菜单路径" />,
      )}
    </FormItem>
    <FormItem label="菜单名称">
      {form.getFieldDecorator('name', { rules: rules.name, initialValue: record.name })(
        <Input placeholder="请输入菜单名称" />,
      )}
    </FormItem>
    <FormItem label="菜单图标">
      {form.getFieldDecorator('icon', { rules: rules.icon, initialValue: record.icon })(<IconSelect />)}
    </FormItem>
    <FormItem label="排序值">
      {form.getFieldDecorator('sort', { rules: rules.sort, initialValue: record.sort })(
        <InputNumber min={0} max={255} precision={0} placeholder="请输入排序值" style={{ width: '100%' }} />,
      )}
    </FormItem>
    <FormItem label="是否新窗口打开">
      {form.getFieldDecorator('newWindow', {
        initialValue: record.newWindow,
        valuePropName: 'checked',
      })(<Switch />)}
    </FormItem>
    <FormItem label="是否启用">
      {form.getFieldDecorator('enabled', {
        initialValue: record.enabled,
        valuePropName: 'checked',
      })(<Switch />)}
    </FormItem>
  </Form>
);

export default BaseForm;

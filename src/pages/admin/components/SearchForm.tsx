import { Form, Input, Select } from 'antd';

import React from 'react';
import { WrappedComponentProps } from '@/components/BasicTableList';

const FormItem = Form.Item;
const SelectOption = Select.Option;

export const prepareQuery = (values: { [propName: string]: any }) => {
  const newValues = { ...values };
  if ('key' in newValues && ['username', 'mobileNumber'].indexOf(newValues.key) === -1) {
    delete newValues.key;
  }
  if ('enabled' in newValues) {
    const enabled = parseInt(newValues.enabled, 10);
    if ([0, 1].indexOf(enabled) > -1) {
      newValues.enabled = enabled;
    } else {
      delete newValues.enabled;
    }
  }
  return newValues;
};

const SearchForm = (props: WrappedComponentProps['searchForm']) => {
  const { form, query } = props;
  const keySelector = form.getFieldDecorator('key', { initialValue: query.key || 'username' })(
    <Select style={{ width: 100 }}>
      <SelectOption value="username">用户名</SelectOption>
      <SelectOption value="mobileNumber">手机号码</SelectOption>
    </Select>,
  );

  return (
    <>
      <FormItem>
        {form.getFieldDecorator('keyword', { initialValue: query.keyword })(
          <Input placeholder="请输入" addonBefore={keySelector} allowClear />,
        )}
      </FormItem>
      <FormItem label="是否启用">
        {form.getFieldDecorator('enabled', { initialValue: query.enabled })(
          <Select placeholder="全部" style={{ width: 100 }} allowClear>
            <SelectOption key="1" value={1}>
              是
            </SelectOption>
            <SelectOption key="0" value={0}>
              否
            </SelectOption>
          </Select>,
        )}
      </FormItem>
    </>
  );
};

export default SearchForm;

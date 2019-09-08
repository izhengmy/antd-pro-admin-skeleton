import { DatePicker, Form, Input, Select } from 'antd';
import moment, { Moment } from 'moment';

import React from 'react';
import { WrappedComponentProps } from '@/components/BasicTableList';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const SelectOption = Select.Option;

export const prepareQuery = (values: { [propName: string]: any }) => {
  const newValues = { ...values };
  if (!newValues.startCreatedAt || !newValues.endCreatedAt) {
    newValues.startCreatedAt = moment()
      .startOf('month')
      .format('YYYY-MM-DD 00:00:00')
      .toString();
    newValues.endCreatedAt = moment()
      .endOf('month')
      .format('YYYY-MM-DD 23:59:59')
      .toString();
  }
  if ('successful' in newValues) {
    const successful = parseInt(newValues.successful, 10);
    if ([0, 1].indexOf(successful) > -1) {
      newValues.successful = successful;
    } else {
      delete newValues.successful;
    }
  }
  return newValues;
};

export const prepareSearchValues = (values: { [propName: string]: any }) => {
  const newValues = { ...values };
  if (Array.isArray(newValues.createdAtRange)) {
    if (newValues.createdAtRange.length === 2) {
      const [startCreatedAt, endCreatedAt] = newValues.createdAtRange;
      newValues.startCreatedAt = startCreatedAt.format('YYYY-MM-DD 00:00:00');
      newValues.endCreatedAt = endCreatedAt.format('YYYY-MM-DD 23:59:59');
    } else if (newValues.createdAtRange.length === 0) {
      newValues.startCreatedAt = undefined;
      newValues.endCreatedAt = undefined;
    }
    delete newValues.createdAtRange;
  }
  return newValues;
};

const SearchForm = (props: WrappedComponentProps['searchForm']) => {
  const { form, query } = props;
  let createdAtRange: Moment[] | null = null;
  if ('startCreatedAt' in query && 'endCreatedAt' in query) {
    createdAtRange = [
      moment(query.startCreatedAt, 'YYYY-MM-DD 00:00:00'),
      moment(query.endCreatedAt, 'YYYY-MM-DD 23:59:59'),
    ];
  }
  return (
    <>
      <FormItem label="手机号码">
        {form.getFieldDecorator('mobileNumber', { initialValue: query.mobileNumber })(
          <Input placeholder="请输入" allowClear />,
        )}
      </FormItem>
      <FormItem label="发送时间">
        {form.getFieldDecorator('createdAtRange', { initialValue: createdAtRange })(
          <RangePicker suffixIcon={null} style={{ width: 240 }} />,
        )}
      </FormItem>
      <FormItem label="是否成功">
        {form.getFieldDecorator('successful', { initialValue: query.successful })(
          <Select placeholder="请选择" style={{ width: 100 }} allowClear>
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

import * as service from '@/services/permission';

import { Checkbox, Select, Spin } from 'antd';
import React, { Component } from 'react';

import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { Permission } from '@/services/schemas';
import { okResponse } from '@/utils/utils';

const SelectOption = Select.Option;

interface PermissionsSelectProps {
  value?: number[];
  onChange?(value: number[]): void;
  placeholder?: string;
}

interface PermissionsSelectState {
  loading: boolean;
  permissions: Permission[];
  indeterminate: boolean;
  checkAll: boolean;
}

class PermissionsSelect extends Component<PermissionsSelectProps, PermissionsSelectState> {
  static getDerivedStateFromProps(nextProps: PermissionsSelectProps) {
    return nextProps.value || null;
  }

  state: PermissionsSelectState = {
    loading: false,
    permissions: [],
    indeterminate: false,
    checkAll: false,
  };

  componentDidMount() {
    this.fetchPermissions();
  }

  componentWillUnmount() {
    this.setState = () => {};
  }

  fetchPermissions = async () => {
    this.setState({
      loading: true,
      permissions: [],
    });

    const response = await service.all();

    if (!okResponse(response)) {
      this.setState({
        loading: false,
      });
      return;
    }

    const { permissions } = response.data;
    const value = this.props.value || [];

    this.setState({
      loading: false,
      permissions,
      indeterminate: !!value.length && value.length !== permissions.length,
      checkAll: value.length === permissions.length,
    });
  };

  handleChange = (value: number[]) => {
    const { onChange } = this.props;
    const { permissions } = this.state;
    if (onChange) {
      onChange(value);
    }
    this.setState({
      indeterminate: !!value.length && value.length !== permissions.length,
      checkAll: value.length === permissions.length,
    });
  };

  handleCheckAll = (event: CheckboxChangeEvent) => {
    const { onChange } = this.props;
    const { permissions } = this.state;
    const value = event.target.checked ? permissions.map(permission => permission.id) : [];
    if (onChange) {
      onChange(value);
    }
    this.setState({
      indeterminate: false,
      checkAll: event.target.checked,
    });
  };

  render() {
    const { value } = this.props;
    const { loading, permissions, indeterminate, checkAll } = this.state;
    return (
      <Spin spinning={loading}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Select
            mode="multiple"
            placeholder={this.props.placeholder || '请选择权限'}
            showSearch
            allowClear
            onChange={this.handleChange}
            value={value}
            optionFilterProp="title"
            autoClearSearchValue={false}
            maxTagCount={2}
            style={{ flex: 1, marginRight: '24px' }}
          >
            {permissions.map(permission => (
              <SelectOption key={permission.id} value={permission.id} title={permission.cnName}>
                {permission.cnName}
              </SelectOption>
            ))}
          </Select>
          <div style={{ width: '60px' }}>
            <Checkbox indeterminate={indeterminate} checked={checkAll} onChange={this.handleCheckAll}>
              全选
            </Checkbox>
          </div>
        </div>
      </Spin>
    );
  }
}

export default PermissionsSelect;

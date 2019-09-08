import * as service from '@/services/role';

import { Checkbox, Select, Spin } from 'antd';
import React, { Component } from 'react';

import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { Role } from '@/services/schemas';
import { okResponse } from '@/utils/utils';

const SelectOption = Select.Option;

interface RolesSelectProps {
  value?: number[];
  onChange?(value: number[]): void;
  placeholder?: string;
}

interface RolesSelectState {
  loading: boolean;
  roles: Role[];
  indeterminate: boolean;
  checkAll: boolean;
}

class RolesSelect extends Component<RolesSelectProps, RolesSelectState> {
  static getDerivedStateFromProps(nextProps: RolesSelectProps) {
    return nextProps.value || null;
  }

  state: RolesSelectState = {
    loading: false,
    roles: [],
    indeterminate: false,
    checkAll: false,
  };

  componentDidMount() {
    this.fetchRoles();
  }

  componentWillUnmount() {
    this.setState = () => {};
  }

  fetchRoles = async () => {
    this.setState({
      loading: true,
      roles: [],
    });

    const response = await service.all();

    if (!okResponse(response)) {
      this.setState({
        loading: false,
      });
      return;
    }

    const { roles } = response.data;
    const value = this.props.value || [];

    this.setState({
      loading: false,
      roles,
      indeterminate: !!value.length && value.length !== roles.length,
      checkAll: value.length === roles.length,
    });
  };

  handleChange = (value: number[]) => {
    const { onChange } = this.props;
    const { roles } = this.state;
    if (onChange) {
      onChange(value);
    }
    this.setState({
      indeterminate: !!value.length && value.length !== roles.length,
      checkAll: value.length === roles.length,
    });
  };

  handleCheckAll = (event: CheckboxChangeEvent) => {
    const { onChange } = this.props;
    const { roles } = this.state;
    const value = event.target.checked ? roles.map(role => role.id) : [];
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
    const { loading, roles, indeterminate, checkAll } = this.state;
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
            {roles.map(role => (
              <SelectOption key={role.id} value={role.id} title={role.cnName}>
                {role.cnName}
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

export default RolesSelect;

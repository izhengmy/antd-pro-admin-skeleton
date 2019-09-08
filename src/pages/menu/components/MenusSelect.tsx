import * as service from '@/services/menu';

import React, { Component } from 'react';
import { Spin, TreeSelect } from 'antd';

import { Menu } from '@/services/schemas';
import { TreeNodeNormal } from 'antd/lib/tree-select/interface';
import { okResponse } from '@/utils/utils';

interface MenusSelectProps {
  multiple?: boolean;
  value?: number | number[];
  onChange?(value: number | number[]): void;
  placeholder?: string;
  disabledIds?: number[];
  treeDefaultExpandedKeys?: string[];
}

interface MenusSelectState {
  loading: boolean;
  menus: Menu[];
}

class MenusSelect extends Component<MenusSelectProps, MenusSelectState> {
  static getDerivedStateFromProps(nextProps: MenusSelectProps) {
    return nextProps.value || null;
  }

  state: MenusSelectState = {
    loading: false,
    menus: [],
  };

  componentDidMount() {
    this.fetchMenus();
  }

  fetchMenus = async () => {
    this.setState({
      loading: true,
      menus: [],
    });

    const response = await service.all();

    if (!okResponse(response)) {
      this.setState({
        loading: false,
      });
      return;
    }

    const { menus } = response.data;

    this.setState({
      loading: false,
      menus,
    });
  };

  handleChange = (value: number | number[]) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(value);
    }
  };

  formatTreeData = (menus: Menu[], disabled: boolean = false): TreeNodeNormal[] =>
    menus.map(menu => {
      const { disabledIds } = this.props;
      const treeData: TreeNodeNormal = {
        title: menu.name,
        value: menu.id,
        key: menu.id.toString(),
        disabled,
        isLeaf: true,
      };
      if (typeof disabledIds !== 'undefined' && disabledIds.indexOf(menu.id) !== -1) {
        treeData.disabled = true;
      }
      if (menu.children) {
        treeData.children = this.formatTreeData(menu.children, treeData.disabled);
        treeData.isLeaf = false;
      }
      return treeData;
    });

  render() {
    const { value, multiple, treeDefaultExpandedKeys } = this.props;
    const { loading, menus } = this.state;
    const maxTagCount = multiple ? 2 : undefined;
    return (
      <Spin spinning={loading}>
        <TreeSelect
          allowClear
          placeholder={this.props.placeholder || '请选择菜单'}
          treeData={this.formatTreeData(menus)}
          value={value}
          multiple={multiple}
          maxTagCount={maxTagCount}
          onChange={this.handleChange}
          autoClearSearchValue={false}
          treeNodeFilterProp="title"
          showCheckedStrategy={TreeSelect.SHOW_ALL}
          treeDefaultExpandedKeys={treeDefaultExpandedKeys}
        />
      </Spin>
    );
  }
}

export default MenusSelect;

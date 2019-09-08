import * as service from '@/services/menu';

import { Button, Icon, Popconfirm, Table, message } from 'antd';
import { objectOnly, okResponse } from '@/utils/utils';

import BaseForm from './BaseForm';
import FormDrawer from '@/components/FormDrawer';
import { Menu } from '@/services/schemas';
import React from 'react';
import { WrappedComponentProps } from '@/components/BasicTableList';
import { withPermissions } from '@/components/Permission';

// @ts-ignore
const EditButton = withPermissions(['menus.update'])(Button);
const EditForm = FormDrawer.create({ title: '编辑菜单' })(BaseForm);
// @ts-ignore
const DestroyButton = withPermissions(['menus.destroy'])(Button);

const TableList = (props: WrappedComponentProps['table']) => (
  <Table
    {...props}
    rowKey="id"
    size="middle"
    columns={[
      {
        title: '菜单名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '菜单图标',
        dataIndex: 'icon',
        key: 'icon',
        align: 'center',
        width: 80,
        render: (icon: string) => (icon ? <Icon type={icon} /> : null),
      },
      {
        title: '是否启用',
        dataIndex: 'enabled',
        key: 'enabled',
        align: 'center',
        width: 80,
        render: (enabled: boolean) => <Icon type={enabled ? 'check' : 'close'} />,
      },
      {
        title: '菜单路径',
        dataIndex: 'path',
        key: 'path',
      },
      {
        title: '操作',
        key: 'actions',
        align: 'center',
        width: 150,
        render: (record: Menu) => (
          <>
            <EditForm
              control={<EditButton type="link">编辑</EditButton>}
              id={record.id}
              record={
                {
                  ...objectOnly(record, ['parentId', 'path', 'name', 'icon', 'sort', 'newWindow', 'enabled']),
                  icon: record.icon ? record.icon : undefined,
                } as service.MenuParamsType
              }
              handleSubmit={service.update}
              successfulCallback={props.fetchDataSource}
            />
            <Popconfirm
              title="您确定要删除吗？"
              onConfirm={async () => {
                const response = await service.destroy(record.id);
                if (okResponse(response)) {
                  message.success('操作成功');
                  props.fetchDataSource();
                }
              }}
            >
              <DestroyButton type="link">删除</DestroyButton>
            </Popconfirm>
          </>
        ),
      },
    ]}
  />
);

export default TableList;

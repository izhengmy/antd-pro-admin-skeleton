import * as service from '@/services/permission';

import { Button, Popconfirm, Table, message } from 'antd';
import { objectOnly, okResponse } from '@/utils/utils';

import BaseForm from './BaseForm';
import FormDrawer from '@/components/FormDrawer';
import { Permission } from '@/services/schemas';
import React from 'react';
import { WrappedComponentProps } from '@/components/BasicTableList';
import { withPermissions } from '@/components/Permission';

// @ts-ignore
const EditButton = withPermissions(['permissions.update'])(Button);
const EditForm = FormDrawer.create({ title: '编辑权限' })(BaseForm);
// @ts-ignore
const DestroyButton = withPermissions(['permissions.destroy'])(Button);

const TableList = (props: WrappedComponentProps['table']) => (
  <Table
    {...props}
    rowKey="id"
    size="middle"
    columns={[
      {
        title: '权限名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '权限中文名称',
        dataIndex: 'cnName',
        key: 'cnName',
      },
      {
        title: '创建时间',
        dataIndex: 'createdAt',
        key: 'createdAt',
        align: 'center',
        width: 170,
      },
      {
        title: '更新时间',
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        align: 'center',
        width: 170,
      },
      {
        title: '操作',
        key: 'actions',
        align: 'center',
        width: 150,
        render: (record: Permission) => (
          <>
            <EditForm
              control={<EditButton type="link">编辑</EditButton>}
              id={record.id}
              record={objectOnly(record, ['name', 'cnName']) as service.PermissionParamsType}
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

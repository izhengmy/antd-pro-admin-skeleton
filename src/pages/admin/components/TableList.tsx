import * as service from '@/services/admin';

import { Button, Icon, Popconfirm, Table, message } from 'antd';
import { objectOnly, okResponse } from '@/utils/utils';

import { Admin } from '@/services/schemas';
import BaseForm from './BaseForm';
import FormDrawer from '@/components/FormDrawer';
import React from 'react';
import { WrappedComponentProps } from '@/components/BasicTableList';
import { hasRole } from '@/utils/permission';
import { withPermissions } from '@/components/Permission';

// @ts-ignore
const EditButton = withPermissions(['admins.update'])(Button);
const EditForm = FormDrawer.create({ title: '编辑管理员' })(BaseForm);
// @ts-ignore
const DestroyButton = withPermissions(['admins.destroy'])(Button);
// @ts-ignore
const RestoreButton = withPermissions(['admins.restore'])(Button);
const actionDenied = (admin: Admin) => {
  const roles = admin.roles ? admin.roles.map(role => role.name) : [];
  return roles.includes('super-admin') && !hasRole(['super-admin']);
};

const TableList = (props: WrappedComponentProps['table']) => (
  <Table
    {...props}
    rowKey="id"
    size="middle"
    columns={[
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '用户名',
        dataIndex: 'username',
        key: 'username',
      },
      {
        title: '手机号码',
        dataIndex: 'mobileNumber',
        key: 'mobileNumber',
      },
      {
        title: '真实姓名',
        dataIndex: 'realName',
        key: 'realName',
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
        title: '是否删除',
        dataIndex: 'deletedAt',
        key: 'deletedAt',
        align: 'center',
        width: 80,
        render: (deletedAt: string) => <Icon type={deletedAt ? 'check' : 'close'} />,
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
        fixed: 'right',
        render: (record: Admin) => (
          <>
            <EditForm
              control={
                <EditButton type="link" forceDenied={actionDenied(record)}>
                  编辑
                </EditButton>
              }
              id={record.id}
              record={
                {
                  ...objectOnly(record, ['username', 'mobileNumber', 'realName', 'enabled']),
                  roleIds: record.roles ? record.roles.map(role => role.id) : [],
                } as service.AdminUpdateParamsType
              }
              handleSubmit={service.update}
              successfulCallback={props.fetchDataSource}
            />
            {record.deletedAt ? (
              <RestoreButton
                type="link"
                forceDenied={actionDenied(record)}
                onClick={async () => {
                  const response = await service.restore(record.id);
                  if (okResponse(response)) {
                    message.success('操作成功');
                    props.fetchDataSource();
                  }
                }}
              >
                恢复
              </RestoreButton>
            ) : (
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
                <DestroyButton type="link" forceDenied={actionDenied(record)}>
                  删除
                </DestroyButton>
              </Popconfirm>
            )}
          </>
        ),
      },
    ]}
    scroll={{
      x: 1000,
    }}
  />
);

export default TableList;

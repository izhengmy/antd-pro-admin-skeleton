import * as service from '@/services/permission';

import BasicTableList, { WrappedComponentProps } from '@/components/BasicTableList';

import BaseForm from './components/BaseForm';
import { Button } from 'antd';
import FormDrawer from '@/components/FormDrawer';
import React from 'react';
import TableList from './components/TableList';
import { withPermissions } from '@/components/Permission';

// @ts-ignore
const CreateButton = withPermissions(['permissions.store'])(Button);
const CreateForm = FormDrawer.create({ title: '创建权限' })(BaseForm);

export default BasicTableList.create({
  fetchDataSource: service.paginate,
  dataSourceKey: 'permissions',
})((props: WrappedComponentProps) => (
  <>
    {props.renderActionBar(
      <CreateForm
        control={<CreateButton type="primary">创建</CreateButton>}
        record={{} as service.PermissionParamsType}
        handleSubmit={service.store}
        successfulCallback={props.table.fetchDataSource}
      />,
    )}
    <TableList {...props.table} />
  </>
));

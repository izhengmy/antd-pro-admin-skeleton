import * as service from '@/services/role';

import BasicTableList, { WrappedComponentProps } from '@/components/BasicTableList';

import BaseForm from './components/BaseForm';
import { Button } from 'antd';
import FormDrawer from '@/components/FormDrawer';
import React from 'react';
import TableList from './components/TableList';
import { withPermissions } from '@/components/Permission';

// @ts-ignore
const CreateButton = withPermissions(['roles.store'])(Button);
const CreateForm = FormDrawer.create({ title: '创建角色' })(BaseForm);

export default BasicTableList.create({
  fetchDataSource: service.paginate,
  dataSourceKey: 'roles',
})((props: WrappedComponentProps) => (
  <>
    {props.renderActionBar(
      <CreateForm
        control={<CreateButton type="primary">创建</CreateButton>}
        record={{} as service.RoleParamsType}
        handleSubmit={service.store}
        successfulCallback={props.table.fetchDataSource}
      />,
    )}
    <TableList {...props.table} />
  </>
));

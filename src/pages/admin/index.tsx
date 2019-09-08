import * as service from '@/services/admin';

import BasicTableList, { WrappedComponentProps } from '@/components/BasicTableList';
import SearchForm, { prepareQuery } from './components/SearchForm';

import BaseForm from './components/BaseForm';
import { Button } from 'antd';
import FormDrawer from '@/components/FormDrawer';
import React from 'react';
import TableList from './components/TableList';
import { withPermissions } from '@/components/Permission';

// @ts-ignore
const CreateButton = withPermissions(['admins.store'])(Button);
const CreateForm = FormDrawer.create({ title: '创建管理员' })(BaseForm);

export default BasicTableList.create({
  fetchDataSource: service.paginate,
  dataSourceKey: 'admins',
  prepareQuery,
  exceptResetForm: ['key'],
})((props: WrappedComponentProps) => (
  <>
    {props.renderSearchForm(
      <SearchForm {...props.searchForm} />,
      <CreateForm
        control={<CreateButton type="primary">创建</CreateButton>}
        record={{ enabled: true } as service.AdminStoreParamsType}
        handleSubmit={service.store}
        successfulCallback={props.table.fetchDataSource}
      />,
    )}
    <TableList {...props.table} />
  </>
));

import * as service from '@/services/menu';

import BasicTableList, { WrappedComponentProps } from '@/components/BasicTableList';
import { Button, Divider } from 'antd';

import BaseForm from './components/BaseForm';
import FormDrawer from '@/components/FormDrawer';
import React from 'react';
import TableList from './components/TableList';
import { withPermissions } from '@/components/Permission';

// @ts-ignore
const CreateButton = withPermissions(['menus.store'])(Button);
const CreateForm = FormDrawer.create({ title: '创建菜单' })(BaseForm);

export default BasicTableList.create({
  fetchDataSource: service.all,
  dataSourceKey: 'menus',
  paginationable: false,
  expandable: true,
})((props: WrappedComponentProps) => (
  <>
    {props.renderActionBar(
      <>
        {props.renderToggleExpandButton()}
        <Divider type="vertical" />
        <CreateForm
          control={<CreateButton type="primary">创建</CreateButton>}
          record={{ sort: 0, newWindow: false, enabled: true } as service.MenuParamsType}
          handleSubmit={service.store}
          successfulCallback={props.table.fetchDataSource}
        />
      </>,
    )}
    <TableList {...props.table} />
  </>
));

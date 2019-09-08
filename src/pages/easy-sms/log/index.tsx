import * as service from '@/services/easySmsLog';

import BasicTableList, { WrappedComponentProps } from '@/components/BasicTableList';
import SearchForm, { prepareQuery, prepareSearchValues } from './components/SearchForm';

import React from 'react';
import TableList from './components/TableList';

export default BasicTableList.create({
  fetchDataSource: service.paginate,
  dataSourceKey: 'easySmsLogs',
  prepareQuery,
  prepareSearchValues,
})((props: WrappedComponentProps) => (
  <>
    {props.renderSearchForm(<SearchForm {...props.searchForm} />)}
    <TableList {...props.table} />
  </>
));

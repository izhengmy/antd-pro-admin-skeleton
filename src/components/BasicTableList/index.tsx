import { Button, Card, Form } from 'antd';
import React, { Component, ComponentType, ReactNode } from 'react';
import { getPageQuery, okResponse, praseHttpParams } from '@/utils/utils';

import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { TableProps } from 'antd/lib/table/interface';
import { stringify } from 'qs';
import styles from './index.less';

const FormItem = Form.Item;

interface Query {
  [propName: string]: any;
}

type ExpandedRowKeys = string[] | number[];

interface Config {
  fetchDataSource(query?: Query): Promise<any>;
  dataSourceKey?: string;
  paginationable?: boolean;
  expandable?: boolean;
  expandedRowKey?: string;
  prepareQuery?(values: Query): Query;
  prepareSearchValues?(values: Query): Query;
  exceptResetForm?: string[];
}

interface BasicTableListProps extends FormComponentProps {}

interface BasicTableListState {
  fetching: boolean;
  dataSource: [];
  pagination: TableProps<any>['pagination'];
  query: Query;
  expanded: boolean;
  expandedRowKeys: ExpandedRowKeys;
}

export interface WrappedComponentProps extends FormComponentProps {
  table: {
    loading: boolean;
    dataSource: [];
    pagination: TableProps<any>['pagination'];
    expandedRowKeys?: TableProps<any>['expandedRowKeys'];
    onExpandedRowsChange?: TableProps<any>['onExpandedRowsChange'];
    fetchDataSource(): Promise<any>;
  };
  searchForm: {
    form: WrappedComponentProps['form'];
    query: Query;
  };
  renderToggleExpandButton(): ReactNode;
  renderActionBar(element: ReactNode): ReactNode;
  renderSearchForm(element: ReactNode, actionsElement?: ReactNode): ReactNode;
}

const appendQueryString = (params: Query) => {
  const queryString = stringify(praseHttpParams(params, true));
  const { pathname } = window.location;
  window.history.replaceState(null, '', queryString ? `${pathname}?${queryString}` : pathname);
  return queryString || '';
};

const create = (config: Config) => (WrappedComponent: ComponentType<WrappedComponentProps>) => {
  const dataSourceKey = config.dataSourceKey || 'items';
  const paginationable = typeof config.paginationable === 'undefined' ? true : config.paginationable;
  const expandable = config.expandable || false;
  const expandedRowKey = config.expandedRowKey || 'id';
  const { prepareQuery, prepareSearchValues, exceptResetForm } = config;
  class BasicTable extends Component<BasicTableListProps, BasicTableListState> {
    state: BasicTableListState = {
      fetching: false,
      dataSource: [],
      pagination: paginationable ? {} : false,
      query: {},
      expanded: false,
      expandedRowKeys: [],
    };

    componentDidMount() {
      this.fetchDataSourceWithQueryString();
    }

    fetchDataSourceWithQueryString = () => {
      let query = getPageQuery();
      if (prepareQuery) {
        query = prepareQuery({ ...query });
      }

      this.setState(
        {
          query,
        },
        this.fetchDataSource,
      );
    };

    fetchDataSource = async () => {
      const { pagination, query } = this.state;

      this.setState({
        fetching: true,
      });

      const response = await config.fetchDataSource(query);
      const fetching = false;
      let dataSource = [];

      if (pagination) {
        pagination.current = query.page || 1;
      }

      if (okResponse(response)) {
        dataSource = response.data[dataSourceKey];
        if (pagination) {
          if (response.meta.currentPage > response.meta.lastPage) {
            this.handlePageChange(response.meta.lastPage);
            return;
          }
          pagination.current = response.meta.currentPage;
          pagination.pageSize = response.meta.perPage;
          pagination.total = response.meta.total;
        }
      }

      this.setState(
        {
          fetching,
          dataSource,
          pagination,
        },
        () => appendQueryString(query),
      );
    };

    handlePageChange = (page: number) => {
      const { query } = this.state;
      this.setState(
        {
          query: {
            ...query,
            page,
          },
        },
        this.fetchDataSource,
      );
    };

    handleExpandedRowsChange = (expandedRowKeys: ExpandedRowKeys) => {
      this.setState({
        expandedRowKeys,
      });
    };

    handleToggleExpanded = () => {
      const { dataSource, expanded } = this.state;
      if (expanded) {
        this.handleExpandedRowsChange([]);
      } else {
        const expandedRowKeys: ExpandedRowKeys = [];
        const localMap = (items: any[]) => {
          items.forEach((item: any) => {
            expandedRowKeys.push(item[expandedRowKey] as never);
            if (item.children) {
              localMap(item.children);
            }
          });
        };
        localMap(dataSource);
        this.handleExpandedRowsChange(expandedRowKeys);
      }
      this.setState({
        expanded: !expanded,
      });
    };

    renderToggleExpandButton = () => {
      const { expanded } = this.state;
      return (
        expandable && (
          <Button onClick={this.handleToggleExpanded} key="toggle-expand-button">
            {expanded ? '全部收起' : '全部展开'}
          </Button>
        )
      );
    };

    renderActionBar = (element: ReactNode): ReactNode => (
      <div className={styles['basic-table-list-action-bar']}>{element}</div>
    );

    renderSearchForm = (element: ReactNode, actionsElement?: ReactNode): ReactNode =>
      this.renderActionBar(
        <Form layout="inline">
          {element}
          <FormItem>
            <Button type="primary" loading={this.state.fetching} onClick={this.handleSearch}>
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.resetForm}>
              清空
            </Button>
            {actionsElement ? <span style={{ marginLeft: 8 }}>{actionsElement}</span> : null}
          </FormItem>
        </Form>,
      );

    handleSearch = () => {
      const { query } = this.state;
      let searchValues = this.props.form.getFieldsValue();
      if (prepareSearchValues) {
        searchValues = prepareSearchValues(searchValues);
      }
      this.setState(
        {
          query: {
            ...query,
            ...searchValues,
          },
        },
        this.fetchDataSource,
      );
    };

    resetForm = () => {
      const { form } = this.props;
      const values = form.getFieldsValue();
      const newValues: Query = { ...values };
      Object.keys(values).forEach((key: string) => {
        if (!exceptResetForm || exceptResetForm.indexOf(key) === -1) {
          form.setFieldsValue({
            [key]: null,
          });
          newValues[key] = null;
        }
      });
      this.setState(
        {
          query: newValues,
        },
        () => appendQueryString(newValues),
      );
    };

    render() {
      const props: WrappedComponentProps = {
        form: this.props.form,
        table: {
          loading: this.state.fetching,
          dataSource: this.state.dataSource,
          pagination: this.state.pagination && {
            ...this.state.pagination,
            onChange: this.handlePageChange,
            showTotal: (total: number) => `共 ${total} 条记录`,
            showQuickJumper: true,
          },
          fetchDataSource: this.fetchDataSource,
        },
        searchForm: {
          form: this.props.form,
          query: this.state.query,
        },
        renderToggleExpandButton: this.renderToggleExpandButton,
        renderActionBar: this.renderActionBar,
        renderSearchForm: this.renderSearchForm,
      };
      if (expandable) {
        props.table.expandedRowKeys = this.state.expandedRowKeys;
        props.table.onExpandedRowsChange = this.handleExpandedRowsChange;
      }
      return (
        <PageHeaderWrapper title={false}>
          <Card bordered={false}>
            <div className={styles['basic-table-list']}>
              <WrappedComponent {...props} />
            </div>
          </Card>
        </PageHeaderWrapper>
      );
    }
  }
  return Form.create<BasicTableListProps>()(BasicTable);
};

export default {
  create,
};

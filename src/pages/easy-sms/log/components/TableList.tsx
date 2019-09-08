import { Button, Drawer, Icon, Table } from 'antd';
import React, { Component } from 'react';

import { EasySmsLog } from '@/services/schemas';
import JsonView from 'react-json-view';
import { WrappedComponentProps } from '@/components/BasicTableList';

interface TableListState {
  drawer: {
    visible: boolean;
    title: string;
    raw: object;
  };
}

class TableList extends Component<WrappedComponentProps['table'], TableListState> {
  state: TableListState = {
    drawer: {
      visible: false,
      title: '',
      raw: {},
    },
  };

  showDrawer = (title: string, raw: object) => {
    this.setState({
      drawer: {
        visible: true,
        title,
        raw,
      },
    });
  };

  hideDrawer = () => {
    this.setState({
      drawer: {
        visible: false,
        title: '',
        raw: {},
      },
    });
  };

  render() {
    const { drawer } = this.state;
    return (
      <>
        <Table
          {...this.props}
          rowKey="id"
          size="middle"
          columns={[
            {
              title: '手机号码',
              dataIndex: 'mobileNumber',
              key: 'mobileNumber',
            },
            {
              title: '短信内容',
              dataIndex: 'message',
              key: 'content',
              render: (message: EasySmsLog['message']) => message.content,
            },
            {
              title: '数据包',
              dataIndex: 'message',
              key: 'message',
              align: 'center',
              width: 80,
              render: (message: EasySmsLog['message']) => (
                <Button type="link" onClick={() => this.showDrawer('数据包', message)}>
                  查看
                </Button>
              ),
            },
            {
              title: '结果集',
              dataIndex: 'results',
              key: 'results',
              align: 'center',
              width: 80,
              render: (results: EasySmsLog['results']) => (
                <Button type="link" onClick={() => this.showDrawer('结果集', results)}>
                  查看
                </Button>
              ),
            },
            {
              title: '是否成功',
              dataIndex: 'successful',
              key: 'successful',
              align: 'center',
              width: 80,
              render: (successful: boolean) => <Icon type={successful ? 'check' : 'close'} />,
            },
            {
              title: '发送时间',
              dataIndex: 'createdAt',
              key: 'createdAt',
              align: 'center',
              width: 170,
            },
          ]}
        />
        <Drawer title={drawer.title} visible={drawer.visible} onClose={this.hideDrawer} width={500} destroyOnClose>
          <JsonView
            src={drawer.raw}
            indentWidth={2}
            displayDataTypes={false}
            sortKeys
            style={{ overflowX: 'auto', maxHeight: 'calc(100vh - 103px)' }}
          />
        </Drawer>
      </>
    );
  }
}

export default TableList;

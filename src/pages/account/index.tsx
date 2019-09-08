import * as service from '@/services/account';

import { Card, Tabs, message } from 'antd';
import React, { Component } from 'react';

import Basic from './components/Basic';
import { ConnectState } from '@/models/connect';
import { Dispatch } from 'redux';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Profile } from '@/services/schemas';
import Security from './components/Security';
import { connect } from 'dva';
import { okResponse } from '@/utils/utils';

const { TabPane } = Tabs;

interface IndexProps {
  dispatch: Dispatch;
  profile: Profile;
}

class Index extends Component<IndexProps> {
  handleBasicSubmit = async (params: service.ProfileUpdateParamsType) => {
    const { dispatch } = this.props;
    const response = await service.updateProfile(params);
    if (okResponse(response)) {
      message.success('更新成功');
      dispatch({
        type: 'account/saveProfile',
        payload: response.data,
      });
    }
    return response;
  };

  handleSecuritySubmit = async (params: service.PasswordUpdateParamsType) => {
    const response = await service.updatePassword(params);
    if (okResponse(response)) {
      message.success('更新成功');
    }
    return response;
  };

  render() {
    const { profile } = this.props;
    return (
      <PageHeaderWrapper title={false}>
        <Card>
          <Tabs tabPosition="left">
            <TabPane key="basic" tab="基本设置">
              <Basic profile={profile} handleSubmit={this.handleBasicSubmit} />
            </TabPane>
            <TabPane key="security" tab="安全设置">
              <Security handleSubmit={this.handleSecuritySubmit} />
            </TabPane>
          </Tabs>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ account }: ConnectState) => ({
  profile: account.profile,
}))(Index);

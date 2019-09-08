import { ConnectProps, ConnectState } from '@/models/connect';

import PageLoading from '@/components/PageLoading';
import { Profile } from '@/services/schemas';
import React from 'react';
import { Redirect } from 'umi';
import { connect } from 'dva';

interface SecurityLayoutProps extends ConnectProps {
  loading: boolean;
  profile: Profile;
}

interface SecurityLayoutState {
  isReady: boolean;
}

class SecurityLayout extends React.Component<SecurityLayoutProps, SecurityLayoutState> {
  state: SecurityLayoutState = {
    isReady: false,
  };

  componentDidMount() {
    this.setState({
      isReady: true,
    });
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'account/getProfile',
      });
    }
  }

  render() {
    const { isReady } = this.state;
    const { children, loading, profile } = this.props;
    if ((!profile && loading) || !isReady) {
      return <PageLoading />;
    }
    if (!profile) {
      return <Redirect to="/auth/login"></Redirect>;
    }
    return children;
  }
}

export default connect(({ account, loading }: ConnectState) => ({
  profile: account.profile,
  loading: loading.models.account,
}))(SecurityLayout);

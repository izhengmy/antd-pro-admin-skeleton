import { Avatar, Icon, Menu, Modal, Spin } from 'antd';
import { ConnectProps, ConnectState } from '@/models/connect';

import { ClickParam } from 'antd/es/menu';
import HeaderDropdown from '../HeaderDropdown';
import { Profile } from '@/services/schemas';
import React from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import styles from './index.less';

export interface GlobalHeaderRightProps extends ConnectProps {
  profile?: Profile;
  menu?: boolean;
}

const { confirm } = Modal;

class AvatarDropdown extends React.Component<GlobalHeaderRightProps> {
  onMenuClick = (event: ClickParam) => {
    const { key } = event;

    if (key === 'logout') {
      confirm({
        title: '您确定要退出登录吗？',
        onOk: () => {
          const { dispatch } = this.props;
          if (dispatch) {
            dispatch({
              type: 'auth/logout',
              payload: {
                redirect: window.location.href,
              },
            });
          }
        },
        okText: '确定',
        cancelText: '取消',
      });
      return;
    }

    router.push('/account');
  };

  render(): React.ReactNode {
    const { profile } = this.props;
    const menuHeaderDropdown = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        <Menu.Item key="center">
          <Icon type="user" />
          个人中心
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout">
          <Icon type="logout" />
          退出登录
        </Menu.Item>
      </Menu>
    );
    return profile && profile.username ? (
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`}>
          <Avatar icon="user" size="small" className={styles.avatar} alt="avatar" />
          <span className={styles.name}>{profile.username}</span>
        </span>
      </HeaderDropdown>
    ) : (
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    );
  }
}

export default connect(({ account }: ConnectState) => ({
  profile: account.profile,
}))(AvatarDropdown);

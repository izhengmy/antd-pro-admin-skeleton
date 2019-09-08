import { ConnectProps, ConnectState } from '@/models/connect';
import { MenuDataItem, getMenuData, getPageTitle } from '@ant-design/pro-layout';

import DocumentTitle from 'react-document-title';
import GlobalFooter from '@/components/GlobalFooter';
import { Icon } from 'antd';
import Link from 'umi/link';
import React from 'react';
import { connect } from 'dva';
import logo from '../assets/logo.svg';
import styles from './UserLayout.less';

export interface UserLayoutProps extends ConnectProps {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
}

const UserLayout: React.SFC<UserLayoutProps> = props => {
  const {
    route = {
      routes: [],
    },
  } = props;
  const { routes = [] } = route;
  const {
    children,
    location = {
      pathname: '',
    },
  } = props;
  const { breadcrumb } = getMenuData(routes);
  return (
    <DocumentTitle
      title={getPageTitle({
        pathname: location.pathname,
        breadcrumb,
        ...props,
      })}
    >
      <div className={styles.container}>
        <div className={styles.lang} />
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="logo" className={styles.logo} src={logo} />
                <span className={styles.title}>Ant Design</span>
              </Link>
            </div>
            <div className={styles.desc} />
          </div>
          {children}
        </div>
        <GlobalFooter
          copyright={
            <>
              Copyright <Icon type="copyright" /> 2019 蚂蚁金服体验技术部出品
            </>
          }
        />
      </div>
    </DocumentTitle>
  );
};

export default connect(({ settings }: ConnectState) => ({ ...settings }))(UserLayout);

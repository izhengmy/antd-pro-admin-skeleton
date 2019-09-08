import { ConnectProps, Route } from '@/models/connect';

import Authorized from '@/utils/Authorized';
import React from 'react';
import Redirect from 'umi/redirect';
import { connect } from 'dva';
import pathToRegexp from 'path-to-regexp';
import router from 'umi/router';
import { tokenExpired } from '@/utils/jwtToken';

interface AuthComponentProps extends ConnectProps {}

const getRouteAuthority = (path: string, routeData: Route[]) => {
  let authorities: string[] | string | undefined;
  routeData.forEach(route => {
    // match prefix
    if (pathToRegexp(`${route.path}(.*)`).test(path)) {
      // exact match
      if (route.path === path) {
        authorities = route.authority || authorities;
      }
      // get children authority recursively
      if (route.routes) {
        authorities = getRouteAuthority(path, route.routes) || authorities;
      }
    }
  });
  return authorities;
};

const AuthComponent: React.FC<AuthComponentProps> = ({
  children,
  route = {
    routes: [],
  },
  location = {
    pathname: '',
  },
}) => {
  const { routes = [] } = route;
  const isLogin = !tokenExpired();
  if (!isLogin) {
    router.replace({
      pathname: '/auth/login',
      query: {
        redirect: encodeURI(window.location.href),
      },
    });
  }
  return (
    <Authorized
      authority={getRouteAuthority(location.pathname, routes) || ''}
      noMatch={
        isLogin ? (
          <Redirect to="/exception/403" />
        ) : (
          <Redirect
            to={{
              pathname: '/auth/login',
              search: `?redirect=${encodeURIComponent(window.location.href)}`,
            }}
          />
        )
      }
    >
      {children}
    </Authorized>
  );
};

export default connect()(AuthComponent);

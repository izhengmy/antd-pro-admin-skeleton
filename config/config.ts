import { IConfig, IPlugin } from 'umi-types';

import defaultSettings from './defaultSettings'; // https://umijs.org/config/
import slash from 'slash2';
import webpackPlugin from './plugin.config';

const { pwa, primaryColor } = defaultSettings;
const plugins: IPlugin[] = [
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
      },
      locale: {
        // default false
        enable: false,
        // default zh-CN
        default: 'zh-CN',
        // default true, when it is true, will use `navigator.language` overwrite default
        baseNavigator: true,
      },
      dynamicImport: {
        loadingComponent: './components/PageLoading/index',
        webpackChunkName: true,
        level: 3,
      },
      pwa: pwa
        ? {
            workboxPluginMode: 'InjectManifest',
            workboxOptions: {
              importWorkboxFrom: 'local',
            },
          }
        : false, // default close dll, because issue https://github.com/ant-design/ant-design-pro/issues/4665
      // dll features https://webpack.js.org/plugins/dll-plugin/
      // dll: {
      //   include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
      //   exclude: ['@babel/runtime', 'netlify-lambda'],
      // },
    },
  ],
  [
    'umi-plugin-pro-block',
    {
      moveMock: false,
      moveService: false,
      modifyRequest: true,
      autoAddMenu: true,
    },
  ],
];
export default {
  plugins,
  block: {
    // 国内用户可以使用码云
    defaultGitUrl: 'https://gitee.com/ant-design/pro-blocks', // defaultGitUrl: 'https://github.com/ant-design/pro-blocks',
  },
  hash: true,
  targets: {
    ie: 11,
  },
  devtool: false,
  // umi routes: https://umijs.org/zh/guide/router.html
  routes: [
    {
      path: '/auth',
      component: '../layouts/UserLayout',
      routes: [
        {
          path: '/auth/login',
          name: '管理员登录',
          component: './auth/login',
        },
        {
          component: './exception/404',
        },
      ],
    },
    {
      path: '/',
      component: '../layouts/SecurityLayout',
      Routes: ['src/pages/Authorized'],
      routes: [
        {
          path: '/',
          component: '../layouts/BasicLayout',
          routes: [
            {
              path: '/',
              redirect: '/dashboard',
            },
            {
              path: '/dashboard',
              name: 'Dashboard',
              component: './Dashboard',
            },
            {
              path: '/account',
              name: '个人中心',
              component: './account',
            },
            {
              path: '/system',
              name: '系统管理',
              routes: [
                {
                  path: '/system/permissions',
                  name: '权限管理',
                  component: './permission',
                  authority: ['permissions.index'],
                },
                {
                  path: '/system/roles',
                  name: '角色管理',
                  component: './role',
                  authority: ['roles.index'],
                },
                {
                  path: '/system/menus',
                  name: '菜单管理',
                  component: './menu/index',
                  authority: ['menus.index'],
                },
                {
                  path: '/system/easy-sms-logs',
                  name: 'EasySms 日志',
                  component: './easy-sms/log',
                  authority: ['easy-sms-logs.index'],
                },
              ],
            },
            {
              path: '/admins',
              name: '管理员管理',
              component: './admin',
              authority: ['admins.index'],
            },
            {
              path: '/exception',
              name: '异常',
              routes: [
                {
                  path: '/exception/403',
                  name: '403',
                  component: './exception/403',
                },
                {
                  path: '/exception/404',
                  name: '404',
                  component: './exception/404',
                },
              ],
            },
            {
              component: './exception/404',
            },
          ],
        },
        {
          component: './exception/404',
        },
      ],
    },
    {
      component: './exception/404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': primaryColor,
  },
  define: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: '',
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (
      context: {
        resourcePath: string;
      },
      _: string,
      localName: string,
    ) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }

      const match = context.resourcePath.match(/src(.*)/);

      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = slash(antdProPath)
          .split('/')
          .map((a: string) => a.replace(/([A-Z])/g, '-$1'))
          .map((a: string) => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }

      return localName;
    },
  },
  manifest: {
    basePath: '/',
  },
  chainWebpack: webpackPlugin,
  proxy: {
    '/api/': {
      target: 'http://127.0.0.1:8000/admin/api/',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '',
      },
    },
  },
} as IConfig;

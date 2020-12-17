import * as React from 'react';
import { runApp } from 'ice';
import LocaleProvider from '@/components/LocaleProvider';
import { getLocale } from '@/utils/locale';

const locale = getLocale();
const appConfig = {
  request: {
    // 可选的，全局设置 request 是否返回 response 对象，默认为 false
    withFullResponse: false,

    // eslint-disable-next-line @iceworks/best-practices/no-http-url
    baseURL: 'http://ice-blog-server.ygjie.icu',
    // baseURL: 'http://localhost:5005',
    headers: {},
    // ...RequestConfig 其他参数

    // 拦截器
    interceptors: {
      request: {
        onConfig: (config) => {
          // 发送请求前：可以对 RequestConfig 做一些统一处理
          console.log(window.sessionStorage.getItem('token'));
          const tokenStr = window.sessionStorage.getItem('token');
          const JSESSIONID = window.sessionStorage.getItem('JSESSIONID');
          config.headers.Token = tokenStr;
          config.headers.JSESSIONID = JSESSIONID;
          console.log(config.headers);
          return config;
        },
        onError: (error) => {
          return Promise.reject(error);
        },
      },
    },
  },
  app: {
    rootId: 'ice-container',
    addProvider: ({ children }) => <LocaleProvider locale={locale}>{children}</LocaleProvider>,
  },
};
runApp(appConfig);

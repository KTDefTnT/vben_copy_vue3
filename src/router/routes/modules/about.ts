import type { AppRouteRecordRaw } from 'src/router/types';
import { LAYOUT } from '../../constant';

const dashboard: AppRouteRecordRaw = {
  path: '/about',
  name: 'About',
  component: LAYOUT,
  redirect: '/about/index',
  meta: {
    hideChildrenInMenu: true,
    icon: 'simple-icons:about-dot-me',
    title: '首页',
    orderNo: 100000,
  },
  children: [
    {
      path: 'index',
      name: 'AboutPage',
      component: () => import('src/views/system/about/index.vue'),
      meta: {
        title: '关于',
        hideMenu: true,
      },
    },
  ],
};

export default dashboard;

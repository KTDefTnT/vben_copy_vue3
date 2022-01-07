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
      path: 'menu1',
      name: 'menu-1',
      component: () => import('src/views/system/about/index.vue'),
      meta: {
        title: 'menu-1',
        hideMenu: true,
      },
      children: [{
        path: 'menu1-1',
        name: 'menu-1-1',
        component: () => import('src/views/system/about/index.vue'),
        meta: {
          title: 'menu-1-1',
          hideMenu: true,
        }
      }, {
        path: 'menu1-2',
        name: 'menu-1-2',
        component: () => import('src/views/system/about/index.vue'),
        meta: {
          title: 'menu-1-2',
          hideMenu: true,
        }
      }]
    },
  ],
};

export default dashboard;

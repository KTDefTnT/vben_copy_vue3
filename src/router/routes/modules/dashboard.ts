import type { AppRouteRecordRaw } from "src/router/types";
import { LAYOUT } from '../../constant';

const dashboard: AppRouteRecordRaw = {
  path: '/dashboard',
  name: 'Dashboard',
  redirect: '/dashboard/analysis',
  component: LAYOUT,
  meta: {
    title: 'dashboard'
  },
  children: [{
    path: 'analysis',
    name: 'Analysis',
    component: () => import('src/views/dashboard/analysis/index.vue'),
    meta: {
      title: '分析'
    }
  }, {
    path: 'workbench',
    name: 'workbench',
    component: () => import('src/views/dashboard/workbench/index.vue'),
    meta: {
      title: '工作台'
    }
  }]
};

export default dashboard;
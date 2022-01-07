import type { AppRouteRecordRaw } from 'src/router/types';
// 获取文件
const modules = import.meta.globEager('/src/router/routes/modules/*.ts');

const routeModuleList: AppRouteRecordRaw[] = [];

Object.keys(modules).forEach((key) => {
  const mod = modules[key].default || {};
  const modList = Array.isArray(mod) ? [...mod] : [mod];
  routeModuleList.push(...modList);
});

export const asyncRoutes = [...routeModuleList];

export const basicRoutes = [
  ...routeModuleList
];
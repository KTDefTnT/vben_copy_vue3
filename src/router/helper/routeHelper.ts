import type { AppRouteModule, AppRouteRecordRaw } from 'src/router/types';
import type { Router, RouteRecordNormalized } from 'vue-router';
import { warn } from 'src/core/utils/log';
import { cloneDeep, omit } from 'lodash-es';
import { LAYOUT, IFRAME, EXCEPTION_COMPONENT } from 'src/router/constant';
import { createRouter, createWebHashHistory } from 'vue-router';

const LayoutMap = new Map<string, () => Promise<typeof import('*.vue')>>();

LayoutMap.set('LAYOUT', LAYOUT);
LayoutMap.set('IFRAME', IFRAME);

let dynamicViewsModules: Record<string, () => Promise<Recordable>>;

export function transformObjToRoute<T = AppRouteModule>(routeList: AppRouteRecordRaw[]) {
  routeList.map(route => {
    // 获取函数的component参数
    const component = route.component as string;
    // 判断是否存在component属性
    if (component) {
      // 判断是否为根组件
      if (component === 'LAYOUT') {
        route.component = LayoutMap.get(component.toUpperCase());
      } else {
        // 默认新增第一层
        route.children = [cloneDeep(route)];
        route.component = LAYOUT;
        route.name = `${route.name}Parent`;
        const meta = route.meta || {};
        meta.single = true;
        meta.affix = false;
        route.meta = meta;
      }
    } else {
      warn('请正确配置路由：' + route?.name + '的component属性');
    }

    // 如果存在子路由 则向下遍历，动态获取component
    route.children && asyncImportRoute(route.children);
  });

  return routeList as unknown as T[];
}

// 根据route的component动态获取文档中的文件
function asyncImportRoute(routes: AppRouteRecordRaw[] | undefined) {
  dynamicViewsModules = dynamicViewsModules || import.meta.glob('/src/views/**/*.{vue,tsx}');
  if (!routes) return;
  routes.map(route => {
    const { component, name, children } = route;
    if (component) {
      const layoutFound = LayoutMap.get(component.toUpperCase());
      // 判断是否为根路由
      if (layoutFound) {
        route.component = layoutFound;
      } else {
        route.component = dynamicImport(dynamicViewsModules, component as string);
      }
    } else if (name) {
      console.log('name', name);
    }

    // 若依然存在子路由 则继续遍历
    children && asyncImportRoute(children);
  });
}

function dynamicImport(
  dynamicViewsModules: Record<string, () => Promise<Recordable>>,
  component: string,
) {
  let keys = Object.keys(dynamicViewsModules);
  // 查找匹配的matchKey
  const matchedKeys = keys.filter(key => {
    // 去掉收尾
    const k = key.replace('/src/views', '');
    // 判断后端返回的component路径是否为/开头 或者带.vue .tsx
    const startFlag = component.startsWith('/');
    const endFlag = component.endsWith('.vue') || component.endsWith('.tsx');
    const startIndex = startFlag ? 0 : 1;
    const endIndex = endFlag ? k.length : k.lastIndexOf('.');
    return k.substring(startIndex, endIndex) === component;
  });

  // 判断如果找到后的matchKeys个数
  if (matchedKeys?.length === 1) {
    const matchKey = matchedKeys[0];
    return dynamicViewsModules[matchKey];
  } else if (matchedKeys?.length > 1){
    // 存在多个同名文件夹
    warn(
      'Please do not create `.vue` and `.TSX` files with the same file name in the same hierarchical directory under the views folder. This will cause dynamic introduction failure',
    );
    return;
  } else {
    // 没有匹配 则没有创建文件夹
    warn('在src/views/下找不到`' + component + '.vue` 或 `' + component + '.tsx`, 请自行创建!');
    return EXCEPTION_COMPONENT;
  }
}

/**
 * @param routeModules 路由信息
 * @returns 
 * Convert multi-level routing to level 2 routing
 * 将多级路由拍平成两级
 */
export function flatMultiLevelRoutes(routeModules: AppRouteModule[]) {
  const modules: AppRouteModule[] = cloneDeep(routeModules);
  for(let index =0; index < modules.length; index++) {
    // 第一层级的route
    const routeModule = modules[index];
    // 如果当前的层级没有超过2层 则不需要处理 直接跳出循环 继续执行下一个
    if (!isMultipleRoute(routeModule)) {
      continue;
    }
    // 执行多层  将3层及3层以上拍平到第二层
    promoteRouteLevel(routeModule);
  }
  return modules;
}

// Routing level upgrade
/**
 * @param routeModule 根级路由信息
 */
function promoteRouteLevel(routeModule: AppRouteModule) {
  // Use vue-router to splice menus
  let router: Router | null = createRouter({
    routes: [routeModule as unknown as RouteRecordNormalized],
    history: createWebHashHistory(),
  });

  // 获取所有路由信息
  const routes = router.getRoutes();
  addToChildren(routes, routeModule.children || [], routeModule);
  // 将路由实例置空
  router = null;

  routeModule.children = routeModule.children?.map((item) => omit(item, 'children'));
}

// Add all sub-routes to the secondary route
function addToChildren(
  routes: RouteRecordNormalized[],
  children: AppRouteRecordRaw[],
  routeModule: AppRouteModule,
) {
  // 遍历子路由
  for (let index = 0; index < children.length; index++) {
    let child = children[index];
    // 判断当前的路由是否为活跃路由 即是否存在于活跃路由单中
    const route = routes.find((item) => item.name === child.name);
    // 若不存在于列表中，则不处理当前路由
    if(!route) {
      continue;
    }

    routeModule.children = routeModule.children || [];
    // 判断当前路由是否存在于第二层，若不处于第二层 则追加到第二层
    if (!routeModule.children.find(item => item.name === route.name)) {
      routeModule.children.push(route as unknown as AppRouteModule);
    }

    // 判断当前路由下是否还有子路由，若依然存在子路由 则递归处理
    if (child.children?.length) {
      addToChildren(routes, child.children, routeModule);
    }
  }
}

// Determine whether the level exceeds 2 levels
/**
 * 如果当前路由存在3层，则返回true
 * @param routeModule 路由信息
 * @returns 判断是否存在两级以上的路由
 */
function isMultipleRoute(routeModule: AppRouteModule) {
  if (!routeModule || !Reflect.has(routeModule, 'children') || !routeModule.children?.length) {
    return false;
  }

  const children = routeModule.children;

  let flag = false;
  for (let index = 0; index < children.length; index++) {
    const child = children[index];
    if (child.children?.length) {
      flag = true;
      break;
    }
  }
  return flag;
}

import { AppRouteModule, AppRouteRecordRaw, Menu } from 'src/router/types';
import { isUrl } from 'src/core/utils/is';
import { findPath, treeMap } from 'src/core/utils/helper/treeHelper';
import { cloneDeep } from 'lodash-es';

export function transformRouteToMenu(routeModList: AppRouteModule[], routerMapping = false) {
  const cloneRouteModList = cloneDeep(routeModList);
  const routeList: AppRouteRecordRaw[] = [];

  // 遍历， 根据meta进行调整
  cloneRouteModList.map(route => {
    // ! routerMapping不知道干嘛的
    if (routerMapping && route.meta.hideChildrenInMenu && typeof route.redirect === 'string') {
      route.path = route.redirect;
    }

    // 判断meta.single 是否只需要子路由中的一个 
    // ! 不知道的业务场景
    if(route?.meta?.single) {
      const realRoute = route?.children?.[0];
      realRoute && routeList.push(realRoute);
    } else {
      routeList.push(route);
    }
  });

  // 获取树形menu
  const list = treeMap(routeList, {
    conversion: (node: AppRouteRecordRaw) => {
      const { meta: { title, hideMenu = false } = {} } = node;

      return {
        ...(node.meta || {}),
        meta: node.meta,
        name: title,
        hideMenu,
        path: node.path,
        ...(node.redirect ? { redirect: node.redirect } : {}),
      }
    }
  });

  // 组合path
  joinParentPath(list);
  return cloneDeep(list);
}

// 组合path
function joinParentPath(menus: Menu[], parentPath = '') {
  for (let index = 0; index < menus.length; index++) {
    const menu = menus[index];
    // 如果当前menu以 / 开始，或者是一个url地址 则不需要拼接
    if (!(menu.path.startsWith('/') || isUrl(menu.path))) {
      menu.path = `${parentPath}/${menu.path}`;
    }

    if (menu?.children?.length) {
      joinParentPath(menu.children, menu.meta?.hidePathForChildren ? parentPath : menu.path);
    }
  }
}


// 获取父级path
export function getAllParentPath<T = Recordable>(treeData: T[], path?: string) {
  const menus = findPath(treeData, node => node.path === path);
  // 返回所有匹配菜单的path
  return (menus && menus.map(item => item.path));
}

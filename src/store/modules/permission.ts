import { toRaw } from 'vue';
import { defineStore } from "pinia";
import { useUserStore } from './user';
import { asyncRoutes } from 'src/router/routes';
import type { AppRouteRecordRaw, Menu } from 'src/router/types';
import { PermissionModeEnum } from 'src/enums/appEnum';

import { filter } from 'src/core/utils/helper/treeHelper';
import { flatMultiLevelRoutes, transformObjToRoute } from 'src/router/helper/routeHelper';
import { transformRouteToMenu } from 'src/router/helper/menuHelper';
import { getPermCode } from 'src/api/system/user.api';
import { getMenuList } from 'src/api/system/menu.api';

interface PermissionState {
  // Permission code list 编码列表
  permCodeList: string[] | number[];
  // Whether the route has been dynamically added 是否需要动态添加路由
  isDynamicAddedRoute: boolean;
  // To trigger a menu update 最新创建菜单的时间
  lastBuildMenuTime: number;
  // Backstage menu list 后台返回的菜单列表
  backMenuList: Menu[];
  // 前端平台的菜单列表
  frontMenuList: Menu[];
};

export const usePermissionStore = defineStore({
  id: 'app-permission',
  state: (): PermissionState => ({
    permCodeList: [],
    // Whether the route has been dynamically added
    isDynamicAddedRoute: false,
    // To trigger a menu update
    lastBuildMenuTime: 0,
    // Backstage menu list
    backMenuList: [],
    // menu List
    frontMenuList: [],
  }),
  getters: {
    getPermCodeList(): string[] | number[] {
      return this.permCodeList;
    },
    getIsDynamicAddedRoute(): boolean {
      return this.isDynamicAddedRoute;
    },
    getLastBuildMenuTime(): number {
      return this.lastBuildMenuTime;
    },
    getBackMenuList(): Menu[] {
      return this.backMenuList;
    },
    getFrontMenuList(): Menu[] {
      return this.frontMenuList;
    }
  },
  actions: {
    // 重置所有状态
    resetState(): void {
      this.isDynamicAddedRoute = false;
      this.permCodeList = [];
      this.backMenuList = [];
      this.lastBuildMenuTime = 0;
    },
    setPermCodeList(codeList: string[]) {
      this.permCodeList = codeList;
    },
    setDynamicAddedRoute(added: boolean) {
      this.isDynamicAddedRoute = added;
    },
    setLastBuildMenuTime() {
      this.lastBuildMenuTime = new Date().getTime();
    },
    setBackMenuList(list: Menu[]) {
      this.backMenuList = list;
      list?.length > 0 && this.setLastBuildMenuTime();
    },
    setFrontMenuList(list: Menu[]) {
      this.frontMenuList = list;
    },
    async changePermissionCode() {
      const codeList = await getPermCode();
      this.setPermCodeList(codeList);
    },
    async buildRoutesAction() {
      // 获取后台返回的路由信息
      const userStore = useUserStore();
      let routes: AppRouteRecordRaw[] = [];
      // toRaw将响应式数据提取成普通数据
      const roleList = toRaw(userStore.getRoleList) || [];
      // 固定使用后台路由， 可配置化获取
      let enums = {
        BACK: PermissionModeEnum.BACK,
        ROLE: PermissionModeEnum.ROLE,
        ROUTE_MAPPING: PermissionModeEnum.ROUTE_MAPPING
      };
      /**
       * 
       * @param route 路由
       * @returns 判断当前路由是否设置meta，限制角色访问
       */
      const routeFilter = (route: AppRouteRecordRaw) => {
        const { meta } = route;
        const { roles } = meta || {};
        if (!roles) return true;
        return roleList.some((role) => (roles as Array<any>).includes(role));
      };

      /**
       * 
       * @param route 路由
       * @returns 判断当前路由是否需要被忽略
       */
      const routeRemoveIgnoreFilter = (route: AppRouteRecordRaw) => {
        const { meta } = route;
        const { ignoreRoute } = meta || {};
        return !ignoreRoute;
      };

      const permissionMode = enums['BACK'];
      switch (permissionMode) {
        case PermissionModeEnum.BACK:
          let routeList: AppRouteRecordRaw[] = [];
          try {
            this.changePermissionCode();
            // 获取路由
            routeList = (await getMenuList()) as AppRouteRecordRaw[];
          } catch (error) {
            console.error(error);
          }

          // Dynamically introduce components 动态引入组件信息
          routeList = transformObjToRoute(routeList);

          // 将路由信息转化为菜单信息，并保存进store中
          const backMenuList = transformRouteToMenu(routeList);
          this.setBackMenuList(backMenuList);
          
          routeList = filter(routeList, routeRemoveIgnoreFilter);
          routeList = routeList.filter(routeRemoveIgnoreFilter);

          routeList = flatMultiLevelRoutes(routeList);
          routes = [...routeList];
          break;

        case PermissionModeEnum.ROLE:
          // 初筛子节点是否符合要求
          routes = filter(asyncRoutes, routeFilter);
          // 筛选根节点是否符合要求
          routes = asyncRoutes.filter(routeFilter);
          routes = flatMultiLevelRoutes(routes);
          break;
        
        case PermissionModeEnum.ROUTE_MAPPING:
          routes = filter(asyncRoutes, routeFilter);
          routes = routes.filter(routeFilter);
          
          // 将路由信息转化为菜单信息
          const menuList = transformRouteToMenu(routes, true);
          routes = filter(routes, routeRemoveIgnoreFilter);
          routes = routes.filter(routeRemoveIgnoreFilter);

          this.setFrontMenuList(menuList);
          // Convert multi-level routing to level 2 routing
          routes = flatMultiLevelRoutes(routes);
          break;
      }
      return routes;
    }
  }
});

// Need to be used outside the setup
// ? 这是干嘛的？？？？？？？？？？？
export function usePermissionStoreWithOut(store) {
  return usePermissionStore(store);
}

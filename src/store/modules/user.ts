import { LoginParams, UserInfoModel } from 'src/api/system/model/userModel';
// import { PAGE_NOT_FOUND_ROUTE } from 'src/router/routes/basic';
import { defineStore } from "pinia";
import { RouteRecordRaw } from 'vue-router';
import { RoleEnum } from 'src/enums/roleEnum';
import { PageEnum } from 'src/enums/pageEnum';
import { UserInfo } from 'types/store';
import { loginApi, getUserInfo } from 'src/api/system/user.api';
import { isArray } from 'src/core/utils/is';
import { usePermissionStore } from 'src/store/modules/permission';
import { router } from 'src/router';

interface UserState {
  userInfo: Nullable<UserInfo>;
  token?: string;
  roleList: RoleEnum[];
  sessionTimeout?: boolean;
  lastUpdateTime: number;
  isLogin: boolean
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    // 用户信息
    userInfo: null,
    // token
    token: undefined,
    // 角色列表
    roleList: [],
    // 是否登录过期
    sessionTimeout: false,
    // 最新更新时间
    lastUpdateTime: 0,
    // 是否已登录
    isLogin: false
  }),
  getters: {
    getUserInfo(): UserInfo {
      return this.userInfo;
    },
    getToken(): string | undefined {
      return this.token;
    },
    getRoleList(): RoleEnum[] {
      return this.roleList;
    },
    getSessionTimeout(): boolean {
      return !!this.sessionTimeout;
    },
    getLastUpdateTime(): number {
      return this.lastUpdateTime;
    },
    getIsLogin(): boolean {
      return this.isLogin;
    }
  },
  actions: {
    setUserInfo(info: UserInfo) {
      this.userInfo = info;
    },
    setToken(token: string | undefined) {
      this.token = token;
    },
    setRoleList(roleList: RoleEnum[]) {
      this.roleList = roleList;
    },
    setSessionTimeout(flag: boolean) {
      this.sessionTimeout = flag;
    },
    // ! 可pull request
    setLastUpdateTime() {
      this.lastUpdateTime = new Date().getTime();
    },
    setIsLogin(flag: boolean) {
      this.isLogin = flag;
    },
    resetState() {
      this.userInfo = null;
      this.token = '';
      this.roleList = [];
      this.sessionTimeout = false;
      this.isLogin = false;
    },
    // * 用户登录
    async login(params: LoginParams & {
      goHome?: boolean
    }): Promise<UserInfoModel | null> {
      try {
        const { goHome = true, ...loginParams } = params;
        const data = await loginApi(loginParams);
        this.setIsLogin(true);
        const { token } = data;
        // 保存token，在请求拦截器中加入
        this.setToken(token);

        // 登录请求之后，处理用户信息和路由信息
        return this.afterLoginAction(goHome);
      } catch(error) {
        return Promise.reject(error);
      }
    },
    async afterLoginAction(goHome: boolean): Promise<UserInfoModel | null> {
      if (!this.getToken) return null;
      // get user info
      const userInfo = await this.getUserInfoAction();

      const sessionTimeout = this.sessionTimeout;
      if (sessionTimeout) {
        this.setSessionTimeout(false);
      } else {
        // 获取菜单
        const permissionStore = usePermissionStore();
        if (!permissionStore.isDynamicAddedRoute) {
          // 动态获取后端菜单信息
          const routes = await permissionStore.buildRoutesAction();
          routes.forEach((route) => {
            router.addRoute(route as unknown as RouteRecordRaw);
          });
          // router.addRoute(PAGE_NOT_FOUND_ROUTE as unknown as RouteRecordRaw);
          permissionStore.setDynamicAddedRoute(true);
        }
        goHome && (await router.replace(userInfo?.homePath || PageEnum.BASE_HOME));
      }

      return userInfo;
    },
    async getUserInfoAction(): Promise<UserInfo | null> {
      if (!this.getToken) return null;
      const userInfo = await getUserInfo();
      const { roles = [] } = userInfo;

      // 设置角色信息
      if (isArray(roles)) {
        const roleList = roles.map((item) => item.value) as RoleEnum[];
        this.setRoleList(roleList);
      } else {
        userInfo.roles = [];
        this.setRoleList([]);
      }

      // 设置用户信息
      this.setUserInfo(userInfo);
      return userInfo;
    },
    // 用户注销
    
  }
});
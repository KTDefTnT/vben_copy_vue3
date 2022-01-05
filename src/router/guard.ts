import type { Router } from 'vue-router';

// Don't change the order of creation
export function setupRouterGuard(router: Router) {
  // createPageGuard(router);
  // createPageLoadingGuard(router);
  // createHttpGuard(router);
  // createScrollGuard(router);
  // createMessageGuard(router);
  // createProgressGuard(router);
  createPermissionGuard(router);
  // createParamMenuGuard(router); // must after createPermissionGuard (menu has been built.)
  // createStateGuard(router);
}

function createPermissionGuard(router: Router) {
  // 路由权限校验
  router.beforeEach(async (to, from, next) => {
    console.log(to,from);
    // 可根据实际情况，进行权限校验  根据登录状态、存入store中的数据等
    next();
  });
}
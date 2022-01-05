import { createApp } from 'vue'
import App from './App.vue'
import { router, setupRouter } from 'src/router';
import { setupRouterGuard } from 'src/router/guard';

// 创建store
import { setupStore } from 'src/store';

function bootStrap() {
  const app = createApp(App);

  // 初始化store  
  // ! 需要放在router之前，router中的权限控制、menu等都依赖store
  setupStore(app);

  // Configure routing 初始化路由
  setupRouter(app);

  // router权限控制
  setupRouterGuard(router);
  
  app.mount('#app')
}

bootStrap();

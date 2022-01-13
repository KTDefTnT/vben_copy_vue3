<template>
  <ConfigProvider>
    <RouterView />
    <button @click="handleLogin">登录</button>
  </ConfigProvider>
</template>

<script setup lang="ts">
// import { toRaw } from 'vue';
import { ConfigProvider } from 'ant-design-vue';
import { useUserStore } from "src/store/modules/user";
// import { usePermissionStore } from "src/store/modules/permission";

async function handleLogin() {
  const userStore = useUserStore();
  // const permissionStore = usePermissionStore();
  const userInfo = await userStore.login({ username: '糖糖', password: '123456' });
  // console.log(toRaw(permissionStore.getBackMenuList[0]?.children));
  console.log('userInfo', userInfo);
  
}
</script>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>

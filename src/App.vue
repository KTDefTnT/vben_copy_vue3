<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <router-view></router-view>
  <!-- app -->
  <button @click="handleLogin">登录</button>
</template>

<script setup lang="ts">
import { toRaw } from 'vue';
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import { onMounted } from "@vue/runtime-core";
import { useUserStore } from "src/store/modules/user";
import { usePermissionStore } from "src/store/modules/permission";
// import { http } from './core/http/index';

onMounted(() => {
  // console.log(import.meta.glob('/src/views/**/*.{vue,tsx}'));
  // http.get({ url: "/api/orderList" }).then((res) => {
  //   console.log(res);
  // });
 
});

async function handleLogin() {
  const userStore = useUserStore();
  const permissionStore = usePermissionStore();
  const userInfo = await userStore.login({ username: '糖糖', password: '123456' });
  console.log(toRaw(permissionStore.getBackMenuList[0]?.children), permissionStore.getPermCodeList);
  console.log('userInfo', userInfo);
  
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

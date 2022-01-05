<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <router-view></router-view>
  <!-- app -->
  <HelloWorld msg="Hello Vue 3 + TypeScript + Vite" />
</template>

<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import { onMounted } from "@vue/runtime-core";
import HelloWorld from "./components/HelloWorld.vue";
import { http } from './core/http/index';

onMounted(() => {
  http.get({ url: "/api/orderList" }).then((res) => {
    console.log(res);
  });
});
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

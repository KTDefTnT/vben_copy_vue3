<template>
  <div class="flex">
    <div class="menu">content</div>
    <RouterView></RouterView>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'LayoutContent',
});
</script>

<style scoped>
.flex {
  display: flex;
  flex-direction: row;
  
}
.menu {
  width: 200px;
}
</style>
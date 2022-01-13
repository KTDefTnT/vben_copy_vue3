<template>
  <BasicMenu 
    :isHorizontal="isHorizontal"
    :menus="menus"
  />
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import BasicMenu from 'src/components/Menu';
import { Menu } from 'src/router/types';
// import { getAsyncMenus } from 'src/router/menus';
import { usePermissionStore } from "src/store/modules/permission";

export default defineComponent({
  name: 'LayoutMenu',
  components: {
    BasicMenu
  },
  setup(){
    console.log('LayoutMenu');
    const isHorizontal = ref(true);
    const menus = ref<Menu[]>([]);
    const permissionStore = usePermissionStore();
    watch(() => permissionStore.backMenuList, () => {
      console.log(permissionStore.backMenuList);
      menus.value = permissionStore.backMenuList;
      console.log('menu', menus);
    })
    // menus = toRefs(computed(() => permissionStore.backMenuList));
    return {
      isHorizontal,
      menus
    }
  }
})
</script>

<style scoped>

</style>
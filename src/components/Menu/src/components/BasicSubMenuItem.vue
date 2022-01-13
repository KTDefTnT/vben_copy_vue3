<template>
  <SubMenu>
    <template #title>
      <MenuItemContent v-bind="$props" :item="item" /> 
    </template>

    <!-- 子节点 -->
    <template v-for="childrenItem in item.children || []" :key="childrenItem.path">
      <BasicSubMenuItem v-bind="$props" :item="childrenItem" />  
    </template>
  </SubMenu>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Menu } from 'ant-design-vue';
import MenuItemContent from './MenuItemContent.vue';
import { itemProps } from '../props';

export default defineComponent({
  name: 'BasicSubMenuItem',
  components: {
    SubMenu: Menu.SubMenu,
    MenuItemContent
  },
  props: itemProps,
  setup () {
    return {}
  }
})
</script>

<style scoped>

</style>
<template>
  <Sider>
    LayoutSiderBar
    <LayoutMenu>
      哈哈哈红红火火恍恍惚惚
    </LayoutMenu>
  </Sider>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Layout } from 'ant-design-vue';
import LayoutMenu from '../menu/index.vue';

export default defineComponent({
  name: 'LayoutSiderBar',
  components: {
    Sider: Layout.Sider,
    LayoutMenu
  }
});
</script>

<style scoped>

</style>
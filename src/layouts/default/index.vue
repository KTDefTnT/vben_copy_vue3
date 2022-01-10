<template>
  <Layout>
    <LayoutSideBar />
    <Layout>
      <LayoutHeader />
      <LayoutContent />
      <LayoutFooter />
    </Layout>
  </Layout>
</template>

<script lang="ts">
import { Layout } from 'ant-design-vue';
import LayoutSideBar from './sider/index.vue';
import LayoutHeader from './header/index.vue';
import LayoutContent from './content/index.vue';
import LayoutFooter from './footer/index.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  components: {
    LayoutSideBar,
    LayoutHeader,
    LayoutContent,
    LayoutFooter,
    Layout
  }
});

</script>

<style scoped></style>

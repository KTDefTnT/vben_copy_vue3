<template>
  <div>
    <LayoutHeader />
    <LayoutContent />
  </div>
</template>

<script lang="ts">
import LayoutHeader from './header/index.vue';
import LayoutContent from './content/index.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  components: {
    LayoutHeader,
    LayoutContent
  }
});

</script>

<style scoped></style>

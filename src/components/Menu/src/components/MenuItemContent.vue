<template>
  <span>
    <SmileTwoTone />{{ menuName }}
  </span>
</template>

<script lang="ts">
import { SmileTwoTone } from '@ant-design/icons-vue'
import { defineComponent, computed } from "vue";
import { itemProps } from '../props';

export default defineComponent({
  name: "MenuItemContent",
  components: {
    SmileTwoTone
  },
  props: itemProps,
  setup(props) {
    const menuName = computed(() => props.item?.name);
    return {
      menuName
    };
  },
});
</script>

<style scoped></style>

<template>
  <div>
    <div class="title">{{ title }}</div>
    测试了哦  这是一个工作台
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'

export default defineComponent({
  name: 'workbench',
  setup() {
    const state = reactive({
      title: 'workbench'
    });


    return {
      ...toRefs(state)
    }
  },
})
</script>

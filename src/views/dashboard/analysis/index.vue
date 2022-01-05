<template>
  <div>
    <div class="title">{{ title }}</div>
    测试了哦  这是一个分析列表
    <router-view></router-view>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'

export default defineComponent({
  name: 'workbench',
  setup() {
    const state = reactive({
      title: 'analysis'
    });


    return {
      ...toRefs(state)
    }
  },
})
</script>

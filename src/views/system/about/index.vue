<template>
  <div>
    <div class="title">{{ title }}</div>
    测试了哦  这是一个About界面
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'

export default defineComponent({
  name: 'workbench',
  setup() {
    const state = reactive({
      title: 'About'
    });


    return {
      ...toRefs(state)
    }
  },
})
</script>

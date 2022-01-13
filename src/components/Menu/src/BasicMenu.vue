<template>
  <Menu
    :selectedKeys="selectedKeys"
    :defaultSelectedKeys="defaultSelectedKeys"
    :mode="mode"
    :inlineIndent="inlineIndent"
    :openKeys="openKeys"
    :subMenuOpenDelay="0.2"
    :theme="theme"
    v-bind="getInlineCollapseOptions"
    @openChange="handleOpenChange"
    @click="handleMenuClick"
  >
    <template v-for="item in items" :key="item.path">
      <BasicSubMenuItem :item="item" :theme="theme" :isHorizontal="isHorizontal" />
    </template>
  </Menu>
</template>

<script lang="ts">
import type { MenuState } from './types';
import { basicProps } from './props';
import { defineComponent, reactive, toRefs, ref, unref, computed, watch } from 'vue'
import { Menu } from 'ant-design-vue';
import BasicSubMenuItem from './components/BasicSubMenuItem.vue';
import { isFunction } from 'src/core/utils/is';
import { MenuModeEnum } from 'src/enums/menuEnum';
import { RouteLocationNormalizedLoaded, useRouter } from 'vue-router';
import { getCurrentParentPath } from 'src/router/menus';
import { getAllParentPath } from 'src/router/helper/menuHelper';

export default defineComponent({
  name: 'BasicMenu',
  components: {
    Menu,
    BasicSubMenuItem,
  },
  props: basicProps,
  emits: ['menuClick'],
  setup(props, { emit }) {
    // 是否可跳转
    const isClickGo = ref(false);
    // 当前激活菜单
    const currentActiveMenu = ref('');
    // 创建初始数据
    const menuState = reactive<MenuState>({
      defaultSelectedKeys: [],
      openKeys: [],
      selectedKeys: [],
      collapsedOpenKeys: [],
    });
    // 当前路由
    const { currentRoute } = useRouter();

    // 传入的参数
    // const { items, mode } = toRefs(props);

    // 获取是否inline
    const getInlineCollapseOptions = computed(() => {
      const isInline = props.mode === MenuModeEnum.INLINE;
      const inlineCollapseOptions: { collapsed?: boolean } = {};
        if (isInline) {
          inlineCollapseOptions.collapsed = true;
        }
        return inlineCollapseOptions;

    });

    // 点击事件
    async function handleMenuClick({ key }: { key: string; keyPath: string[] }) {
      const { beforeClickFn } = props;
      if (beforeClickFn && isFunction(beforeClickFn)) {
        const flag = await beforeClickFn(key);
        if (!flag) return;
      }
      emit('menuClick', key);

      isClickGo.value = true;
      menuState.selectedKeys = [key];
    }

    // 打开事件
    function handleOpenChange(openkeys: string[]) {
      menuState.openKeys = openkeys;
    }

    watch(
      () => props.items,
      () => {
        console.log('props', props);
        handleMenuChange();
      },
    );

    // 路由变化，调整当前的路由信息
    async function handleMenuChange(route?: RouteLocationNormalizedLoaded) {
      // 如果当前路由不可跳转则不调整
      if (unref(isClickGo)) {
        isClickGo.value = false;
        return;
      }

      // 获取当前路由的path
      const path =
        (route || unref(currentRoute)).meta?.currentActiveMenu ||
        (route || unref(currentRoute)).path;

      if (unref(currentActiveMenu)) return;

      if (props.isHorizontal) {
        const parentPath = await getCurrentParentPath(path as string);
        menuState.selectedKeys = [parentPath];
      } else {
        const parentPaths = await getAllParentPath(props.items, path as string);
        menuState.selectedKeys = parentPaths;
      }
    }

    return {
      getInlineCollapseOptions,
      handleMenuClick,
      handleOpenChange,
      ...toRefs(menuState)
    }
  }
})
</script>

<style scoped>

</style>
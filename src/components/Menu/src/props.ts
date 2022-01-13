import type { Menu } from 'src/router/types';
import type { MenuTheme } from 'ant-design-vue';
import type { PropType } from 'vue';
import { propTypes } from 'src/core/utils/propTypes';

import { MenuModeEnum } from 'src/enums/menuEnum';
import { ThemeEnum } from 'src/enums/appEnum';
import type { MenuMode } from 'ant-design-vue/lib/menu/src/interface';

// 外部导入的props信息
export const basicProps = {
  items: {
    type: Array as PropType<Menu[]>,
    default: () => []
  },
  // 菜单组件的mode属性
  mode: {
    type: String as PropType<MenuMode>,
    default: MenuModeEnum.INLINE,
  },
  beforeClickFn: {
    type: Function as PropType<(key: string) => Promise<boolean>>,
  },
  isHorizontal: propTypes.bool,
  theme: {
    type: String as PropType<MenuTheme>,
    default: ThemeEnum.DARK,
  },
  // 最好是4 倍数
  inlineIndent: propTypes.number.def(20)
};

// basicMenuItem
export const itemProps = {
  item: {
    type: Object as PropType<Menu>,
    default: {},
  },
  level: propTypes.number,
  theme: propTypes.oneOf(['dark', 'light']),
  showTitle: propTypes.bool,
  isHorizontal: propTypes.bool,
};
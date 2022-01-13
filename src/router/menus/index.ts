import { usePermissionStore } from 'src/store/modules/permission';
import { PermissionModeEnum } from 'src/enums/appEnum';
import { getAllParentPath } from '../helper/menuHelper';
import { Menu } from '../types';
let PermissionMode = PermissionModeEnum.BACK;

function isBackMode() {
  return PermissionMode === PermissionModeEnum.BACK;
}

function isRouteMappingMode() {
  return PermissionMode === PermissionModeEnum.ROUTE_MAPPING;
}

const staticMenus: Menu[] = [];
// 获取菜单信息
export function getAsyncMenus() {
  const permissionStore = usePermissionStore();
  if (isBackMode()) {
    return permissionStore.getBackMenuList.filter((item) => !item.meta?.hideMenu && !item.hideMenu);
  }
  if (isRouteMappingMode()) {
    return permissionStore.getFrontMenuList.filter((item) => !item.hideMenu);
  }
  return staticMenus;
}

export async function getCurrentParentPath(currentPath: string) {
  const menus = await getAsyncMenus();
  const allParentPath = await getAllParentPath(menus, currentPath);
  return allParentPath?.[0];
}
import { usePermissionStore } from 'src/store/modules/permission';
import { PermissionModeEnum } from 'src/enums/appEnum';
let PermissionMode = PermissionModeEnum.BACK;

function isBackMode() {
  return PermissionMode === PermissionModeEnum.BACK;
}

function isRouteMappingMode() {
  return PermissionMode === PermissionModeEnum.ROUTE_MAPPING;
}

// 获取菜单信息
export async function getAsyncMenus() {
  const permissionStore = usePermissionStore();
  if (isBackMode()) {
    return permissionStore.getBackMenuList.filter((item) => !item.meta?.hideMenu && !item.hideMenu);
  }
  if (isRouteMappingMode()) {
    return permissionStore.getFrontMenuList.filter((item) => !item.hideMenu);
  }
  return null;
}
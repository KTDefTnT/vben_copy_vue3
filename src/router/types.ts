import type { RouteRecordRaw, RouteMeta } from 'vue-router';
import { RoleEnum } from 'src/enums/roleEnum';
import { defineComponent } from 'vue';

export type Component<T = any> =
  | ReturnType<typeof defineComponent>
  | (() => Promise<typeof import('*.vue')>)
  | (() => Promise<T>);

// Omit表示以一个类型为基础支持剔除某些属性，然后返回一个新类型
// @ts-ignore
export interface AppRouteRecordRaw extends Omit<RouteRecordRaw, 'meta'> {
  name: string;
  meta: RouteMeta;
  component?: Component | string;
  components?: Component;
  children?: AppRouteRecordRaw[];
  // props?: Record;
  fullPath?: string;
}

export interface MenuTag {
  type?: 'primary' | 'error' | 'warn' | 'success';
  content?: string;
  dot?: boolean;
}
export interface Menu {
  name: string,
  icon?: string,
  path: string,
  paramPath?: string,
  disabled?: boolean,
  children?: Menu[],
  orderNo?: number,
  roles?: RoleEnum[],
  meta?: Partial<RouteMeta>,
  tag?: MenuTag,
  hideMenu?: boolean
}

// export type AppRouteModule = RouteModule | AppRouteRecordRaw;
export type AppRouteModule = AppRouteRecordRaw;

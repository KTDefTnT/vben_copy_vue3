import { http } from 'src/core/http/index';
import { getMenuListResultModel } from './model/menuModel';

enum Api {
  GetMenuList = '/api/getMenuList',
}

/**
 * @description: Get user menu based on id
 */

export const getMenuList = () => {
  return http.get<getMenuListResultModel>({ url: Api.GetMenuList });
};
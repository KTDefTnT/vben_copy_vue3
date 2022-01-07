import { http } from 'src/core/http/index';
import { LoginParams, LoginResultModel, UserInfoModel } from './model/userModel';

enum Api {
  Login = '/api/login',
  Logout = '/api/logout',
  GetUserInfo = '/api/getUserInfo',
  GetPermCode = '/api/getPermCode',
}

// 登录
export function loginApi(params: LoginParams) {
  return http.post<LoginResultModel>({
    url: Api.Login,
    params
  });
}

// 注销登录
export function logout() {
  return http.get({ url: Api.Logout });
}

// 获取用户信息
export function getUserInfo() {
  return http.get<UserInfoModel>({ url: Api.GetUserInfo });
}

// 获取用户code
export function  getPermCode() {
  return http.get<string[]>({ url: Api.GetPermCode });
}
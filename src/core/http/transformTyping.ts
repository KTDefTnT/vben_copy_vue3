import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import type { RequestOptions, Result } from 'types/axios';

export interface CreateAxiosOptions extends AxiosRequestConfig {
  authenticationScheme?: string; //代表什么？
  transform?: AxiosTransform; // 数据处理类
  requestOptions?: RequestOptions; // 请求数据
}

/**
 * 抽象类 数据处理类
 */
export abstract class AxiosTransform {
  // ? 请求直接拦截器函数 入参为请求参数和自定义请求参数
  requestInterceptors?: (config: AxiosRequestConfig, options: CreateAxiosOptions) => AxiosRequestConfig;
  // ? 请求拦截器错误处理
  requestInterceptorsCatch?: (error: Error) => void;

  // ? 处理请求之前的options参数的 加工函数
  beforeRequestHook?: (config: AxiosRequestConfig, options: RequestOptions) => AxiosRequestConfig;
  // ? 处理请求失败的 加工函数
  requestCatchHook?: (e: Error, options: RequestOptions) => Promise<any>;

  // * 响应拦截器
  responseInterceptors?: (res: AxiosResponse<any>) => AxiosResponse<any>;
  // * 处理成功返回参数的 加工函数
  transformRequestHook?: (res: AxiosResponse<Result>, options:RequestOptions) => any;
  // * 响应拦截器错误处理
  responseInterceptorsCatch?: (error: Error) => void;
}
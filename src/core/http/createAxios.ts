import type { AxiosRequestConfig, AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import type { RequestOptions, Result } from 'types/axios';
import type { CreateAxiosOptions } from './transformTyping';
import { cloneDeep } from 'lodash-es';
import { isFunction } from '../utils/is';
import axios from 'axios';
// import qs from 'qs';

export class VAxios {
  // axios实例对象
  private axiosInstance: AxiosInstance;
  private readonly options: CreateAxiosOptions;

  // 传入的参数，创建一个axios实例 暴露出调用方法
  constructor(options: CreateAxiosOptions) {
    this.options = options;
    // 传入请求参数 创建一个axios实例
    this.axiosInstance = axios.create(options);

    // 定义定时器
    this.setupInterceptors();
  }

  /**
   * @description 获取自定义的axios数据处理对象
   */
  private getTransform() {
    const { transform } = this.options;
    return transform;
  }

  /**
   * @description 拦截器设置
   */
  private setupInterceptors() {
    // 获取axios处理函数
    const transform = this.getTransform();
    if (!transform) return;

    // * 提取拦截器相关处理方法
    const {
      requestInterceptors,
      requestInterceptorsCatch,
      responseInterceptors,
      responseInterceptorsCatch
    } = transform;

    // ? 请求拦截器默认设置
    this.axiosInstance.interceptors.request.use((config: AxiosRequestConfig) => {
      // TODO 忽略token部分未封装完毕
      // 判断拦截器请求处理函数是否存在，是否为函数
      if (requestInterceptors && isFunction(requestInterceptors)) {
        config = requestInterceptors(config, this.options);
      }
      return config;
    }, undefined);
    // ! 请求拦截器异常获取
    requestInterceptorsCatch && 
      isFunction(requestInterceptorsCatch) &&
      this.axiosInstance.interceptors.request.use(undefined, requestInterceptorsCatch);


    // ? 响应拦截器默认设置
    this.axiosInstance.interceptors.response.use((res: AxiosResponse) => {
      // 判断处理函数是否存在
      if(responseInterceptors && isFunction(responseInterceptors)) {
        res = responseInterceptors(res);
      }

      return res;
    });
    // ! 响应拦截器异常处理
    responseInterceptorsCatch &&
      isFunction(responseInterceptorsCatch) &&
      this.axiosInstance.interceptors.response.use(undefined, responseInterceptorsCatch)
  }

  /**
   * @description 请求函数封装
   * @config 默认传入 method，data等axios请求对象内容
   * @options 请求函数额外得配置 追加前缀等
   */
  request<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    let conf: CreateAxiosOptions = cloneDeep(config);
    // 获取数据处理函数 对象
    const transform = this.getTransform();

    // 获取自定义的请求参数
    const { requestOptions } = this.options;

    // 将全局自定义请求参数与指定的方法自定义参数合并
    const opt: RequestOptions = Object.assign({}, requestOptions, options);
    
    // 在请求开始之前处理请求参数
    const { beforeRequestHook, requestCatchHook, transformRequestHook } = transform || {};
    if (beforeRequestHook && isFunction(beforeRequestHook)) {
      conf = beforeRequestHook(conf, opt);
    }

    // 请求参数
    conf.requestOptions = opt;

    // 发起请求
    return new Promise((resolve, reject) => {
      // ! AxiosResponse<Result> Result表示返回数据中data的格式
      this.axiosInstance
        .request<any, AxiosResponse<Result>>(conf)
        .then((res: AxiosResponse<Result>) => {
          // ? 若存在成功处理函数 则使用成果处理函数
          if (transformRequestHook && isFunction(transformRequestHook)) {
            try {
              const ret = transformRequestHook(res, opt);
              resolve(ret);
            } catch (err) {
              reject(err || new Error('request error'));
            }
            return;
          }

          resolve(res as unknown as Promise<T>);
        })
        .catch((e: Error | AxiosError) => {
          // ? 判断是否存在请求异常处理的函数
          if (requestCatchHook && isFunction(requestCatchHook)) {
            reject(requestCatchHook(e, opt));
            return;
          }

          if (axios.isAxiosError(e)) {
            // rewrite error message from axios in here
          }
          reject(e);
        });
    });
  }

  // ! 每个请求函数
  get<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request({ ...config, method: 'GET' }, options);
  }
  post<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request({ ...config, method: 'POST' }, options);
  }
  put<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request({ ...config, method: 'PUT' }, options);
  }
  delete<T = any>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request({ ...config, method: 'DELETE' }, options);
  }
}

import { useUserStore } from './../../store/modules/user';
// import type { AxiosResponse } from "axios";
// import type { RequestOptions, Result } from "types/axios";
import type { AxiosTransform, CreateAxiosOptions } from "./transformTyping";
import { VAxios } from "./createAxios";
import { deepMerge } from "../utils";
import { ContentTypeEnum } from "../../enums/httpEnum";
import { isString } from "../utils/is";
import { ResultEnum } from '../../enums/httpEnum';

/**
 * @description 数据处理，供外部自定义处理
 */
const transform: AxiosTransform = {
  // 处理请求参数 config
  beforeRequestHook: (config, options) => {
    const { apiUrl, joinPrefix, urlPrefix } = options;
  
    if (joinPrefix) {
      config.url = `${urlPrefix}${config.url}`;
    }

    if (apiUrl && isString(apiUrl)) {
      config.url = `${apiUrl}${config.url}`;
    }

    return config;
  },

  // 请求拦截器 处理
  requestInterceptors: (config, options) => {
    const userStore = useUserStore();
    // ! 添加统一的token、统一处理 headers等 
    const token = userStore.getToken;
    if (token && (config as Recordable)?.requestOptions?.withToken !== false) {
      // jwt token
      (config as Recordable).headers.Authorization = options.authenticationScheme
        ? `${options.authenticationScheme} ${token}`
        : token;
    }
    return config;
  },

  // * 响应拦截器处理
  responseInterceptors: (res) => {
    return res;
  },

  // * 响应数据处理，可处理异常  比如网络超时，404 403等
  transformRequestHook: (res, options) => {
    const { isTransformResponse, isReturnNativeResponse } = options;
    // 是否返回原生响应头 比如：需要获取响应头时使用该属性
    if (isReturnNativeResponse) {
      return res;
    }
    // 不进行任何处理，直接返回
    // 用于页面代码可能需要直接获取code，data，message这些信息时开启
    if (!isTransformResponse) {
      return res.data;
    }

    const { data } = res;

    //  这里 code，result，message为 后台统一的字段，需要在 types.ts内修改为项目自己的接口返回格式
    const { code, result, message } = data;
    const hasSuccess = data && Reflect.has(data, 'code') && code === ResultEnum.SUCCESS;
    if (hasSuccess) {
      return result;
    }
    
    if (code !== ResultEnum.SUCCESS) {
      new Error('sys.api.apiRequestFailed');
    }

    return {
      code,
      result,
      message
    }
  }
};

function createAxios(opt?: Partial<CreateAxiosOptions>) {
  // 实例对象
  return new VAxios(
    deepMerge(
      {
        // See https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#authentication_schemes
        // authentication schemes，e.g: Bearer
        // authenticationScheme: 'Bearer',
        authenticationScheme: "",
        timeout: 10 * 1000,
        // 基础接口地址
        // baseURL: globSetting.apiUrl,

        headers: { "Content-Type": ContentTypeEnum.JSON },
        // 如果是form-data格式
        // headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
        // 数据处理方式
        transform,
        // 配置项，下面的选项都可以在独立的接口请求中覆盖
        requestOptions: {
          // 默认将prefix 添加到url
          joinPrefix: false,
          // 是否返回原生响应头 比如：需要获取响应头时使用该属性
          isReturnNativeResponse: false,
          // 需要对返回数据进行处理
          isTransformResponse: true,
          // post请求的时候添加参数到url
          joinParamsToUrl: false,
          // 格式化提交参数时间
          formatDate: true,
          // 消息提示类型
          errorMessageMode: "message",
          // 接口地址
          apiUrl: '',
          // 接口拼接地址
          urlPrefix: '',
          //  是否加入时间戳
          joinTime: true,
          // 忽略重复请求
          ignoreCancelToken: true,
          // 是否携带token
          withToken: true,
        },
      },
      opt || {}
    )
  );
}

export const http = createAxios();

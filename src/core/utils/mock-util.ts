import { MsgTypeEnum } from "../../enums/httpEnum";

// 返回成功
export function resultSuccess<T>(result: T, { message = 'ok' } = {}) {
  return {
    code: 0,
    result,
    message,
    type: MsgTypeEnum.SUCCESS
  };
}

// 请求失败
export function resultError(message = 'Request failed',  { code = -1, result = null } = {}) {
  return {
    code,
    result,
    message,
    type: MsgTypeEnum.ERROR
  };
}


export interface requestParams {
  method: string;
  body: any;
  headers?: { authorization?: string };
  query: any;
}

/**
 * @description 本函数用于从request数据中获取token，请根据项目的实际情况修改
 *
 */
 export function getRequestToken({ headers }: requestParams): string | undefined {
  return headers?.authorization;
}
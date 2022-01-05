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


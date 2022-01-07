import { resultError, resultSuccess, getRequestToken, requestParams } from 'src/core/utils/mock-util';

export function createFakeUserList() {
  return [
    {
      userId: '1',
      username: '瓜子',
      realName: '焦糖瓜子',
      avatar: 'https://q1.qlogo.cn/g?b=qq&nk=190848757&s=640',
      desc: 'manager',
      password: '123456',
      token: 'fakeToken1',
      homePath: '/dashboard/analysis',
      roles: [
        {
          roleName: 'Super Admin',
          value: 'super',
        },
      ],
    },
    {
      userId: '2',
      username: '糖糖',
      realName: '焦糖瓜子',
      avatar: 'https://q1.qlogo.cn/g?b=qq&nk=190848757&s=640',
      desc: 'tester',
      password: '123456',
      token: 'fakeToken2',
      homePath: '/dashboard/workbench',
      roles: [
        {
          roleName: 'Tester',
          value: 'test',
        },
      ],
    },
  ];
}

const fakeCodeList: any = {
  '1': ['1000', '3000', '5000'],

  '2': ['2000', '4000', '6000'],
};

export default [
  {
    url: "/api/login",
    method: "post",
    response: (request: requestParams) => {
      // console.log('request', request);
      const { username, password } = request.query;
      console.log(username, password);
      const checkUser = createFakeUserList().find(
        (item) => item.username === username && password === item.password,
      );

      if (!checkUser) {
        return resultError('Incorrect account or password！');
      }

      // 登录成功
      const { userId, username: _username, token, realName, desc, roles } = checkUser;
      // 返回用户信息
      return resultSuccess({
        roles,
        userId,
        username: _username,
        token,
        realName,
        desc,
      });
    },
  },
  {
    // 获取用户信息
    url: '/api/getUserInfo',
    method: 'get',
    response: (request: requestParams) => {
      const token = getRequestToken(request);
      if (!token) return resultError('token 缺失');
      const checkUser = createFakeUserList().find(item => item.token === token);
      if (!checkUser) {
        return resultError('未获得相应的用户信息');
      }
      return resultSuccess(checkUser);
    }
  },
  {
    // 获取获取用户的code
    url: '/api/getPermCode',
    timeout: 200,
    method: 'get',
    response: (request: requestParams) => {
      const token = getRequestToken(request);
      if (!token) return resultError('token 缺失');
      const checkUser = createFakeUserList().find(item => item.token === token);
      if (!checkUser) {
        return resultError('无效token');
      }
      const codeList = fakeCodeList[checkUser.userId];
      return resultSuccess(codeList);
    }
  },
  {
    url: '/api/logout',
    timeout: 200,
    method: 'get',
    response: (request: requestParams) => {
      const token = getRequestToken(request);
      if (!token) return resultError('token 缺失');
      const checkUser = createFakeUserList().find(item => item.token === token);
      if (!checkUser) {
        return resultError('无效token');
      }

      return resultSuccess(undefined, { message: '退出成功！' });
    }
  }
];
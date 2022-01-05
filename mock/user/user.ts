import { resultError, resultSuccess } from '../../src/core/utils/mock-util';

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

export default [
  // ? 用户登录
  {
    url: "/api/login",
    method: "post",
    response: ({ body }) => {
      const { username, password } = body;
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
];
import { createProdMockServer } from 'vite-plugin-mock/es/createProdMockServer'
// import testModule from './order/order';

// ! 如果mockProdServer.ts位置不在src内，import.meta将会报错
// todo 处理import.meta的报错问题
const modules = import.meta.globEager('../mock/**/*.ts')
const mockModules: any[] = [];
Object.keys(modules).forEach((key) => {
  if (key.includes('/_')) {
    return;
  }

  mockModules.push(...modules[key].default);
});

export function setupProdMockServer() {
  createProdMockServer([...mockModules])
}
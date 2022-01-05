import { MockMethod } from 'vite-plugin-mock'
import { OrderState } from '@/@types/order';

const OrderList: OrderState[] = [
  {
    orderId: '342937324834',
    name: '焦糖瓜子',
    userId: '001',
    vaccineName: '脊灰(灭活sabin株)',
    type: '免规疫苗',
    deadLine: 2,
    month: '03',
    day: '16',
    startTime: '15:30',
    endTime: '16:00',
    organ: '健康服务中心',
    address: '南山区白石洲社康中心(沙河街道)',
  },
  {
    orderId: '2245667785566',
    name: '李萌萌',
    userId: '002',
    vaccineName: '乙肝(灭活sabin株)',
    type: '免规疫苗',
    deadLine: 6,
    month: '11',
    day: '20',
    startTime: '10:30',
    endTime: '11:00',
    organ: '健康服务中心',
    address: '南山区白石洲社康中心(沙河街道)',
  },
];

export default [
  {
    url: '/api/orderList',
    method: 'get',
    response: () => {
      return {
        status: 1,
        data: OrderList
      }
    }
  }
] as MockMethod[];
  
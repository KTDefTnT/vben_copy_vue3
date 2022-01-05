import { OrderState } from '../@types/order';
import { http } from '../core/http';

// 获取当前预约列表信息
export async function getOrderList(): Promise<any> {
  return http.get<OrderState>({
    url: '/api/orderList'
  });
}

// 根据orderId获取当前的预约信息
export async function getOrderDetailById(orderId: string): Promise<any> {
  return http.post({
    url: '/getDetailByOrderId',
    data: { orderId },
  });
}
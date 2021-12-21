import { requestWithToken } from "@/utils/request";
/**
 * 生成订单
 * @return {AxiosPromise}
 */
export function createOrder() {
  return requestWithToken("/member/order/pre", "get");
}

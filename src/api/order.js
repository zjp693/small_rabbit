import { requestWithToken } from "@/utils/request";
/**
 * 生成订单
 * @return {AxiosPromise}
 */
export function createOrder() {
  return requestWithToken("/member/order/pre", "get");
}
/**
 * 添加收货地址
 * @param address 收货地址信息对象
 * @return {AxiosPromise}
 */
export function addAddress(address) {
  return requestWithToken("/member/address", "post", address);
}
/**
 * 获取收货地址列表
 * @return {AxiosPromise}
 */
export function getAddressList() {
  return requestWithToken("/member/address", "get");
}

/**
 * 修改收货地址
 * @param id 收货地址id
 * @param address 新的收货地址
 * @return {AxiosPromise}
 */
export function updateAddressById(address) {
  return requestWithToken(`/member/address/${address.id}`, "put", address);
}

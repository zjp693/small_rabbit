import { requestWithToken } from "@/utils/request";

/**
 * 获取我的收藏
 * @param collectType 收藏类型，1为商品，2为专题，3为品牌
 * @param page 页码
 * @param pageSize 每页显示数据条数
 * @return {AxiosPromise}
 */
export function getCollection({ collectType = 1, page = 1, pageSize = 10 }) {
  return requestWithToken("/member/collect", "get", {
    collectType,
    page,
    pageSize,
  });
}

/**
 *
 * @param page
 * @param pageSize
 * @returns {AxiosPromise}
 */
export function getBrowseHistory({ page = 1, pageSize = 10 }) {
  return requestWithToken("/member/browseHistory", "get", {
    page,
    pageSize,
  });
}
/**
 * 获取订单列表
 * @param page 页码
 * @param pageSize 每页显示多少数据
 * @param orderState 订单状态 0为全部 1为待付款、2为待发货、3为待收货、4为待评价、5为已完成、6为已取
 * @return {AxiosPromise}
 */
export function getOrderList({ page, pageSize, orderState }) {
  return requestWithToken("/member/order", "get", {
    page,
    pageSize,
    orderState,
  });
}

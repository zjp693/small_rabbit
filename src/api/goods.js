import { requestWithOutToken } from "@/utils/request";

/**
 *
 * @param id
 * @returns {Promise}
 */
export function getGoodsDetail(id) {
  return requestWithOutToken("/goods", "get", { id });
}

/**
 *获取相关商品、猜你喜欢
 * @param id 商品id - 如果传了id参数表示获取相关商品数据, 如果没有传id参数表示获取猜你喜欢数据
 * @param limit  数据多少条
 * @returns {Promise}
 */
export function getRelevantGoods(id, limit = 16) {
  return requestWithOutToken("/goods/relevant", "get", { id, limit });
}

/**
 *热销商品
 * @param id
 * @param limit
 * @param type
 */
export function getHotGoods(id, limit = 3, type = 1) {
  return requestWithOutToken("/goods/hot", "get", { id, limit, type });
}

/**
 *获取商品评价头部数据
 * @param id 商品id
 * @returns {AxiosPromise}
 */
export function getCommentInfo(id) {
  return requestWithOutToken(
    `https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate`,
    "get"
  );
}

/**
 * 获取评论列表数据
 * @param id 商品id
 * @param params  其他的查询参数
 * @returns {AxiosPromise}
 */
export function getCommentList(id, params) {
  return requestWithOutToken(
    `https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate/page`,
    "get",
    params
  );
}

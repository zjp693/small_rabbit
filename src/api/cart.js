import { requestWithOutToken, requestWithToken } from "@/utils/request";
/**
 * 更新购物车中的商品信息 (库存, 是否有效, 现价)
 * @param skuId
 * @param id
 * @return {AxiosPromise}
 */
export function updateLocalCart({ skuId, id }) {
  return requestWithOutToken(`/goods/stock/${skuId}`, "get", { id });
}

/**
 * 根据skuId获取规格信息 (供用户选择的规格选项数据、所有可组合的规格组合)
 * @param skuId
 * @return {AxiosPromise}
 */
export function getSkuInfoBySkuId(skuId) {
  return requestWithOutToken(`/goods/sku/${skuId}`, "get");
}
/**
 * 将本地购物车和服务器端购物车进行合并
 * @param cart {Array<{skuId: string, selected: boolean, count: number}>}
 * @return {Promise}
 */
export function mergeCart(cart) {
  return requestWithOutToken("/member/cart/merge", "post", cart);
}

/**
 * 获取服务器端购物车列表数据
 * @return {AxiosPromise}
 */
export function getCartList() {
  return requestWithToken("/member/cart", "get");
}

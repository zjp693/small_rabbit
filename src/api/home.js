import { requestWithOutToken } from "@/utils/request";

/**
 *获取分类列表数据
 */
export function getCategoriesApi() {
  return requestWithOutToken("/home/category/head", "get");
}

/**
 *获取热门软件
 * @param limit 请求多少条数据
 * @returns {*}
 */
export function getHotBrands(limit = 6) {
  return requestWithOutToken("/home/brand", "get", { limit });
}

/**
 *  获取轮播图数据
 * @param distributionSite
 * @returns {AxiosPromise}
 */
export function getBanners(distributionSite) {
  return requestWithOutToken("/home/banner", "get", { distributionSite });
}

/**
 * 获取新鲜好物
 * @param limit  获取的数据条数
 * @returns {AxiosPromise}
 */
export function getNewGoods(limit = 4) {
  return requestWithOutToken("/home/new", "get", { limit });
}

/**
 * 获取人气推荐
 * @returns {AxiosPromise}
 */
export function getHomeHot() {
  return requestWithOutToken("/home/hot", "get");
}

/**
 * 获取产品区块数据
 * @returns {AxiosPromise}
 */
export function getProducts() {
  return requestWithOutToken("/home/goods", "get");
}

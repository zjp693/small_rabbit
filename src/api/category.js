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
export function getHotBrands(limit = 10) {
  return requestWithOutToken("/home/brand", "get", { limit });
}

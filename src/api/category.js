import { requestWithOutToken } from "@/utils/request";

/**
 * 根据一级分类id获取分类下的具体信息
 * @param id 一级分类ID
 * @returns {AxiosPromise}
 */
export function getTopCategoryById(id) {
  return requestWithOutToken("/category", "get", { id });
}

/**
 *根据二级分类ID获取分类条件
 * @param id
 * @returns {AxiosPromise}
 */
export function getSubCategoryById(id) {
  return requestWithOutToken("/category/sub/filter", "get", { id });
}

/**
 *获取商品列表
 * @param reqParams 分类id、筛选条件、排序条件、分页信息
 * @returns {AxiosPromise}
 */
export function getGoodsList(reqParams) {
  return requestWithOutToken("/category/goods", "post", reqParams);
}

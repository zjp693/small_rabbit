import { requestWithOutToken } from "@/utils/request";

/**
 * 根据一级分类id获取分类下的具体信息
 * @param id 一级分类ID
 * @returns {AxiosPromise}
 */
export function getTopCategoryById(id) {
  return requestWithOutToken("/category", "get", { id });
}

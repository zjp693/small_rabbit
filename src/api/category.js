import { requestWithOutToken } from "@/utils/request";

/**
 *获取分类列表数据
 */
export function getCategoriesApi() {
  return requestWithOutToken("/home/category/head", "get");
}

import { requestWithOutToken } from "@/utils/request";

export function getGoodsDetail(id) {
  return requestWithOutToken("/goods", "get", { id });
}

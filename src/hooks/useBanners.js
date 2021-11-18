import { ref } from "vue";
import { getBanners } from "@/api/home";

export function useBanners() {
  //
  const banners = ref();
  const getData = (distributionSite) => {
    getBanners(distributionSite).then((data) => {
      // console.log(data);
      banners.value = data.result;
    });
  };
  return { banners, getData };
}

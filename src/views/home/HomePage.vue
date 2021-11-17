<template>
  <AppLayout>
    <div class="container">
      <!--      头部-->
      <HomeCategory></HomeCategory>
      <!--      轮播图-->
      <HomeBanner></HomeBanner>
      <!--      新鲜好物-->
      <HomeNew></HomeNew>
      <!--      人气推荐-->
      <HomeHot></HomeHot>
      <!--      热门品牌-->
      <HomeBrand></HomeBrand>
      <!--      产品区块-->
      <HomeProduct></HomeProduct>
    </div>
  </AppLayout>
</template>

<script>
import AppLayout from "@/components/AppLayout";
import HomeCategory from "@/views/home/components/HomeCategory";
import HomeBanner from "@/views/home/components/HomeBanner";
import HomeNew from "@/views/home/components/HomeNew";
import HomeHot from "@/views/home/components/HomeHot";
import HomeBrand from "@/views/home/components/HomeBrand";
import HomeProduct from "@/views/home/components/HomeProduct";
export default {
  name: "Home",
  components: {
    AppLayout,
    HomeCategory,
    HomeBanner,
    HomeNew,
    HomeHot,
    HomeBrand,
    HomeProduct,
  },
};
</script>

<style></style>

<template>
  <AppLayout>
    <div class="container">
      <XtxBread>
        <XtxBreadItem path="/"> 首页</XtxBreadItem>
        <Transition name="fade-right" mode="out-in">
          <XtxBreadItem :key="`/category/${topCategory?.id}`">
            {{ topCategory?.name }}</XtxBreadItem
          >
        </Transition>
        <XtxBreadItem :carousels="banners"></XtxBreadItem>
      </XtxBread>
      <!-- 调用轮播图组件 -->
      <XtxCarousel
        :carousels="banners"
        :style="{
          height: '500px',
        }"
      />
      <!--    全部二级分类-->

      <ShowSubCategoryList
        :subCategories="topCategory.children"
        v-if="topCategory"
      ></ShowSubCategoryList>
      <!-- 二级分类商品推荐    -->
      <RecommendGoods></RecommendGoods>
    </div>
  </AppLayout>
</template>
<script>
import AppLayout from "@/components/AppLayout";
import XtxBread from "@/components/library/XtxBread";
import XtxBreadItem from "@/components/library/XtxBreadItem";
import XtxCarousel from "@/components/library/XtxCarousel";
import ShowSubCategoryList from "@/views/category/components/ShowSubCategoryList";
import RecommendGoods from "@/views/category/components/RecommendGoods";

import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { computed } from "vue";
import { useBanners } from "@/hooks/useBanners";
export default {
  name: "CategoryPage",
  components: {
    AppLayout,
    XtxBread,
    XtxBreadItem,
    XtxCarousel,
    ShowSubCategoryList,
    RecommendGoods,
  },
  setup() {
    const topCategory = useCategory();
    const { banners, getData } = useBanners();
    getData(2);

    return { topCategory, banners };
  },
};
function useCategory() {
  // 获取 store 对象
  const store = useStore();
  // 获取 route 对象
  const route = useRoute();
  return computed(() => {
    // 根据id查找一级分类数据
    // id 从路由参数中获取
    return store.state.category.list.find(
      (item) => item.id === route.params.id
    );
  });
}
</script>

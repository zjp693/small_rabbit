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
    </div>
  </AppLayout>
</template>
<script>
import AppLayout from "@/components/AppLayout";
import XtxBread from "@/components/library/XtxBread";
import XtxBreadItem from "@/components/library/XtxBreadItem";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { computed } from "vue";
import { useBanners } from "@/hooks/useBanners";
// import category from "@/store/category";
export default {
  name: "CategoryPage",
  components: { AppLayout, XtxBread, XtxBreadItem },
  setup() {
    const topCategory = useCategory();

    const { banners, getData } = useBanners();
    getData(2);
    setTimeout(() => {
      // console.log(topCategory);
    }, 2000);
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

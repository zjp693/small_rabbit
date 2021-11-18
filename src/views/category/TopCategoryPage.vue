<template>
  <AppLayout>
    <div class="container">
      <XtxBread>
        <XtxBreadItem path="/"> 首页</XtxBreadItem>
        <XtxBreadItem :key="`/category/${topCategory?.id}`">
          {{ topCategory?.name }}</XtxBreadItem
        >
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
      console.log(topCategory);
    }, 2000);
    return { topCategory, banners };
  },
};
function useCategory() {
  //  获取路由对象
  const route = useRoute();
  //  获取store对象
  const store = useStore();
  //  获取当前访问的分类信息
  //  为什么使用计算机属性
  //  因为刚开始category.list 里面只有name 没有id,
  //  只有只是数据请求过来的以后才有id,所以需要通过计算机监控数据变化
  //  当数据发生变化后重新查找分类数据
  return computed(() => {
    return store.state.category.list.find(
      // console.log(store.state.category)
      (item) => item.id === route.params.id
    );
  });
}
</script>

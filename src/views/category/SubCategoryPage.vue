<template>
  <AppLayout>
    <div class="container"></div>
    <XtxBread>
      <XtxBreadItem path="/">首页</XtxBreadItem>
      <XtxBreadItem :path="`/category/${category.topCategory?.id}`">
        {{ category.topCategory?.name }}
      </XtxBreadItem>
      <Transition name="fade-right" mode="out-in">
        <XtxBreadItem :key="category.subCategory?.id">
          {{ category.subCategory?.name }}
        </XtxBreadItem>
      </Transition>
    </XtxBread>
  </AppLayout>
</template>

<script>
import AppLayout from "@/components/AppLayout";
import XtxBread from "@/components/library/XtxBread";
import XtxBreadItem from "@/components/library/XtxBreadItem";

import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { computed } from "vue";

export default {
  name: "SubCategoryPage",
  components: { AppLayout, XtxBread, XtxBreadItem },
  setup() {
    const category = useBread();

    return { category };
  },
};
function useBread() {
  //  获取store对象
  const store = useStore();
  //  获取route 对象
  const route = useRoute();
  //  根据二级分类id 查找二级分类和一级分类
  return computed(() => {
    //用于存储一级分类和二级分类的对象
    const result = {};
    //  遍历一级分类
    store.state.category.list.forEach((topCategory) => {
      //  遍历二级分类
      topCategory.children?.forEach((subCategory) => {
        //  查找当前二级分类
        console.log(topCategory.id, route.params.id);
        if (subCategory.id === route.params.id) {
          //  存储一级分类
          result.topCategory = {
            name: topCategory.name,
            id: topCategory.id,
          };
          //  存储二级分类
          result.subCategory = {
            name: subCategory.name,
            id: subCategory.id,
          };
        }
      });
    });
    // console.log(result);
    return result;
  });
}
</script>

<style scoped></style>

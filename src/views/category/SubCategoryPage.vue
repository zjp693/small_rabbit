<template>
  <AppLayout>
    <div class="container">
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
      <!--    筛选条件-->
      <SubFilter @onFilterParamsChanged="onParamsChanged"></SubFilter>
    </div>
  </AppLayout>
</template>

<script>
import AppLayout from "@/components/AppLayout";
import XtxBread from "@/components/library/XtxBread";
import XtxBreadItem from "@/components/library/XtxBreadItem";
import SubFilter from "@/views/category/components/SubFilter";

import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { computed } from "vue";

export default {
  name: "SubCategoryPage",
  components: { AppLayout, XtxBread, XtxBreadItem, SubFilter },
  setup() {
    const category = useBread();
    //获取用户筛选条件
    const onParamsChanged = (target) => {
      console.log(target);
    };
    return { category, onParamsChanged };
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

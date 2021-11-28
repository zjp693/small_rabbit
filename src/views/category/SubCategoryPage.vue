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
      <SubFilter @onFilterParamsChanged="onFilterSortParamsChanged"></SubFilter>
      <!-- 商品区块 -->
      <div class="goods-list">
        <!-- 商品排序 -->
        <SubSort @onSortParamsChanged="onFilterSortParamsChanged" />
        <!-- 商品列表 -->
        <GoodsList :goods="result.items" v-if="result" />
        <XtxInfiniteLoading />
      </div>
    </div>
  </AppLayout>
</template>

<script>
import AppLayout from "@/components/AppLayout";
import XtxBread from "@/components/library/XtxBread";
import XtxBreadItem from "@/components/library/XtxBreadItem";
import SubFilter from "@/views/category/components/SubFilter";
import SubSort from "@/views/category/components/SubSort";
import GoodsList from "@/views/category/components/GoodsList";

import { useStore } from "vuex";
import { onBeforeRouteUpdate, useRoute } from "vue-router";
import { computed, ref, watch } from "vue";
import { getGoodsList } from "@/api/category";

export default {
  name: "SubCategoryPage",
  components: {
    AppLayout,
    XtxBread,
    XtxBreadItem,
    SubFilter,
    SubSort,
    GoodsList,
  },
  setup() {
    //轮播图
    const category = useBread();
    //获取用户筛选条件
    const onParamsChanged = (target) => {
      console.log(target);
    };
    //商品数据
    const { result, onFilterSortParamsChanged } = uesGoods();
    return { category, onParamsChanged, result, onFilterSortParamsChanged };
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
    return result;
  });
}
//获取商品数据
function uesGoods() {
  //  获取路由信息对象
  const route = useRoute();
  //  用于存储商品数据
  const result = ref(null);
  //  用于存储请求参数
  let reqParams = ref({
    categoryId: route.params.id,
  });

  //  用于获取商品数据
  const getGoods = () => {
    //  获取商品数据
    console.log(reqParams);

    getGoodsList(reqParams.value).then((data) => {
      result.value = data.result;
      setTimeout(() => {
        console.log(result);
      }, 1000);
    });
  };
  //用于更新请求参数
  const onFilterSortParamsChanged = (target) => {
    reqParams.value = { ...reqParams.value, ...target };
  };
  //路由更新，更新请求参数中的分类id
  onBeforeRouteUpdate((to) => {
    reqParams.value = { categoryId: to.params.id };
  });
  //  监听请求参数变化，
  watch(
    () => reqParams.value,
    () => {
      getGoods();
    },
    {
      //初始化进入页面获取商品数据
      immediate: true,
    }
  );
  return { result, onFilterSortParamsChanged };
}
</script>

<style scoped>
.goods-list {
  background: #fff;
  padding: 0 25px;
  margin-top: 25px;
}
</style>

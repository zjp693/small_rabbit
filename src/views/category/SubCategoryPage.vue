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
        <!--        加载更多-->
        <XtxInfiniteLoading
          :loading="loading"
          :finished="finished"
          @infinite="loadMore"
        />
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
    const { loadMore } = uesGoods();
    //获取用户筛选条件
    // const onParamsChanged = (target) => {
    //   useSubCategoryFilter(target);
    // };
    //商品数据
    const { result, onFilterSortParamsChanged, loading, finished } = uesGoods();
    return {
      category,
      result,
      onFilterSortParamsChanged,
      loading,
      finished,
      loadMore,
    };
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
  // 用于标识加载状态
  const loading = ref(false);
  // 用于标识是否全部数据都已经加载完成
  const finished = ref(false);
  //  获取路由信息对象
  const route = useRoute();
  //  用于存储商品数据
  const result = ref(null);
  //  用于存储请求参数
  let reqParams = ref({
    categoryId: route.params.id,
    // 当前页
    page: 1,
    // 每次请求获取的数据条数
    pageSize: 10,
  });
  //  用于获取商品数据
  const getGoods = () => {
    //  获取商品数据
    getGoodsList(reqParams.value).then((data) => {
      //如果当前不是第一页，直接赋值
      if (reqParams.value.page === 1) {
        result.value = data.result;
        //当路由参数发生变化时重置页码
        finished.value = false;
      } else {
        //  如果当前不是第一页，做商品列表数据的累加
        result.value = {
          ...data.result,
          item: [...result.value.items, ...data.result.items],
        };
      }
      //  如果当前页是最后一页
      if (reqParams.value.page === data.result.page) {
        //  所有数据已加载完成
        finished.value = true;
      }
    });
  };
  // 加载更多
  const loadMore = () => {
    reqParams.value = {
      ...reqParams.value,
      page: reqParams.value.page + 1,
    };
  };
  //用于更新请求参数
  const onFilterSortParamsChanged = (target) => {
    console.dir(target);
    reqParams.value = { ...reqParams.value, ...target, page: 1 };
  };
  //路由更新，更新请求参数中的分类id
  onBeforeRouteUpdate(() => {
    reqParams.value = {
      categoryId: route.params.id,
      // 当前页
      page: 1,
      // 每次请求获取的数据条数
      pageSize: 10,
    };
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
  return { result, onFilterSortParamsChanged, loading, finished, loadMore };
}
</script>

<style scoped>
.goods-list {
  background: #fff;
  padding: 0 25px;
  margin-top: 25px;
}
</style>

<template>
  <!-- 筛选区 -->
  <div class="sub-filter" v-if="filters && !filtersLoading">
    <div class="item">
      <div class="head">品牌：</div>
      <div class="body">
        <a
          href="javascript:"
          v-for="brands in filters?.brands"
          :key="brands.id"
          @click="
            filters.selectedBrandId = brands.id;
            updateSelectedFilters();
          "
          :class="{ active: filters.selectedBrandId === brands.id }"
          >{{ brands.name }}</a
        >
      </div>
    </div>
    <div class="item" v-for="item in filters?.saleProperties" :key="item.id">
      <div class="head">{{ item.name }}</div>
      <div class="body">
        <a
          href="javascript:"
          v-for="property in item.properties"
          :key="property.id"
          @click="
            item.selectedFilterName = property.name;
            updateSelectedFilters();
          "
          :class="{ active: item.selectedFilterName === property.name }"
          >{{ property.name }}</a
        >
      </div>
    </div>
  </div>
  <!--  筛选数据的骨架屏-->
  <div class="sub-filter" v-else>
    <XtxSkeleton class="item" width="800px" height="40px" />
    <XtxSkeleton class="item" width="800px" height="40px" />
    <XtxSkeleton class="item" width="600px" height="40px" />
    <XtxSkeleton class="item" width="600px" height="40px" />
    <XtxSkeleton class="item" width="600px" height="40px" />
  </div>
</template>
<script>
import { onBeforeRouteUpdate, useRoute } from "vue-router";
import { ref } from "vue";
import { getSubCategoryById } from "@/api/category";

export default {
  name: "SubFilter",
  emits: ["onFilterParamsChanged"],
  setup(props, { emit }) {
    const { filters, updateSelectedFilters, filtersLoading } =
      useSubCategoryFilter(emit);

    return { filters, updateSelectedFilters, filtersLoading };
  },
};
//获取筛选条件
function useSubCategoryFilter(emit) {
  //  获取路由的信息对象
  const route = useRoute();
  //  用于存储所以的筛选条件数据
  const filters = ref();
  //用于存储筛选数据的加载状态
  const filtersLoading = ref(false);
  //将用户选择的筛选条件传递到父组件
  // emit("onFilterParamsChanged", selectedFilters);
  //用于存储用户用户选择的筛选条件
  const selectedFilters = ref({
    brandId: null,
    attrs: [],
  });
  //  获取筛选条件
  getSubCategoryById(route.params.id).then((data) => {
    filtersLoading.value = true;
    //在品牌筛选条件的前面加上`全部`筛选选项
    data.result.brands.unshift({ id: null, name: "全部" });
    //  在其他的筛选的条件的前面的加上`全部`筛选选项
    data.result.saleProperties.forEach((item) => {
      item.properties.unshift({ id: null, name: "全部" });
      //  用于存储用户选择的品牌id
      item.selectedFilterName = "全部";
    });
    //  存储筛选条件
    filters.value = data.result;
    //  用于用户选择的品牌id
    data.result.selectedBrandId = null;
    //  更新筛选数据的加载状态
    filtersLoading.value = false;
  });
  //路由切换时获取筛选条件数据
  onBeforeRouteUpdate((to) => getSubCategoryById(to.params.id));
  //用于更新用户的筛选条件
  const updateSelectedFilters = () => {
    // console.log(filters.value.selectedBrandId, filters.value);
    //  更新用户选择的品牌id
    selectedFilters.value.brandId = filters.value.selectedBrandId;
    //  重置用户选择的筛选条件
    selectedFilters.value.attrs = [];
    //  更新用户选择的筛选条件
    filters.value.saleProperties.forEach((item) => {
      //  如果用户选择的当前筛选类别的筛选条件
      if (item.selectedFilterName && item.selectedFilterName !== "全部") {
        //  收集用户选择的筛选条件和具体的筛选条件名称
        selectedFilters.value.attrs.push({
          groupName: item.name,
          propertyName: item.selectedFilterName,
        });
      }
    });
    // 将用户选择的筛选条件传递到父组件
    emit("onFilterParamsChanged", selectedFilters);
  };

  return { filters, updateSelectedFilters, filtersLoading };
}
</script>
<style scoped lang="less">
// 筛选区
.sub-filter {
  background: #fff;
  padding: 25px;
  .item {
    display: flex;
    line-height: 40px;
    .head {
      width: 80px;
      color: #999;
    }
    .body {
      flex: 1;
      a {
        margin-right: 36px;
        transition: all 0.3s;
        display: inline-block;
        &.active,
        &:hover {
          color: @xtxColor;
        }
      }
    }
  }
}
.xtx-skeleton {
  padding: 10px 0;
}
</style>

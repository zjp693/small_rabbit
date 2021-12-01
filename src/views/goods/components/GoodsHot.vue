<template>
  <div class="goods-hot" v-if="hotGoods">
    <h3>{{ titles[type] }}</h3>
    <GoodsItem
      v-for="item in hotGoods"
      :key="item.id"
      :goods="item"
    ></GoodsItem>
  </div>
</template>
<script>
import GoodsItem from "@/views/category/components/GoodsItem";
import { onBeforeRouteUpdate, useRoute } from "vue-router";
import { ref } from "vue";

import { getHotGoods } from "@/api/goods";

export default {
  name: "GoodsHot",
  components: { GoodsItem },
  props: {
    type: {
      type: Number,
      default: 1,
    },
  },
  setup(props) {
    const { hotGoods, titles } = useHotGoods(props.type);
    return { hotGoods, titles };
  },
};
function useHotGoods(type) {
  //  获取路由信息对象
  const route = useRoute();
  //  用于存储热销商品数据
  const hotGoods = ref(null);
  //榜单的名称
  const titles = { 1: "24小时热销榜", 2: "周热销榜", 3: "总热销榜" };
  //获取热销商品数据
  const getData = (id) => {
    //  发送请求获取热销商品数据

    getHotGoods({ id, type }).then((data) => {
      hotGoods.value = data.result;
    });
    console.log(hotGoods);
  };
  getData(route.params.id);
  onBeforeRouteUpdate((to) => getData(to.params.id));
  return { hotGoods, getData, titles };
}
</script>
<style scoped lang="less">
.goods-hot {
  h3 {
    height: 70px;
    background: @helpColor;
    color: #fff;
    font-size: 18px;
    line-height: 70px;
    padding-left: 25px;
    margin-bottom: 10px;
    font-weight: normal;
  }
  :deep(.goods-item) {
    background: #fff;
    width: 100%;
    margin-bottom: 10px;
    img {
      width: 200px;
      height: 200px;
    }
    p {
      margin: 0 10px;
    }
    &:hover {
      transform: none;
      box-shadow: none;
    }
  }
}
</style>

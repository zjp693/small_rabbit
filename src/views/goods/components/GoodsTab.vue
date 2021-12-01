<template>
  <div class="goods-tabs">
    <nav>
      <a
        @click="activeComponentName = 'GoodsDetail'"
        :class="{ active: activeComponentName === 'GoodsDetail' }"
        href="javascript:"
        >商品详情</a
      >
      <a
        @click="activeComponentName = 'GoodsComment'"
        :class="{ active: activeComponentName === 'GoodsComment' }"
        href="javascript:"
        >商品评价<span>(500+)</span></a
      >
    </nav>
    <!-- 切换内容的地方 -->
    <!-- 根据组件名称动态渲染组件 -->
    <component :is="activeComponentName"></component>
    <!--    <GoodsDetail v-if="activeComponentName === 'GoodsDetail'"></GoodsDetail>-->
    <!--    <GoodsComment v-if="activeComponentName === 'GoodsComment'"></GoodsComment>-->
  </div>
</template>
<script>
import { ref } from "vue";
import GoodsDetail from "@/views/goods/components/GoodsDetail";
import GoodsComment from "@/views/goods/components/GoodsComment";
export default {
  name: "GoodsTab",
  components: { GoodsDetail, GoodsComment },
  setup() {
    // GoodsDetail 展示商品详细信息、GoodsComment 展示商品评论信息
    const activeComponentName = ref("GoodsDetail");
    return { activeComponentName };
  },
};
</script>
<style lang="less" scoped>
.goods-tabs {
  min-height: 600px;
  background: #fff;
  nav {
    height: 70px;
    line-height: 70px;
    display: flex;
    border-bottom: 1px solid #f5f5f5;
    a {
      padding: 0 40px;
      font-size: 18px;
      position: relative;
      > span {
        color: @priceColor;
        font-size: 16px;
        margin-left: 10px;
      }
      &:first-child {
        border-right: 1px solid #f5f5f5;
      }
      &.active {
        &::before {
          content: "";
          position: absolute;
          left: 40px;
          bottom: -1px;
          width: 72px;
          height: 2px;
          background: @xtxColor;
        }
      }
    }
  }
}
</style>

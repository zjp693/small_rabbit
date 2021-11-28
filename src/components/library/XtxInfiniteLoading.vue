<template>
  <div class="xtx-infinite-loading" ref="target">
    <div class="loading">
      <span class="img"></span>
      <span class="text">正在加载...</span>
    </div>
    <div class="none">
      <span class="img"></span>
      <span class="text">亲，没有更多了</span>
    </div>
  </div>
</template>
<script>
import { ref } from "vue";

export default {
  name: "XtxInfiniteLoading",
  props: {
    //  是否在加载
    loading: {
      type: Boolean,
      default: false,
    },
    //  是否全部数据加载已加载完成
    finished: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    //被监听元素
    const target = ref(null);

    return { target };
  },
};
</script>
<style scoped lang="less">
.xtx-infinite-loading {
  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;
    .img {
      width: 50px;
      height: 50px;
      background: url(../../assets/images/load.gif) no-repeat center / contain;
    }
    .text {
      color: #999;
      font-size: 16px;
    }
  }
  .none {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;
    .img {
      width: 200px;
      height: 134px;
      background: url(../../assets/images/none.png) no-repeat center / contain;
    }
    .text {
      color: #999;
      font-size: 16px;
    }
  }
}
</style>

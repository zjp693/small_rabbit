<template>
  <HomePanel title="热门品牌" subTitle="国际经典 品质保证" ref="target">
    <template v-slot:right>
      <a
        @click="toggle(-1)"
        :class="{ disables: currentIndex === 0 }"
        href="javascript:"
        class="iconfont icon-angle-left prev"
      ></a>
      <a
        @click="toggle(1)"
        :class="{ disables: currentIndex === 1 }"
        href="javascript:"
        class="iconfont icon-angle-right next"
      ></a>
    </template>
    <template v-slot:default>
      <div class="box">
        <transition name="fade">
          <ul
            v-if="result"
            class="list"
            :style="{ transform: `translateX(${-currentIndex * 1240}px)` }"
          >
            <li v-for="item in result" :key="item.id">
              <RouterLink to="/">
                <img :src="item.picture" alt="item.name" />
              </RouterLink>
            </li>
          </ul>
          <div v-else>
            <XtxSkeleton
              class="item"
              v-for="i in 5"
              :key="i"
              animated="scroll"
              bg="#e4e4e4"
              width="240px"
              height="305px"
            ></XtxSkeleton>
          </div>
        </transition>
      </div>
    </template>
  </HomePanel>
</template>

<script>
import HomePanel from "@/views/home/components/HomePanel";
import userLazyData from "@/hooks/userLazyData";
import { getHotBrands } from "@/api/home";
import XtxSkeleton from "@/components/library/XtxSkeleton";
import { ref } from "vue";
export default {
  name: "HomeBrand",
  components: { HomePanel, XtxSkeleton },
  setup() {
    //获取热门品牌数据
    const { target, result } = userLazyData(getHotBrands);
    const { currentIndex, toggle } = useToggle();
    //返回页面所需数据
    return { target, result, currentIndex, toggle };
  },
};

function useToggle() {
  //页面滚动效果
  // 索引
  const currentIndex = ref(0);
  //控制切换索引
  const toggle = (step) => {
    // console.log("切换");
    //  计算索引
    const nextIndex = currentIndex.value + step;
    //  控制索引返回
    if (nextIndex < 0 || nextIndex > 1) return;
    //  如果索引在正常范围内就更换索引
    currentIndex.value = nextIndex;
  };
  return { currentIndex, toggle };
}
</script>

<style scoped lang="less">
.home-panel {
  background: #f5f5f5;
}
.iconfont {
  width: 20px;
  height: 20px;
  background: #ccc;
  color: #fff;
  display: inline-block;
  text-align: center;
  margin-left: 5px;
  background: @xtxColor;
  &::before {
    font-size: 12px;
    position: relative;
    top: -2px;
  }
  &.disabled {
    background: #ccc;
    cursor: not-allowed;
  }
}
.box {
  display: flex;
  width: 100%;
  height: 345px;
  overflow: hidden;
  padding-bottom: 40px;
  .list {
    width: 200%;
    display: flex;
    transition: all 1s;
    li {
      margin-right: 10px;
      width: 240px;
      &:nth-child(5n) {
        margin-right: 0;
      }
      img {
        width: 240px;
        height: 305px;
      }
    }
  }
}
.skeleton {
  width: 100%;
  display: flex;
  .item {
    margin-right: 10px;
    &:nth-child(5n) {
      margin-right: 0;
    }
  }
}
</style>

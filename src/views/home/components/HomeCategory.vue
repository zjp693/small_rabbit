<template>
  <div class="home-category" @mouseleave="current = null">
    <ul class="menu" v-if="menuList">
      <!--      鼠标移入的费力计算机hi当前分类就为当前li添加active 类名-->
      <li
        v-for="item in menuList"
        :key="item.id"
        @mouseenter="current = item"
        :class="{ active: current?.id && current.id === item.id }"
      >
        <RouterLink :to="`/category/${item.id}`">{{ item.name }}</RouterLink>
        <RouterLink
          v-for="sub in item?.children"
          :key="sub.id"
          :to="`/category/sub/${sub.id}`"
          >{{ sub.name }}</RouterLink
        >

        <template v-if="item.children?.length"></template>
        <template v-else>
          <XtxSkeleton
            animated="fade"
            width="60px"
            height="18px"
            bg="rgba(255,255,255,0.2)"
            style="margin-right: 5px"
          ></XtxSkeleton>
          <XtxSkeleton
            animated="fade"
            width="60px"
            height="18px"
            bg="rgba(255,255,255,0.2)"
          ></XtxSkeleton>
        </template>
      </li>
    </ul>
    <!-- 注意: 此弹层结构放在 ul.menu 下面 -->
    <div class="layer" v-if="current">
      <h4>{{ current.goods ? "商品" : "品牌" }}推荐</h4>
      <small>根据您的购买或浏览记录推荐</small>
      <ul v-if="current.goods">
        <li v-for="item in current.goods" :key="item">
          <RouterLink to="/">
            <img :src="item.picture" alt="" />
            <div class="info">
              <p class="name ellipsis-2">{{ item.name }}</p>
              <p class="desc ellipsis">{{ item.desc }}</p>
              <p class="price"><i>¥</i>{{ item.price }}</p>
            </div>
          </RouterLink>
        </li>
      </ul>
      <!-- 注意: 此布局放置在 .layer 中, 放置在商品推荐 ul 的后面 -->
      <ul v-if="current.brands">
        <li class="brand" v-for="item in current.brands" :key="item.id">
          <RouterLink to="/">
            <img :src="item.picture" alt="item.name" />
            <div class="info">
              <p class="place">
                <i class="iconfont icon-dingwei"></i>{{ item.place }}
              </p>
              <p class="name ellipsis">{{ item.name }}</p>
              <p class="desc ellipsis-2">{{ item.nameEn }}</p>
            </div>
          </RouterLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { computed, ref } from "vue";
import { getHotBrands } from "@/api/home";

export default {
  name: "HomeCategory",
  setup() {
    const { menuList, current } = useMenuList();
    return { menuList, current };
  },
};
function useMenuList() {
  //  获取store数据
  const store = useStore();
  //用于存储当前用户鼠标移入的左侧一级分类
  const current = ref(null);
  //  存储品牌
  const brand = ref({
    id: "brand",
    name: "品牌",
    children: [{ id: "child-brand", name: "推荐品牌" }],
    brands: [],
  });
  //获取左侧分类所需数据
  const menuList = computed(() => {
    // console.log(store.state.category.list);
    const list = store.state.category.list.map((item) => ({
      ...item,
      children: item.children ? item.children.slice(0, 2) : [],
    }));
    // console.log(list);
    //  向列表中添加品牌
    list.push(brand.value);
    //  返回处理好得分类列表数据
    return list;
  });
  //获取品牌数据
  getHotBrands(9).then((data) => {
    brand.value.brands = data.result;
    // console.log(data);
  });
  return { menuList, current, brand };
}
</script>
<style scoped lang="less">
.home-category {
  width: 250px;
  height: 500px;
  background: rgba(0, 0, 0, 0.8);
  position: relative;
  z-index: 99;
  .menu {
    li {
      padding-left: 40px;
      height: 50px;
      line-height: 50px;

      &:hover,
      &.active {
        background-color: @xtxColor;
      }
      a {
        margin-right: 4px;
        color: #fff;
        &:first-child {
          font-size: 16px;
        }
      }
    }
  }
  // 注意: 此弹层样式放置在 .home-category 内部
  .layer {
    width: 990px;
    height: 500px;
    background: rgba(255, 255, 255, 0.8);
    position: absolute;
    left: 250px;
    top: 0;
    display: none;
    padding: 0 15px;
    h4 {
      font-size: 20px;
      font-weight: normal;
      line-height: 80px;
      small {
        font-size: 16px;
        color: #666;
      }
    }
    ul {
      display: flex;
      flex-wrap: wrap;
      li {
        width: 310px;
        height: 120px;
        margin-right: 15px;
        margin-bottom: 15px;
        border: 1px solid #eee;
        border-radius: 4px;
        background: #fff;
        &:nth-child(3n) {
          margin-right: 0;
        }
        a {
          display: flex;
          width: 100%;
          height: 100%;
          align-items: center;
          padding: 10px;
          &:hover {
            background: #e3f9f4;
          }
          img {
            width: 95px;
            height: 95px;
          }
          .info {
            padding-left: 10px;
            line-height: 24px;
            width: 190px;
            .name {
              font-size: 16px;
              color: #666;
            }
            .desc {
              color: #999;
            }
            .price {
              font-size: 22px;
              color: @priceColor;
              i {
                font-size: 16px;
              }
            }
          }
        }
      }
      // 注意: 此样式方式在 .layer/ul 中
      li.brand {
        height: 180px;
        a {
          align-items: flex-start;
          img {
            width: 120px;
            height: 160px;
          }
          .info {
            p {
              margin-top: 8px;
            }
            .place {
              color: #999;
            }
          }
        }
      }
    }
  }
  &:hover {
    .layer {
      display: block;
    }
  }
}
</style>

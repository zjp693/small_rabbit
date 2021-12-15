<template>
  <AppLayout>
    <div class="xtx-goods-page" v-if="goodsDetail">
      <div class="container">
        <!-- 面包屑 -->
        <XtxBread>
          <XtxBreadItem path="/"> 首页 </XtxBreadItem>
          <XtxBreadItem :path="`/category/${goodsDetail.categories[1].id}`">
            {{ goodsDetail.categories[1].name }}
          </XtxBreadItem>
          <XtxBreadItem :path="`/category/sub/${goodsDetail.categories[0].id}`">
            {{ goodsDetail.categories[0].name }}
          </XtxBreadItem>
          <XtxBreadItem>
            {{ goodsDetail.name }}
          </XtxBreadItem>
        </XtxBread>
        <!-- 商品信息 -->
        <div class="goods-info">
          <!-- 左侧 -->
          <div class="media">
            <GoodsImages :images="goodsDetail.mainPictures" />
            <GoodsSales />
          </div>
          <!-- 右侧 -->
          <div class="spec">
            <!--            单品信息-->
            <GoodsInfo :goods="goodsDetail"></GoodsInfo>
            <!--            规格组件-->
            <!--                   skuId="1369155864430120962"-->
            <GoodsSku
              :specs="goodsDetail.specs"
              :skus="goodsDetail.skus"
              @onSpecChanged="onSpecChanged"
            ></GoodsSku>
            <!--            商品数量-->
            <XtxNumberBox
              label="数量"
              :max="goodsDetail.inventory"
              v-model="count"
            ></XtxNumberBox>
            <!--            按钮组件-->
            <XtxButton
              type="primary"
              :style="{ 'margin-top': '20px' }"
              @click="addCart"
              >加入购物车</XtxButton
            >
          </div>
        </div>
        <!-- 商品推荐 -->
        <GoodsRelevant :goodsId="goodsDetail.id"></GoodsRelevant>
        <!-- 商品详情 -->
        <div class="goods-footer">
          <div class="goods-article">
            <!-- 商品+评价 -->
            <GoodsTab />
            <!-- 注意事项 -->
            <GoodsWarn></GoodsWarn>
          </div>
          <!-- 24热榜 -->
          <div class="goods-aside">
            <GoodsHot :type="1" />
            <GoodsHot :type="2" />
            <GoodsHot :type="3" />
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script>
import GoodsRelevant from "@/views/goods/components/GoodsRelevant";
import GoodsImages from "@/views/goods/components/GoodsImages";
import AppLayout from "@/components/AppLayout";
import GoodsSales from "@/views/goods/components/GoodsSales";
import GoodsInfo from "@/views/goods/components/GoodsInfo";
import GoodsSku from "@/views/goods/components/GoodsSku";
import XtxButton from "@/components/library/XtxButton";
import GoodsTab from "@/views/goods/components/GoodsTab";
import GoodsHot from "@/views/goods/components/GoodsHot";
import GoodsWarn from "@/views/goods/components/GoodsWarn";

import { onBeforeRouteUpdate, useRoute } from "vue-router";
import { getGoodsDetail } from "@/api/goods";
import { provide, ref } from "vue";
import Message from "@/components/library/Message";
import { useStore } from "vuex";

export default {
  name: "GoodsDetailPage",

  components: {
    GoodsRelevant,
    AppLayout,
    GoodsImages,
    GoodsSales,
    GoodsInfo,
    GoodsSku,
    XtxButton,
    GoodsTab,
    GoodsHot,
    GoodsWarn,
  },

  setup() {
    const { goodsDetail, getData } = useGoods();
    //存储用户选择的商品数量
    const count = ref(1);
    // console.log(count);
    //监听规格组件传递过来的数据
    // 获取路由信息对象
    const route = useRoute();
    //获取store对象
    const store = useStore();
    // 发送请求获取商品详情信息
    getData(route.params.id);
    // 当用户选择完整的规格以后 更新视图
    const onSpecChanged = (data) => {
      goodsDetail.value.price = data.price;
      goodsDetail.value.oldPrice = data.oldPrice;
      goodsDetail.value.inventory = data.inventory;
      goodsDetail.value.currentSelectedSkuId = data.skuId;
      goodsDetail.value.currentSelectedSkuText = data.specsText;
      console.log(goodsDetail.value);
    };

    //加入购物车
    const addCart = () => {
      //  判断是否选择了规格
      if (!goodsDetail.value.currentSelectedSkuId) {
        Message({ type: "error", text: "请选择商品规格" });
        return;
      }
      // 2. 收集商品信息
      const goods = {
        // 商品id
        id: goodsDetail.value.id,
        // 商品 skuId
        skuId: goodsDetail.value.currentSkuId,
        // 商品名称
        name: goodsDetail.value.name,
        // 商品规格属性文字
        attrsText: goodsDetail.value.currentAttrsText,
        // 商品图片
        picture: goodsDetail.value.mainPictures[0],
        // 商品原价
        price: goodsDetail.value.oldPrice,
        // 商品现价
        nowPrice: goodsDetail.value.price,
        // 是否选中
        selected: true,
        // 商品库存
        stock: goodsDetail.value.inventory,
        // // 用户选择的商品数量
        count: count.value,
        // 是否为有效商品
        isEffective: true,
      };
      // 3. 将商品加入购物车
      store
        .dispatch("cart/addGoodsToCart", goods)
        //添加成功
        .then(() => {
          Message({ type: "success", text: "商品已成功被添加到购物车中" });
        })
        //  添加失败
        .catch((error) => {
          Message({ type: "success", text: `${error.response.data.message}}` });
        });
    };

    provide("goodsDetail", goodsDetail);
    return { goodsDetail, getData, onSpecChanged, count, addCart };
  },
};
function useGoods() {
  // 获取路由信息对象
  const route = useRoute();
  // 用于存储商品详情信息
  const goodsDetail = ref(null);
  // 用于获取商品详情信息
  const getData = (id) => {
    // 发送请求获取商品详情信息
    getGoodsDetail(id).then((data) => {
      goodsDetail.value = data.result;
    });
  };
  // 初始获取商品详情信息
  getGoodsDetail(route.params.id);
  // 当路由发生更新时, 重新获取商品详情信息
  onBeforeRouteUpdate((to) => {
    getGoodsDetail(to.params.id);
  });
  return { goodsDetail, getData };
}
</script>

<style scoped lang="less">
.goods-info {
  min-height: 600px;
  background: #fff;
  display: flex;
  .media {
    width: 580px;
    height: 600px;
    padding: 30px 50px;
  }
  .spec {
    flex: 1;
    padding: 30px 30px 30px 0;
  }
}
.goods-footer {
  display: flex;
  margin-top: 20px;
  .goods-article {
    width: 940px;
    margin-right: 20px;
  }
  .goods-aside {
    width: 280px;
    min-height: 1000px;
  }
}
.goods-tabs {
  min-height: 600px;
  background: #fff;
}
.goods-warn {
  min-height: 600px;
  background: #fff;
  margin-top: 20px;
}
</style>

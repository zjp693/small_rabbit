<template>
  <AppMemberLayout>
    <!-- 订单详情-->
    <div class="order-detail-page" v-if="orderDetail">
      <!-- 操作栏 -->
      <DetailAction
        :orderDetail="orderDetail"
        :getOrderDetail="getData"
        @onOrderListReload="getData($event)"
      ></DetailAction>
      <!-- 步骤条-->
      <XtxSteps
        :active="orderDetail.orderState === 6 ? 1 : orderDetail.orderState"
      >
        <XtxStepItem
          title="提交订单"
          :desc="orderDetail.createTime"
        ></XtxStepItem>
        <XtxStepItem title="付款成功" :desc="orderDetail.payTime"></XtxStepItem>
        <XtxStepItem
          title="商品发货"
          :desc="orderDetail.consignTime"
        ></XtxStepItem>
        <XtxStepItem title="确认收货" :desc="orderDetail.endTime"></XtxStepItem>
        <XtxStepItem
          title="订单完成"
          :desc="orderDetail.evaluationTime"
        ></XtxStepItem>
      </XtxSteps>
      <!-- 物流栏 -->

      <!-- 订单商品信息 -->
      <DetailOrderGoods :orderDetail="orderDetail" />
    </div>
  </AppMemberLayout>
</template>
<script>
import AppMemberLayout from "@/components/AppMemberLayout";
import { useRoute } from "vue-router";
import { ref } from "vue";
import { getOrderDetail } from "@/api/order";
import DetailAction from "@/views/member/order/components/DetailAction";
import DetailOrderGoods from "@/views/member/order/components/DetailOrderGooods";
import XtxSteps from "@/components/library/XtxSteps";
import XtxStepItem from "@/components/library/XtxStepItem";

export default {
  name: "OrderDetailPage",
  components: {
    XtxStepItem,
    XtxSteps,
    DetailOrderGoods,
    DetailAction,
    AppMemberLayout,
  },
  setup() {
    const { orderDetail, getData } = useOrderDetail();
    return {
      orderDetail,
      getData,
    };
  },
};
//#region 获取订单信息
function useOrderDetail() {
  //  获取路由信息对象
  const route = useRoute();
  //  用于存储订单详情信息
  const orderDetail = ref();
  // 获取订单详情数据
  const getData = () => {
    getOrderDetail(route.params.id).then((data) => {
      orderDetail.value = data.result;
    });
  };
  getData();
  return { orderDetail, getData };
}
//#endreg
</script>
<style scoped lang="less">
.order-detail-page {er
  background: #fff;
  height: 100%;
}
</style>

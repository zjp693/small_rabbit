<template>
  <AppMemberLayout>
    <div class="member-order">
      <XtxTabs v-model:current="current">
        <XtxTabTitle v-for="status in orderStatus" :key="status.name">{{
          status.label
        }}</XtxTabTitle>
      </XtxTabs>
      <div class="order-list" v-if="orderList">
        <div class="loading" v-if="loading"></div>
        <div class="order-list" v-if="orderList && !loading">
          <OrderItem
            v-for="item in orderList.items"
            :key="item.id"
            :order="item"
            @onCancelOrder="onCancelOrderHandler"
          ></OrderItem>
        </div>
        <div v-if="!loading && orderList?.items.length === 0" class="none">
          暂无数据
        </div>
      </div>
    </div>
  </AppMemberLayout>
  <CancelOrder ref="cancelOrderComponent"></CancelOrder>
</template>

<script>
import AppMemberLayout from "@/components/AppMemberLayout";
import { ref, watch } from "vue";
import { orderStatus } from "@/api/constants";
import OrderItem from "@/views/member/order/components/OrderItem";
import { getOrderList } from "@/api/member";
import CancelOrder from "@/views/member/order/components/CancelOrder";
export default {
  name: "OrderListPage.vue",
  components: { CancelOrder, OrderItem, AppMemberLayout },
  setup() {
    //用户存储取消订单弹层实例组件
    const cancelOrderComponent = ref();
    const current = ref(0);
    //获取订单数据
    const { orderList, loading, reqParams } = useOrderList();
    watch(current, () => {
      //  重置订单状态参数
      reqParams.value.orderState = current.value;
      //  重置页面参数
      reqParams.value.page = 1;
    });
    //当用户点击取消按钮时
    const onCancelOrderHandler = () => {
      //  渲染取消订单弹层
      cancelOrderComponent.value.visible = true;
    };
    return {
      current,
      orderStatus,
      orderList,
      loading,
      cancelOrderComponent,
      onCancelOrderHandler,
    };
  },
};
// 获取订单列表数据
function useOrderList() {
  // /订单列表数据加载状态
  const loading = ref(false);
  // 用于存储订单列表数据
  const orderList = ref(null);
  // 请求参数
  const reqParams = ref({ page: 1, pageSize: 10, orderState: 0 });
  // 获取并存储订单列表数据
  const getData = () => {
    // 更新加载状态
    loading.value = true;
    getOrderList(reqParams.value).then((data) => {
      (orderList.value = data.result),
        // 更新加载状态
        (loading.value = false);
    });
  };
  // 监控请求参数变化, 重新获取订单列表数据
  watch(reqParams.value, () => getData(), { immediate: true });
  return { orderList, reqParams, loading };
}
</script>

<style lang="less" scoped>
.member-order {
  height: 100%;
  background: #fff;
  position: relative;
}
.order-list {
  background: #fff;
  padding: 20px;
  position: relative;
}
.loading {
  height: calc(100% - 60px);
  width: 100%;
  min-height: 400px;
  position: absolute;
  left: 0;
  top: 60px;
  background: rgba(255, 255, 255, 0.9) url(../../../assets/images/loading.gif)
    no-repeat center 18%;
}
.none {
  height: 400px;
  text-align: center;
  line-height: 400px;
  color: #999;
  background: rgba(255, 255, 255, 0.9);
}
</style>

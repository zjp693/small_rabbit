<template>
  <div class="order-item">
    <div class="head" v-if="order">
      <span>下单时间：{{ order.createTime }}</span>
      <span>订单编号：{{ order.id }}</span>
      <span class="down-time">
        <i class="iconfont icon-down-time"></i>
        <b>付款截止：{{ timeText }}</b>
      </span>
      <!-- 订单状态为 已完成(5)或已取消(6)时可以删除订单 -->
      <a
        href="javascript:"
        class="del"
        v-if="[5, 6].includes(order.orderState)"
        @click="onDeleteOrderButtonClickHandler(order.id)"
        >删除</a
      >
    </div>
    <div class="body" v-if="order">
      <div class="column goods">
        <ul>
          <li v-for="goods in order.skus" :key="goods.id">
            <a class="image" :to="`/product/${goods.spuId}`">
              <img :src="goods.image" alt="" />
            </a>
            <div class="info">
              <p class="name ellipsis-2">{{ goods.name }}</p>
              <p class="attr ellipsis">
                <span>{{ goods.attrsText }} </span>
              </p>
            </div>
            <div class="price">¥{{ goods.realPay }}</div>
            <div class="count">x{{ goods.quantity }}</div>
          </li>
        </ul>
      </div>
      <!-- orderStatus是一个数组, 数组的索引和订单状态值是对应关系 -->
      <div class="column state">
        <p>{{ orderStatus[order.orderState].label }}</p>
        <a v-if="order.orderState === 3" href="javascript:" class="green"
          >查看物流</a
        >
        <a v-if="order.orderState === 4" href="javascript:" class="green"
          >评价商品</a
        >
        <a v-if="order.orderState === 5" href="javascript:" class="green"
          >查看评价</a
        >
      </div>
      <div class="column amount">
        <p class="red">¥{{ order.payMoney }}</p>
        <p>（含运费：¥{{ order.postFee }}）</p>
        <p>在线付款</p>
      </div>
      <div class="column action">
        <XtxButton
          type="primary"
          size="small"
          @click="$router.push(`/member/pay?orderId=${order.id}`)"
          v-if="order.orderState === 1"
          >立即付款</XtxButton
        >
        <XtxButton type="primary" size="small" v-if="order.orderState === 3"
          >确认收货</XtxButton
        >
        <p>
          <router-link :to="`/member/order/${order.id}`">查看详情</router-link>
        </p>
        <p v-if="order.orderState === 1">
          <a
            href="javascript:"
            @click="onCancelOrderButtonClickHandler(order.id)"
            >取消订单</a
          >
        </p>
        <p v-if="[2, 3, 4, 5].includes(order.orderState)">
          <a href="javascript:">再次购买</a>
        </p>
        <p v-if="[4, 5].includes(order.orderState)">
          <a href="javascript:">申请售后</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import useCountDown from "@/hooks/useCountDown";
import { orderStatus } from "@/api/constants";
import { ref } from "vue";
import Confirm from "@/components/library/Confirm";
import { deleteOrder } from "@/api/order";
import Message from "@/components/library/Message";
export default {
  name: "OrderItem",
  props: {
    order: {
      type: Object,
      default: () => {},
    },
  },
  setup(props, { emit }) {
    //  获取倒计时
    const { timeText, start } = useCountDown();
    let active = ref(0);
    //当用户点击取消订单按钮时
    const onCancelOrderButtonClickHandler = (id) => {
      emit("onCancelOrder", id);
    };
    // 获取订单列表数据
    if (props.order.orderState === 1) {
      //  开启倒计时
      start(props.order.countdown);
    }
    //#region 当用户点击删除订单的时候
    const onDeleteOrderButtonClickHandler = async (id) => {
      try {
        await Confirm({
          title: "温馨提示",
          content: "订单删除后不可恢复",
        });
        await deleteOrder([id]);
        Message({ type: "success", text: "订单删除成功" });
        await emit("onOrderListReload");
      } catch (error) {
        Message({ type: "error", text: "订单删除失败" });
      }
    };
    //#endregion
    return {
      orderStatus,
      timeText,
      start,
      active,
      onCancelOrderButtonClickHandler,
      onDeleteOrderButtonClickHandler,
    };
  },
};
</script>

<style scoped lang="less">
.order-item {
  margin-bottom: 20px;
  border: 1px solid #f5f5f5;
  .head {
    height: 50px;
    line-height: 50px;
    background: #f5f5f5;
    padding: 0 20px;
    overflow: hidden;
    span {
      margin-right: 20px;
      &.down-time {
        margin-right: 0;
        float: right;
        i {
          vertical-align: middle;
          margin-right: 3px;
        }
        b {
          vertical-align: middle;
          font-weight: normal;
        }
      }
    }
    .del {
      margin-right: 0;
      float: right;
      color: #999;
    }
  }
  .body {
    display: flex;
    align-items: stretch;
    .column {
      border-left: 1px solid #f5f5f5;
      text-align: center;
      padding: 20px;
      > p {
        padding-top: 10px;
      }
      &:first-child {
        border-left: none;
      }
      &.goods {
        flex: 1;
        padding: 0;
        align-self: center;
        ul {
          li {
            border-bottom: 1px solid #f5f5f5;
            padding: 10px;
            display: flex;
            &:last-child {
              border-bottom: none;
            }
            .image {
              width: 70px;
              height: 70px;
              border: 1px solid #f5f5f5;
            }
            .info {
              width: 220px;
              text-align: left;
              padding: 0 10px;
              p {
                margin-bottom: 5px;
                &.name {
                  height: 38px;
                }
                &.attr {
                  color: #999;
                  font-size: 12px;
                  span {
                    margin-right: 5px;
                  }
                }
              }
            }
            .price {
              width: 100px;
            }
            .count {
              width: 80px;
            }
          }
        }
      }
      &.state {
        width: 120px;
        .green {
          color: @xtxColor;
        }
      }
      &.amount {
        width: 200px;
        .red {
          color: @priceColor;
        }
      }
      &.action {
        width: 140px;
        a {
          display: block;
          &:hover {
            color: @xtxColor;
          }
        }
      }
    }
  }
}
</style>

<template>
  <AppLayout>
    <div class="xtx-pay-page">
      <div class="container">
        <XtxBread>
          <XtxBreadItem path="/">首页</XtxBreadItem>
          <XtxBreadItem path="/cart">购物车</XtxBreadItem>
          <XtxBreadItem>支付订单</XtxBreadItem>
        </XtxBread>
        <!-- 付款信息 -->
        <div class="pay-info">
          <span class="icon iconfont icon-queren2"></span>
          <div class="tip">
            <p>订单提交成功！请尽快完成支付。</p>
            <p v-if="count > 0">
              支付还剩 <span>{{ dayjs.unix(count).format("mm分ss秒") }}</span
              >, 超时后将取消订单
            </p>
            <p v-else>订单已超时</p>
          </div>
          <div class="amount">
            <span>应付总额：</span>
            <span>¥ {{ info?.payMoney.toFixed(2) }}</span>
          </div>
        </div>
        <!-- 付款方式 -->
        <div class="pay-type">
          <p class="head">选择以下支付方式付款</p>
          <div class="item">
            <p>支付平台</p>
            <a class="btn wx" href="javascript:"></a>
            <a
              class="btn alipay"
              :href="payUrl"
              target="_blank"
              @click="paying = true"
            ></a>
          </div>
          <div class="item">
            <p>支付方式</p>
            <a class="btn" href="javascript:">招商银行</a>
            <a class="btn" href="javascript:">工商银行</a>
            <a class="btn" href="javascript:">建设银行</a>
            <a class="btn" href="javascript:">农业银行</a>
            <a class="btn" href="javascript:">交通银行</a>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
  <XtxDialog title="正在支付..." v-model:visible="paying">
    <div class="pay-wait">
      <img src="@/assets/images/load.gif" alt="" />
      <div v-if="info">
        <p>如果支付成功：</p>
        <RouterLink :to="`/member/order/${info.id}`">查看订单详情></RouterLink>
        <p>如果支付失败：</p>
        <RouterLink to="/">查看相关疑问></RouterLink>
      </div>
    </div>
  </XtxDialog>
</template>
<script>
import AppLayout from "@/components/AppLayout";
import { useRoute } from "vue-router";
import { ref } from "vue";
import { getOrderInfoById } from "@/api/order";
import dayjs from "dayjs";
import useCountDown from "@/hooks/useCountDown";
import { baseURL } from "@/utils/request";
export default {
  name: "PayPage",
  components: { AppLayout },
  setup() {
    //  路由信息
    const route = useRoute();
    //  订单信息
    const info = ref(null);
    const { count, start } = useCountDown();
    // 支付结果回调地址
    // 回调地址必须经过编码, 否则回调时地址中 # 号后面的内容将支付宝被截取掉
    // 比如: http://www.corho.com:8080/?payResult=true&orderId=1440510371952594945#/
    const redirect = encodeURIComponent(
      "http://www.corho.com:8080/#/pay/callback"
    );
    // 跳转到支付地址
    const payUrl = `${baseURL}pay/aliPay?orderId=${route.query.orderId}&redirect=${redirect}`;
    // 是否正在支付
    const paying = ref(false);
    //  根据订单id 获取订单信息
    getOrderInfoById(route.query.orderId).then((data) => {
      //  存储订单信息
      info.value = data.result;
      start(data.result.countdown);
    });
    return { info, count, dayjs, payUrl, paying };
  },
};
</script>
<style scoped lang="less">
.pay-info {
  background: #fff;
  display: flex;
  align-items: center;
  height: 240px;
  padding: 0 80px;
  .icon {
    font-size: 80px;
    color: #1dc779;
  }
  .tip {
    padding-left: 10px;
    flex: 1;
    p {
      &:first-child {
        font-size: 20px;
        margin-bottom: 5px;
      }
      &:last-child {
        color: #999;
        font-size: 16px;
      }
    }
  }
  .amount {
    span {
      &:first-child {
        font-size: 16px;
        color: #999;
      }
      &:last-child {
        color: @priceColor;
        font-size: 20px;
      }
    }
  }
}
.pay-type {
  margin-top: 20px;
  background-color: #fff;
  padding-bottom: 70px;
  p {
    line-height: 70px;
    height: 70px;
    padding-left: 30px;
    font-size: 16px;
    &.head {
      border-bottom: 1px solid #f5f5f5;
    }
  }
  .btn {
    width: 150px;
    height: 50px;
    border: 1px solid #e4e4e4;
    text-align: center;
    line-height: 48px;
    margin-left: 30px;
    color: #666666;
    display: inline-block;
    &.active,
    &:hover {
      border-color: @xtxColor;
    }
    &.alipay {
      background: url(https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/7b6b02396368c9314528c0bbd85a2e06.png)
        no-repeat center / contain;
    }
    &.wx {
      background: url(https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/c66f98cff8649bd5ba722c2e8067c6ca.jpg)
        no-repeat center / contain;
    }
  }
}
.pay-wait {
  display: flex;
  justify-content: space-around;
  p {
    margin-top: 30px;
    font-size: 14px;
  }
  a {
    color: @xtxColor;
  }
}
</style>

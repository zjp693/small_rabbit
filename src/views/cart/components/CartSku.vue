<template>
  <div class="cart-sku" ref="target">
    <div class="attrs" @click="toggle">
      <span class="ellipsis">{{ attrsText }}</span>
      <i class="iconfont icon-angle-down"></i>
    </div>
    <div class="layer" v-if="visible">
      <div class="loading" v-if="loadingSku"></div>
      <GoodsSku
        v-if="!loadingSku"
        :skuId="skuId"
        :specs="specsAndSkus.specs"
        :skus="specsAndSkus.skus"
        @on-spec-changed="onSpecChanged"
      />
      <XtxButton
        @click="submitSku"
        v-if="specsAndSkus"
        type="primary"
        size="mini"
        style="margin-left: 60px"
      >
        确定
      </XtxButton>
    </div>
  </div>
</template>
<script>
import { ref } from "vue";
import { onClickOutside } from "@vueuse/core";
import { getSkuInfoBySkuId } from "@/api/cart";
import GoodsSku from "@/views/goods/components/GoodsSku";
import XtxButton from "@/components/library/XtxButton";
import Message from "@/components/library/Message";
import store from "@/store";

export default {
  name: "CartSku",
  components: { XtxButton, GoodsSku },
  props: {
    attrsText: {
      type: String,
      default: "",
    },
    skuId: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    //供用户选择的规格选项数据 所有可组合的规格组合
    const specsAndSkus = ref(null);
    //sku 数据的加载状态
    const loadingSku = ref(false);
    //  控制规格弹框层的显示与隐藏
    const visible = ref(false);
    // 获取弹层容器
    const target = ref(null);
    //显示
    const show = async () => {
      visible.value = true;
      // 更新加载状态
      loadingSku.value = true;
      // 获取 sku 数据
      let data = await getSkuInfoBySkuId(props.skuId);
      // 存储sku数据
      specsAndSkus.value = data.result;
      // 更新加载状态
      loadingSku.value = false;
    };
    // 隐藏
    const hide = () => {
      visible.value = false;
    };
    //切换
    const toggle = () => {
      visible.value ? hide() : show();
    };
    //在规格外部点击时
    onClickOutside(target, () => {
      //  如果规格弹框是显示的，就让他隐藏
      visible.value && hide();
    });
    //存储用户选择的新商品规格
    let userSelectedNewSku = null;
    //监听规格信息变化
    const onSpecChanged = (sku) => {
      userSelectedNewSku = sku;
    };
    //提交规格
    const submitSku = () => {
      console.log(userSelectedNewSku);
      //  如果用户没有重新选择规格，或者用户选择了规格，但是选择的规格和之前是一样
      if (
        !userSelectedNewSku ||
        (userSelectedNewSku && userSelectedNewSku.skuId === props.skuId)
      ) {
        //  用户提示
        Message({ type: "warn", text: "商品规格信息没有发生变化" });
        return;
      }
      store
        .dispatch("cart/updateGoodsOfCartBySkuChanged", {
          oldSkuId: props.skuId,
          userSelectedNewSku,
        })
        .then(() => {
          Message({ type: "success", text: "商品规格信息修改成功" });
        })
        .catch(() => {
          Message({ type: "error", text: "商品规格信息修改失败" });
        });
      hide();
    };
    return {
      visible,
      target,
      toggle,
      specsAndSkus,
      loadingSku,
      onSpecChanged,
      submitSku,
    };
  },
};
</script>
<style scoped lang="less">
.cart-sku {
  height: 28px;
  border: 1px solid #f5f5f5;
  padding: 0 6px;
  position: relative;
  margin-top: 10px;
  display: inline-block;
  .attrs {
    line-height: 24px;
    display: flex;
    span {
      max-width: 230px;
      font-size: 14px;
      color: #999;
    }
    i {
      margin-left: 5px;
      font-size: 14px;
    }
  }
  .layer {
    position: absolute;
    left: -1px;
    top: 40px;
    z-index: 10;
    width: 400px;
    border: 1px solid @xtxColor;
    box-shadow: 2px 2px 4px lighten(@xtxColor, 50%);
    background: #fff;
    border-radius: 4px;
    font-size: 14px;
    padding: 20px;
    &::before {
      content: "";
      width: 12px;
      height: 12px;
      border-left: 1px solid @xtxColor;
      border-top: 1px solid @xtxColor;
      position: absolute;
      left: 12px;
      top: -8px;
      background: #fff;
      transform: scale(0.8, 1) rotate(45deg);
    }
    .loading {
      height: 224px;
      background: url(../../../assets/images/loading.gif) no-repeat center;
    }
  }
}
</style>

<template>
  <div class="xtx-number-box">
    <div class="label">{{ label }}</div>
    <div class="number-box">
      <a href="javascript:" @click="onNumberChangeHandler(-1)">-</a>
      <input type="text" readonly :value="number" />
      <a href="javascript:" @click="onNumberChangeHandler(1)">+</a>
    </div>
  </div>
</template>
<script>
import { useVModel } from "@vueuse/core";

export default {
  name: "XtxNumberBox",
  props: {
    modelValue: {
      type: Number,
      default: 1,
    },
    max: {
      type: Number,
      default: 1,
    },
    label: {
      type: String,
      default: "",
    },
  },
  setup(props, { emit }) {
    //实现双向数据绑定
    const number = useVModel(props, "modelValue", emit);
    //用于改变商品数量的方法
    const onNumberChangeHandler = (step) => {
      const nextNumber = number.value + step;
      if (nextNumber < 1) {
        number.value = 1;
      } else if (number > props.max) {
        number.value = props.max;
      } else {
        number.value = nextNumber;
      }
    };
    return { number, onNumberChangeHandler };
  },
};
</script>
<style scoped lang="less">
.xtx-number-box {
  display: flex;
  align-items: center;
  .label {
    width: 60px;
    color: #999;
    padding-left: 10px;
  }
  .number-box {
    width: 120px;
    height: 30px;
    border: 1px solid #e4e4e4;
    display: flex;
    > a {
      width: 29px;
      line-height: 28px;
      text-align: center;
      background: #f8f8f8;
      font-size: 16px;
      color: #666;
      &:first-of-type {
        border-right: 1px solid #e4e4e4;
      }
      &:last-of-type {
        border-left: 1px solid #e4e4e4;
      }
    }
    > input {
      width: 60px;
      padding: 0 5px;
      text-align: center;
      color: #666;
    }
  }
}
</style>

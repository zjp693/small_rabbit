<template>
  <div class="xtx-checkbox" @click="toggle">
    <i class="iconfont icon-checked" v-if="isChecked"></i>
    <i class="iconfont icon-unchecked" v-else></i>
    <!--    如果插槽存在内容 $slots.default 为了真 否则为假-->
    <span v-if="$slots.default"> <slot></slot> </span>
  </div>
</template>
<script>
// import { watch } from "vue";
import { useVModel } from "@vueuse/core";

export default {
  name: "XtxCheckbox",
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
  },

  setup(props, { emit }) {
    // useVModel 实现双向数据绑定
    // 将 props 中的 modelValue 实现双向数据绑定
    // useModel 的返回值是一个新的响应式数据, 可以在当前模板中直接使用
    const isChecked = useVModel(props, "modelValue", emit);
    // console.log(isChecked);
    //  更改复选框中状态
    const toggle = () => {
      //取反
      isChecked.value = !isChecked.value;
      // console.log(isChecked.value);
      //  监听内部值的变化,将其同步给内部值
      // emit("update:modelValue", isChecked.value);
    };
    //监听外部值的变化，将其同步到内部值
    // watch(
    //   () => props.modelValue,
    //   () => {
    //     isChecked.value = props.modelValue;
    //   }
    // );
    return { isChecked, toggle };
  },
};
</script>
<style scoped lang="less">
.xtx-checkbox {
  display: inline-block;
  margin-right: 2px;
  .icon-checked {
    color: @xtxColor;
    ~ span {
      color: @xtxColor;
    }
  }
  i {
    position: relative;
    top: 1px;
  }
  span {
    margin-left: 2px;
  }
}
</style>

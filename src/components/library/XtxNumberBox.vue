<template>
  <div class="xtx-number-box">
    <div class="label">数量</div>
    <div class="number-box">
      <a href="javascript:">-</a>
      <input type="text" readonly value="1" />
      <a href="javascript:">+</a>
    </div>
  </div>
</template>
<script>
export default {
  name: "XtxNumberBox",
  props: {
    modelValue: {
      type: Number,
      default: 1,
    },
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

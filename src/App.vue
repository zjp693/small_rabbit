<template>
  <!--  <div classname="box">-->
  <RouterView></RouterView>
  <!--  </div>-->
  <!--  <XtxConfirm title="测试标题" content="测试内容" />-->
  <!--  <XtxConfirm></XtxConfirm>-->
  <!--  <button @click="showMessage">showMessage</button>-->
  <!--  <button @click="$message({ type: 'warn', text: '测试' })">buttton</button>-->
  <!--  <button @click="show">button</button>-->
  <!--  <XtxDialog title="对话框标题">-->
  <!--    <template v-slot:default> 对话框中的提示信息 </template>-->
  <!--    <template v-slot:footer>-->
  <!--      <XtxButton type="gray" style="margin-right: 20px">取消</XtxButton>-->
  <!--      <XtxButton type="primary">确认</XtxButton>-->
  <!--    </template>-->
  <!--  </XtxDialog>-->
</template>

<script>
import Message from "@/components/library/Message";
// import XtxConfirm from "@/components/library/XtxConfirm";
import { getCurrentInstance } from "vue";
export default {
  setup() {
    const showMessage = () => {
      Message({ type: "success", text: "登录成功" });
    };
    getCurrentInstance();
    return { showMessage };
  },
  methods: {
    show() {
      this.$message({ type: "error", text: "我还是测试" });
    },
  },
};
</script>

<style scoped lang="less">
//.box {
//  width: 100000px;
//  height: 10000px;
//}
</style>

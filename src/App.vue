<template>
  <!--  <div classname="box">-->
  <RouterView></RouterView>
  <!--  </div>-->
  <!--  <button @click="showMessage">showMessage</button>-->
  <!--  <button @click="$message({ type: 'warn', text: '测试' })">buttton</button>-->
  <!--  <button @click="show">button</button>-->
</template>

<script>
import Message from "@/components/library/Message";
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

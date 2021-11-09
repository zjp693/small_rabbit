<template>
  <div>{{ user }}</div>
  <button @click="onclickHandler">按钮</button>
  <button @click="onclickHandler" />
</template>

<script>
import { useStore } from "vuex";
export default {
  setup() {
    //  获取store对象
    const store = useStore();
    //点击事件
    const onclickHandler = () => {
      //  设置用户信息
      store.commit("user/setUser", { token: "test" });
    };
    //获取用户的信息
    const user = store.state.user;
    return { onclickHandler, user };
  },
};
</script>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>

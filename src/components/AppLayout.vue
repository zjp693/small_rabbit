<template>
  <AppTopNav></AppTopNav>
  <AppHeader></AppHeader>
  <AppHeaderSticky></AppHeaderSticky>
  <slot></slot>
  <AppFooter></AppFooter>
</template>

<script>
import AppTopNav from "@/components/AppTopNav";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import { useStore } from "vuex";
import AppHeaderSticky from "@/components/AppHeaderSticky";

export default {
  name: "AppLayout",
  components: { AppTopNav, AppHeader, AppFooter, AppHeaderSticky },
  setup() {
    //获取store对象
    const store = useStore();
    //发送请求获取分类数据
    store.dispatch("category/getCategories");
  },
};
</script>

<style scoped lang="less"></style>

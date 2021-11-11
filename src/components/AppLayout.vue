<template>
  <AppTopNav></AppTopNav>
  <AppHeader></AppHeader>
  <slot></slot>
  <AppFooter></AppFooter>
</template>

<script>
import AppTopNav from "@/components/AppTopNav";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";

export default {
  name: "AppLayout",
  components: { AppTopNav, AppHeader, AppFooter },
};
</script>

<style scoped></style>

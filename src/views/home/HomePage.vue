<template>
  <AppLayout>
    <div class="container">
      <HomeCategory></HomeCategory>
      <HomeBanner></HomeBanner></div
  ></AppLayout>
</template>

<script>
import AppLayout from "@/components/AppLayout";
import HomeCategory from "@/views/home/components/HomeCategory";
import HomeBanner from "@/views/home/components/HomeBanner";

export default {
  name: "Home",
  components: { AppLayout, HomeCategory, HomeBanner },
};
</script>

<style></style>

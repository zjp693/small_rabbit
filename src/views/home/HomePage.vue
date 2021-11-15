<template>
  <AppLayout>
    <div class="container">
      <HomeCategory></HomeCategory></div
  ></AppLayout>
</template>

<script>
import AppLayout from "@/components/AppLayout";
import HomeCategory from "@/views/home/components/HomeCategory";

export default {
  name: "Home",
  components: { AppLayout, HomeCategory },
};
</script>

<style></style>

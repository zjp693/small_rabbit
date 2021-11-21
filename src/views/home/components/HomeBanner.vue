<template>
  <div class="home-banner">
    <template v-if="banners">
      <XtxCarousel :carousels="banners" :autoPlay="true" />
    </template>
  </div>
</template>
<script>
import { useBanners } from "@/hooks/useBanners";

export default {
  name: "HomeBanner",
  setup() {
    const { banners, getData } = useBanners();
    getData(1);
    return { banners };
  },
};
</script>
<style scoped lang="less">
.home-banner {
  width: 1240px;
  height: 500px;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 98;
  .xtx-carousel {
    :deep(.carousel-btn.prev) {
      left: 270px;
    }
    :deep(.carousel-indicator) {
      padding-left: 250px;
    }
  }
}
</style>

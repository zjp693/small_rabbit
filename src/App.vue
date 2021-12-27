<template>
  <RouterView></RouterView>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    const current = ref();
    return { current };
  },
};
</script>

<style scoped lang="less"></style>

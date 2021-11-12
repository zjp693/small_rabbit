<template>
  <div class="home-category">
    <ul class="menu">
      <li v-for="i in 10" :key="i">
        <RouterLink to="/">居家</RouterLink>
        <RouterLink to="/">洗漱</RouterLink>
        <RouterLink to="/">清洁</RouterLink>
      </li>
    </ul>
  </div>
</template>

<script>
// import { useStore } from "vuex";
// import { ref } from "vue";

export default {
  name: "HomeCategory",
  setup() {
    //  获取store 对象
    // const store = useStore();
    //  存储品牌
    // const brand = ref({
    //   id: "",
    // });
    return {};
  },
};
</script>
<style scoped lang="less">
.home-category {
  width: 250px;
  height: 500px;
  background: rgba(0, 0, 0, 0.8);
  position: relative;
  z-index: 99;
  .menu {
    li {
      padding-left: 40px;
      height: 50px;
      line-height: 50px;
      &:hover {
        background-color: @xtxColor;
      }
      a {
        margin-right: 4px;
        color: #fff;
        &:first-child {
          font-size: 16px;
        }
      }
    }
  }
}
</style>

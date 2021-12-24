<template>
  <div class="member-home">
    <AppMemberLayout>
      <MemberHomeOverview />
      <MemberHomePanel title="我的收藏" v-if="collection">
        <GoodsItem
          v-for="item in collection.items"
          :key="item.id"
          :goods="item"
        ></GoodsItem>
      </MemberHomePanel>
      <MemberHomePanel title="我的足迹"></MemberHomePanel>
      <GoodsRelevant />
    </AppMemberLayout>
  </div>
</template>
<script>
import MemberHomeOverview from "@/views/member/home/components/MemberHomeOverview";
import MemberHomePanel from "@/views/member/home/components/MemberHomePanel";
import GoodsRelevant from "@/views/goods/components/GoodsRelevant";
import AppMemberLayout from "@/components/AppMemberLayout";

import { ref } from "vue";
import { getCollection } from "@/api/member";
import GoodsItem from "@/views/category/components/GoodsItem";
export default {
  name: "MemberHomePage",
  components: {
    GoodsItem,
    AppMemberLayout,
    GoodsRelevant,
    MemberHomePanel,
    MemberHomeOverview,
  },
  setup() {
    //  获取收藏数据
    const collection = useCollection();
    console.log(collection);
    return { collection };
  },
};
function useCollection() {
  //  用于存储收藏数据
  const collection = ref();
  //  获取并存储数据
  getCollection({ pageSize: 4 }).then((data) => {
    collection.value = data.result;
  });
  //返回收藏数据
  return collection;
}
</script>
<style scoped lang="less">
.member-home {
  :deep(.xtx-carousel) .carousel-btn.prev {
    left: 5px;
  }
  :deep(.xtx-carousel) .carousel-btn.next {
    right: 5px;
  }
}
</style>

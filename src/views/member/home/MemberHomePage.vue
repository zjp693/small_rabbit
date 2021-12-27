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
      <MemberHomePanel title="我的足迹" v-if="browseHistory">
        <GoodsItem
          v-for="item in browseHistory.items"
          :key="item.id"
          :goods="item"
        ></GoodsItem>
      </MemberHomePanel>
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
import { getBrowseHistory, getCollection } from "@/api/member";
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
    const { collection, browseHistory } = useCollection();
    return { collection, browseHistory };
  },
};
function useCollection() {
  //  用于存储收藏数据
  const collection = ref();
  //用于存储足迹数据
  const browseHistory = ref();
  //  获取并存储数据
  getCollection({ pageSize: 4 }).then((data) => {
    collection.value = data.result;
  });
  getBrowseHistory({ pageSize: 4 }).then((data) => {
    browseHistory.value = data.result;
    console.log(browseHistory.value);
  });
  //返回收藏数据
  return { collection, browseHistory };
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

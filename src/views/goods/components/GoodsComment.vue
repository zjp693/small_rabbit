<template>
  <div class="goods-comment">
    <div class="head" v-if="commentInfo">
      <div class="data">
        <p>
          <span>{{ commentInfo.salesCount }}</span
          ><span>人购买</span>
        </p>
        <p>
          <span>{{ commentInfo.praisePercent }}</span
          ><span>好评率</span>
        </p>
      </div>
      <div class="tags">
        <div class="dt">大家都在说：</div>
        <div class="dd">
          <a
            v-for="tag in commentInfo.tags"
            :key="tag.title"
            href="javascript:"
            :class="{ active: currentTagTitle === tag.title }"
            @click="
              currentTagTitle = tag.title;
              updateReqParams({ tag: tag.title });
            "
            >{{ tag.title }} ({{ tag.tagCount }})
          </a>
        </div>
      </div>
    </div>
    <div class="sort">
      <span>排序：</span>
      <a
        @click="updateReqParams({ sortField: '' })"
        href="javascript:"
        class="active"
        >默认</a
      >
      <a
        @click="updateReqParams({ sortField: 'createTime' })"
        href="javascript:"
        >最新</a
      >
      <a
        @click="updateReqParams({ sortField: 'praiseCount' })"
        href="javascript:"
        >最热</a
      >
    </div>
    <div class="list" v-if="commentList">
      <div class="item" v-for="item in commentList.items" :key="item.id">
        <div class="user">
          <img :src="item.member.avatar" alt="" />
          <span>{{ formatNickname(item.member.nickname) }}</span>
        </div>
        <div class="body">
          <div class="score">
            <!--            此处由于 i 标记通过两个for 遍历生成的，将索引作为key值-->
            <i
              class="iconfont icon-wjx01"
              v-for="i in item.score"
              :key="i + 's'"
            ></i>
            <i
              class="iconfont icon-wjx02"
              v-for="i in 5 - item.score"
              :key="i + 'k'"
            ></i>
            <span class="attr">{{ formatArray(item.orderInfo.specs) }}</span>
          </div>
          <div class="text">
            <!--            图片预览组件-->
            {{ item.content }}

            <GoodsCommentImage
              v-if="item.pictures.length > 0"
              :pictures="item.pictures"
            ></GoodsCommentImage>
          </div>
          <div class="time">
            <span>{{ item.createTime }}</span>
            <span class="zan"><i class="iconfont icon-dianzan"></i>100</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ref, watch } from "vue";
import GoodsCommentImage from "@/views/goods/components/GoodsCommentImage";
import { onBeforeRouteUpdate, useRoute } from "vue-router";
import { getCommentInfo, getCommentList } from "@/api/goods";

export default {
  name: "GoodsComment",
  components: { GoodsCommentImage },
  setup() {
    const { commentInfo, currentTagTitle } = useGoodCommentInfo();
    console.log(currentTagTitle.value);
    const {
      commentList,
      formatArray,
      formatNickname,
      reqParams,
      updateReqParams,
    } = useCommentList();
    return {
      commentInfo,
      currentTagTitle,
      commentList,
      formatArray,
      formatNickname,
      reqParams,
      updateReqParams,
    };
  },
};
//获取
function useGoodCommentInfo() {
  const commentInfo = ref();
  const currentTagTitle = ref("全部评论");
  const route = useRoute();
  const getData = (id) => {
    getCommentInfo(id).then((data) => {
      // 每个商品的评论头部信息中都会包含 '全部评价' 和 '有图'
      // 但是接口数据中不包含, 所以需要手动添加
      data.result.tags.unshift(
        {
          title: "全部评论",
          tagCount: data.result.evaluateCount,
        },
        {
          title: "有图",
          tagCount: data.result.hasPictureCount,
        }
      );
      commentInfo.value = data.result;
    });
  };
  getData(route.params.id);
  onBeforeRouteUpdate((to) => getData(to.params.id));
  return { commentInfo, currentTagTitle };
}
//获取评论数据
function useCommentList() {
  const route = useRoute();
  const commentList = ref(null);
  //格式化 商品属性信息
  const formatArray = (specs) => {
    // console.log(specs);
    return specs.map((spec) => `${spec.name}:${spec.nameValue}`).join(" ");
  };
  //格式化用户呢称
  const formatNickname = (nickname) => {
    return nickname.substr(0, 1) + "****" + nickname.substr(-1);
  };
  //用于存储请求参数（页码，筛选条件，排序条件）
  const reqParams = ref({
    //商品id
    page: route.params.id,
    //是否有图
    hasPicture: false,
    //评价字段
    tag: "",
    // praiseCount 最热, createTime 最新
    //排序字段
    sortField: "",
  });
  //用于更新请求参数
  const updateReqParams = (params) => {
    // console.log(params, reqParams.value);
    //  如果用户选择的是评价标签 单独处理
    if (params.tag) {
      reqParams.value = {
        ...reqParams.value,
        hasPicture: params.tag === "有图",
        tag:
          params.tag === "全部评论" || params.tag === "有图" ? "" : params.tag,
      };

      // //  如果评论有图
      // if (params.tag === "有图") {
      //   //  将hasPicture 设置 ture
      //   reqParams.value.hasPicture = true;
      // } else {
      //   //  用户选择的不是有图，将hasPicture 设置为false
      //   reqParams.value.hasPicture = false;
      //   //  如果选择的是全部
      //   if (params.tag === "全部评价") {
      //     //将tag 随着为空字符串
      //     reqParams.value.tag = "";
      //   } else {
      //     // 其他的标签 用户选择什么设置什么
      //     reqParams.value.tag = params.tag;
      //   }
      // }
    } else {
      //  排序选项
      reqParams.value = {
        ...reqParams.value,
        ...params,
      };
      // 当筛选条件发生变化后重置页码
      reqParams.value.page = 1;
    }
  };

  const getData = (id) => {
    getCommentList(id).then((data) => {
      commentList.value = data.result;
      // console.log(commentList);
    });
  };
  watch(
    () => reqParams.value,
    () => {
      //  重新获取评论
      getData();
    },
    {
      immediate: true,
    }
  );
  getData(route.params.id);
  onBeforeRouteUpdate((to) => getData(to.params.id));

  return {
    commentList,
    formatArray,
    formatNickname,
    reqParams,
    updateReqParams,
  };
}
</script>
<style scoped lang="less">
.goods-comment {
  .head {
    display: flex;
    padding: 30px 0;
    .data {
      width: 340px;
      display: flex;
      padding: 20px;
      p {
        flex: 1;
        text-align: center;
        //background-color: #cf4444;
        span {
          display: block;
          &:first-child {
            font-size: 32px;
            color: @priceColor;
          }
          &:last-child {
            color: #999;
          }
        }
      }
    }
    .tags {
      flex: 1;
      display: flex;
      border-left: 1px solid #f5f5f5;
      .dt {
        font-weight: bold;
        width: 100px;
        text-align: right;
        line-height: 42px;
      }
      .dd {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        > a {
          width: 132px;
          height: 42px;
          margin-left: 20px;
          margin-bottom: 20px;
          border-radius: 4px;
          border: 1px solid #e4e4e4;
          background: #f5f5f5;
          color: #999;
          text-align: center;
          line-height: 40px;
          &:hover {
            border-color: @xtxColor;
            background: lighten(@xtxColor, 50%);
            color: @xtxColor;
          }
          &.active {
            border-color: @xtxColor;
            background: @xtxColor;
            color: #fff;
          }
        }
      }
    }
  }
  .sort {
    height: 60px;
    line-height: 60px;
    border-top: 1px solid #f5f5f5;
    border-bottom: 1px solid #f5f5f5;
    margin: 0 20px;
    color: #666;
    > span {
      margin-left: 20px;
    }
    > a {
      margin-left: 30px;
      &.active,
      &:hover {
        color: @xtxColor;
      }
    }
  }
  .list {
    padding: 0 20px;
    .item {
      display: flex;
      padding: 25px 10px;
      border-bottom: 1px solid #f5f5f5;
      .user {
        width: 160px;
        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
        }
        span {
          padding-left: 10px;
          color: #666;
        }
      }
      .body {
        flex: 1;
        .score {
          line-height: 40px;
          .iconfont {
            color: #ff9240;
            padding-right: 3px;
          }
          .attr {
            padding-left: 10px;
            color: #666;
          }
        }
      }
      .text {
        color: #666;
        line-height: 24px;
      }
      .time {
        color: #999;
        display: flex;
        justify-content: space-between;
        margin-top: 5px;
      }
    }
  }
}
</style>

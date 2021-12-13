<template>
  <nav class="app-top-nav">
    <div class="container">
      <ul>
        <template v-if="user.profile.token">
          <li>
            <a href="javascript:"
              ><i class="iconfont icon-user"></i>{{ user.profile.account }}</a
            >
          </li>

          <li><a @click="logout" href="javascript:">退出登录</a></li></template
        >
        <template v-else>
          <li>
            <a><router-link to="/login">请先登录</router-link></a>
          </li>
          <li><a href="javascript:">免费注册</a></li></template
        >
        <li><a href="javascript:">我的订单</a></li>
        <li><a href="javascript:">会员中心</a></li>
        <li><a href="javascript:">帮助中心</a></li>
        <li><a href="javascript:">关于我们</a></li>
        <li>
          <a href="javascript:"><i class="iconfont icon-phone"></i>手机版</a>
        </li>
      </ul>
    </div>
  </nav>
</template>
<script>
import { useStore } from "vuex";
import { useRouter } from "vue-router";
export default {
  name: "AppTopNav",
  setup() {
    const store = useStore();
    const router = useRouter();
    const user = store.state.user;
    // 退出登录
    // 1. 清除 store 中的 user/profile (localStorage 中的也会跟着清除)
    // 2. 跳转到登录页
    const logout = () => {
      store.commit("user/setUser", {});
      router.push("/login");
    };
    return { user, logout };
  },
};
</script>
<style scoped lang="less">
.app-top-nav {
  background: #333;
  ul {
    display: flex;
    height: 53px;
    justify-content: flex-end;
    align-items: center;
    li {
      a {
        padding: 0 15px;
        color: #cdcdcd;
        line-height: 1;
        display: inline-block;
        i {
          font-size: 14px;
          margin-right: 2px;
        }
        &:hover {
          color: @xtxColor;
        }
      }
      ~ li {
        a {
          border-left: 2px solid #666;
        }
      }
    }
  }
}

.app-header-nav {
  width: 820px;
  display: flex;
  justify-content: space-around;
  padding-left: 40px;
  position: relative;
  z-index: 998;

  > li {
    margin-right: 40px;
    width: 38px;
    text-align: center;

    > a {
      font-size: 16px;
      line-height: 32px;
      height: 32px;
      display: inline-block;
    }

    &:hover {
      > a {
        color: @xtxColor;
        border-bottom: 1px solid @xtxColor;
      }

      > .layer {
        height: 132px;
        opacity: 1;
      }
    }
  }
}
</style>

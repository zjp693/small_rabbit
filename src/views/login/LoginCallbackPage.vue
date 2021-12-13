<template>
  <LoginHeader>联合登录</LoginHeader>
  <!-- 加载提示 -->
  <section class="container" v-if="loading">
    <div class="unbind">
      <div class="loading"></div>
    </div>
  </section>
  <!-- 原有-->
  <section class="container" v-if="!loading && !isBind">
    <nav class="tab">
      <a
        @click="hasAccount = true"
        :class="{ active: hasAccount }"
        href="javascript:"
      >
        <i class="iconfont icon-bind"></i>
        <span>已有小兔鲜账号，请绑定手机</span>
      </a>
      <a
        href="javascript:"
        @click="hasAccount = false"
        :class="{ active: !hasAccount }"
      >
        <i class="iconfont icon-edit"></i>
        <span>没有小兔鲜账号，请完善资料</span>
      </a>
    </nav>
    <div class="tab-content" v-if="hasAccount">
      <LoginCallbackBindPhone :unionId="unionId"></LoginCallbackBindPhone>
    </div>
    <div class="tab-content" v-if="!hasAccount">
      <LoginCallbackPatch></LoginCallbackPatch>
    </div>
  </section>
  <LoginFooter />
</template>

<script>
import LoginHeader from "@/views/login/components/LoginHeader";
import LoginFooter from "@/views/login/components/LoginFooter";
import LoginCallbackBindPhone from "@/views/login/components/LoginCallbackBindPhone";
import LoginCallbackPatch from "@/views/login/components/LoginCallbackPatch";
import { ref } from "vue";
import { findAccountByQQOpenid } from "@/api/user";
import useLoginAfter from "@/hooks/useLoginAfter";

export default {
  name: "LoginCallbackPage",
  components: {
    LoginFooter,
    LoginHeader,
    LoginCallbackBindPhone,
    LoginCallbackPatch,
  },
  setup() {
    const { loginSuccessful } = useLoginAfter();
    //切换
    const hasAccount = ref(true);
    //假设该用户已经使用 qq 绑定了账号
    const isBind = ref(false);
    const loading = ref(false);
    // 用于存储 openid
    const unionId = ref("");
    //获取QQ联合中和登录相关的API
    const Login = window.QC.Login;
    //检测 地址栏中是否存在 access_token
    if (Login.check()) {
      loading.value = true;
      //  1.获取地址栏中的access_token 值
      //  2.向QQ互联网发送请求使用 access_tolen 换取用户的唯一标识 openId
      Login.getMe((openid) => {
        // console.log(openid);
        //  检测QQ绑定到账号
        findAccountByQQOpenid({ unionId: openid })
          .then(loginSuccessful)
          .catch(() => {
            // 用户没有使用QQ绑定账号
            isBind.value = false;
            loading.value = false;
          });
      });
    }

    return {
      hasAccount,
      Login,
      isBind,
      loading,
      unionId,
    };
  },
};
</script>

<style scoped lang="less">
.container {
  padding: 25px 0;
}
.tab {
  background: #fff;
  height: 80px;
  padding-top: 40px;
  font-size: 18px;
  text-align: center;
  a {
    color: #666;
    display: inline-block;
    width: 350px;
    line-height: 40px;
    border-bottom: 2px solid #e4e4e4;
    i {
      font-size: 22px;
      vertical-align: middle;
    }
    span {
      vertical-align: middle;
      margin-left: 4px;
    }
    &.active {
      color: @xtxColor;
      border-color: @xtxColor;
    }
  }
}
.tab-content {
  min-height: 600px;
  background: #fff;
}
.container {
  padding: 25px 0;
  position: relative;
  height: 730px;
  .unbind {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    padding: 25px 0;
    z-index: 99;
    .loading {
      height: 100%;
      background: #fff url(../../assets/images/load.gif) no-repeat center /
        100px 100px;
    }
  }
}
</style>

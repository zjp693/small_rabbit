<template>
  <div class="account-box">
    <div class="toggle">
      <button v-if="isMsgLogin" @click="isMsgLogin = false">
        <i class="iconfont icon-user"></i> 使用账号登录
      </button>
      <button v-if="!isMsgLogin" @click="isMsgLogin = true">
        <i class="iconfont icon-msg"></i> 使用短信登录
      </button>
    </div>
    <div class="form">
      <!-- 账户登录 -->
      <template v-if="!isMsgLogin">
        <form @submit.prevent="onAccountFormSubmit">
          <div class="form-item">
            <div class="input">
              <i class="iconfont icon-user"></i>
              <input
                v-model="accountField"
                type="text"
                placeholder="请输入用户名"
              />
            </div>
            <div class="error" v-if="accountError">
              <i class="iconfont icon-warning">{{ accountError }}</i>
            </div>
          </div>
          <div class="form-item">
            <div class="input">
              <i class="iconfont icon-lock"></i>
              <input
                v-model="passwordField"
                type="password"
                placeholder="请输入密码"
              />
            </div>
            <div class="error" v-if="passwordError">
              <i class="iconfont icon-warning">{{ passwordError }}</i>
            </div>
          </div>
          <div class="form-item">
            <div class="agree">
              <XtxCheckbox v-model="isAgreeField" />
              <span>我已同意</span>
              <a href="javascript:">《隐私条款》</a>
              <span>和</span>
              <a href="javascript:">《服务条款》</a>
            </div>
            <div class="error" v-if="isAgreeError">
              <i class="iconfont icon-warning">{{ isAgreeError }}</i>
            </div>
          </div>
          <button type="submit" class="btn">登录</button>
        </form>
      </template>
      <!-- 短信登录 -->
      <template v-if="isMsgLogin">
        <form @submit.prevent="onMsgFormSubmit">
          <div class="form-item">
            <div class="input">
              <i class="iconfont icon-user"></i>
              <input
                v-model="mobileField"
                type="text"
                placeholder="请输入手机号"
              />
            </div>
            <div class="error" v-if="mobileError">
              <i class="iconfont icon-warning">{{ mobileError }}</i>
            </div>
          </div>
          <div class="form-item">
            <div class="input">
              <i class="iconfont icon-code"></i>
              <input
                v-model="codeField"
                type="password"
                placeholder="请输入验证码"
              />
              <span
                class="code"
                :class="{ disabled: count !== 0 }"
                @click="getMsgCode()"
              >
                {{ count === 0 ? "发送验证码" : `剩余${count}秒` }}
              </span>
              <!--              <span class="code" @click="getMsgCode">发送验证码</span>-->
            </div>
            <div class="error" v-if="codeError">
              <i class="iconfont icon-warning">{{ codeError }}</i>
            </div>
          </div>
          <div class="form-item">
            <div class="agree">
              <XtxCheckbox v-model="isMsgAgreeField" />
              <span>我已同意</span>
              <a href="javascript:">《隐私条款》</a>
              <span>和</span>
              <a href="javascript:">《服务条款》</a>
            </div>
            <div class="error" v-if="isMsgAgreeError">
              <i class="iconfont icon-warning">{{ isMsgAgreeError }}</i>
            </div>
          </div>
          <button type="submit" class="btn">登录</button>
        </form>
      </template>
    </div>
    <div class="action">
      <a
        href="https://graph.qq.com/oauth2.0/show?which=Login&display=pc&client_id=100556005&response_type=token&scope=all&redirect_uri=http%3A%2F%2Fwww.corho.com%3A8080%2F%23%2Flogin%2Fcallback"
      >
        <img
          src="https://qzonestyle.gtimg.cn/qzone/vas/opensns/res/img/Connect_logo_7.png"
          alt=""
        />
      </a>

      <div class="url">
        <a href="javascript:">忘记密码</a>
        <a href="javascript:">免费注册</a>
      </div>
    </div>
  </div>
</template>
<script>
import { ref } from "vue";
import { useField, useForm } from "vee-validate";
// 创建表单验证对象
import {
  account,
  isAgree,
  password,
  mobile,
  code,
} from "@/utils/vee-validate-schema";
import {
  getLoginMsgCode,
  loginByAccountAndPassword,
  loginByMobileMsgCode,
} from "@/api/user";
import useLoginAfter from "@/hooks/useLoginAfter";
import Message from "@/components/library/Message";
import useCountDown from "@/hooks/useCountDown";

export default {
  name: "LoginForm",
  methods: {
    showMessage() {
      this.$message({ type: "wan", text: "测试" });
    },
  },
  setup() {
    // 是否为短信登录 默认为 false 因为页面中默认显示的是账户登录
    const isMsgLogin = ref(false);
    //获取表单的登录表单的验证相关数据
    const { handleAccountFormSubmit, ...accountForm } =
      useAccountFormValidate();
    //获取表单验证的相关数据
    const { msgFormHandleSubmit, getMobileIsValidate, ...msgForm } =
      useMsgFormValidate();
    // 获取登录成功回调函数和登录失败回调函数
    const { loginSuccessful, loginFailed } = useLoginAfter();
    const { count, start } = useCountDown();
    // 获取验证码
    const getMsgCode = async () => {
      // 对手机号进行验证
      const { isValid, mobile } = await getMobileIsValidate();
      // 验证码发送成功后开启倒计时
      start(60);
      if (isValid) {
        try {
          // 发送请求获取手机验证码
          await getLoginMsgCode(mobile);
          // 验证码发送成功提示
          Message({ type: "success", text: "验证码发送成功" });
        } catch (error) {
          // 验证码发送失败提示
          Message({ type: "error", text: error.response.data.message });
        }
      }
    };
    //处理账号表单登录
    const onAccountFormSubmit = handleAccountFormSubmit(
      ({ account, password }) => {
        //回调函数会表单验证通过以后执行
        loginByAccountAndPassword({ account, password })
          // 登录成功
          .then(loginSuccessful)
          //  登录失败
          .catch(loginFailed);
      }
    );

    //处理短信登录表单
    const onMsgFormSubmit = msgFormHandleSubmit(({ mobile, code }) => {
      loginByMobileMsgCode({ mobile, code })
        // 登录成功
        .then(loginSuccessful)
        // 登录失败
        .catch(loginFailed);
    });

    return {
      isMsgLogin,
      ...accountForm,
      onAccountFormSubmit,
      ...msgForm,
      onMsgFormSubmit,
      getMsgCode,
      count,
    };
  },
};
//用于验证账号密码表单
function useAccountFormValidate() {
  const { handleSubmit: handleAccountFormSubmit } = useForm({
    validationSchema: {
      account,
      password,
      isAgree,
    },
  });
  //  验证
  const { value: accountField, errorMessage: accountError } =
    useField("account");
  const { value: passwordField, errorMessage: passwordError } =
    useField("password");
  const { value: isAgreeField, errorMessage: isAgreeError } =
    useField("isAgree");
  return {
    accountField,
    accountError,
    passwordField,
    passwordError,
    isAgreeField,
    isAgreeError,
    handleAccountFormSubmit,
  };
}
//用于短信验证表单
function useMsgFormValidate() {
  const { handleSubmit: msgFormHandleSubmit } = useForm({
    validationSchema: { mobile, code, isAgree },
  });

  //短信登录验证
  const {
    value: mobileField,
    errorMessage: mobileError,
    validate: mobileValidate,
  } = useField("mobile");
  const { value: codeField, errorMessage: codeError } = useField("code");
  const { value: isMsgAgreeField, errorMessage: isMsgAgreeError } =
    useField("isAgree");
  // 单独验证用户是否输入了手机号
  // 获取手机号是否验证通过
  const getMobileIsValidate = async () => {
    // 验证手机号, 获取验证结果
    let { valid } = await mobileValidate();
    // 返回验证结果
    return { isValid: valid, mobile: mobileField.value };
  };
  return {
    mobileField,
    mobileError,
    codeField,
    codeError,
    msgFormHandleSubmit,
    isMsgAgreeField,
    isMsgAgreeError,
    getMobileIsValidate,
  };
}
</script>
<style lang="less" scoped>
.account-box {
  .toggle {
    padding: 15px 40px;
    text-align: right;
    button {
      color: @xtxColor;
      background: none;
      border: none;
      cursor: pointer;
      i {
        font-size: 14px;
      }
    }
  }
  .form {
    padding: 0 40px;
    &-item {
      margin-bottom: 28px;
      .input {
        position: relative;
        height: 36px;
        > i {
          width: 34px;
          height: 34px;
          background: #cfcdcd;
          color: #fff;
          position: absolute;
          left: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 18px;
        }
        input {
          padding-left: 44px;
          border: 1px solid #cfcdcd;
          height: 36px;
          line-height: 36px;
          width: 100%;
          &.error {
            border-color: @priceColor;
          }
          &.active,
          &:focus {
            border-color: @xtxColor;
          }
        }
        .code {
          position: absolute;
          right: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 14px;
          background: #f5f5f5;
          color: #666;
          width: 90px;
          height: 34px;
          cursor: pointer;
        }
        .code.disabled {
          cursor: wait;
        }
      }
      > .error {
        position: absolute;
        font-size: 12px;
        line-height: 28px;
        color: @priceColor;
        i {
          font-size: 14px;
          margin-right: 2px;
        }
      }
    }
    .agree {
      a {
        color: #069;
      }
    }
    .btn {
      display: block;
      width: 100%;
      height: 40px;
      color: #fff;
      text-align: center;
      line-height: 40px;
      background: @xtxColor;
      border: none;
      &.disabled {
        background: #cfcdcd;
      }
    }
  }
  .action {
    padding: 20px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .url {
      a {
        color: #999;
        margin-left: 10px;
      }
    }
  }
}
</style>

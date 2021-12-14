<template>
  <form class="xtx-form" @submit="onSubmitHandler">
    <div class="user-info">
      <img :src="avatar" alt="" />
      <p>Hi，{{ nickname }} 欢迎来小兔鲜，完成绑定后可以QQ账号一键登录哦~</p>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-phone"></i>
        <input
          class="input"
          type="text"
          v-model="mobileField"
          placeholder="绑定的手机号"
        />
      </div>
      <div class="error" v-if="mobileError">{{ mobileError }}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-code"></i>
        <input
          class="input"
          v-model="codeField"
          type="text"
          placeholder="短信验证码"
        />
        <span class="code" @click="getMsgCode">{{
          count === 0 ? "发送验证码" : `剩余${count}秒`
        }}</span>
      </div>
      <div class="error" v-if="codeError">{{ codeError }}</div>
    </div>
    <input type="submit" class="submit" value="立即绑定" />
  </form>
</template>

<script>
import { ref } from "vue";
import { useField, useForm } from "vee-validate";
import { mobile, code } from "@/utils/vee-validate-schema";
import Message from "@/components/library/Message";
import useCountDown from "@/hooks/useCountDown";
import useLoginAfter from "@/hooks/useLoginAfter";
import { bindMobileAndQQ, getBindMobileMsgCode } from "@/api/user";
export default {
  name: "LoginCallbackBindPhone",
  props: {
    unionId: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    // / 获取登录成功的回调函数和登录失败的回调函数
    const { loginSuccessful, loginFailed } = useLoginAfter();
    //获取qq 用户信息
    const { handleSubmit, getMobileIsValidate, ...bindPhoneValid } =
      useBindPhoneFormValid();
    const { nickname, avatar } = useQQUserInfo();
    //表单提交
    const onSubmitHandler = handleSubmit((values) => {
      // 将手机号和QQ号进行绑定
      // 绑定成功即登录成功
      bindMobileAndQQ({ ...values, unionId: props.unionId })
        .then(loginSuccessful)
        .catch(loginFailed);
    });

    //获取倒计时
    const { count, start, isActive } = useCountDown();
    //验证码
    const getMsgCode = async () => {
      let { isValid, mobile } = await getMobileIsValidate();

      //用户输入了手机号通过了验证
      if (isValid && !isActive.value) {
        try {
          await getBindMobileMsgCode(mobile);
          Message({ type: "success", text: "验证码发送成功" });
          // 开启倒计时
          start(60);
        } catch (error) {
          Message({
            type: "error",
            text: `验证码发送失败 ${error.response.data.message}`,
          });
        }
      }
    };
    return {
      nickname,
      avatar,
      handleSubmit,
      getMobileIsValidate,
      ...bindPhoneValid,
      onSubmitHandler,
      getMsgCode,
      count,
    };
  },
};

//  获取qq用户的昵称 和 头像
function useQQUserInfo() {
  //  获取qq互联对象
  const QC = window.QC;
  //  获取QQ 用户昵称
  const nickname = ref("");
  //  获取QQ 用户头像
  const avatar = ref("");
  //  检测地址栏中是否存在access_token
  if (QC.Login.check()) {
    //  向QQ 互联服务器中发送请求获取QQ用户的信息
    QC.api("get_user_info").success((response) => {
      //  存储qq用户昵称
      nickname.value = response.data.nickname;
      //  存储qq用户头像
      avatar.value = response.data.figureurl_1;
    });
  }
  return {
    nickname,
    avatar,
  };
}

//表单验证
function useBindPhoneFormValid() {
  // 创建表单验证对象
  const { handleSubmit } = useForm({
    validationSchema: { mobile, code },
  });
  // 手机号验证
  const {
    value: mobileField,
    errorMessage: mobileError,
    validate,
  } = useField("mobile");
  // 验证码验证
  const { value: codeField, errorMessage: codeError } = useField("code");

  // 单独验证手机号
  const getMobileIsValidate = async () => {
    const { valid } = await validate();
    return { isValid: valid, mobile: mobileField.value };
  };
  return {
    handleSubmit,
    mobileField,
    mobileError,
    codeField,
    codeError,
    getMobileIsValidate,
  };
}
</script>

<style scoped lang="less">
.user-info {
  width: 320px;
  height: 70px;
  display: flex;
  background: #f2f2f2;
  align-items: center;
  padding: 0 10px;
  margin: 0 auto 20px;
  img {
    background: #f2f2f2;
    width: 50px;
    height: 50px;
  }
  p {
    padding-left: 10px;
  }
}
.code {
  position: absolute;
  right: 0;
  top: 0;
  line-height: 50px;
  width: 80px;
  color: #999;
  &:hover {
    cursor: pointer;
  }
}
</style>

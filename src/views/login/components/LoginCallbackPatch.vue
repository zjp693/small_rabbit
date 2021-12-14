<template>
  <form class="xtx-form" @submit="onSubmitHandler">
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-user"></i>
        <input
          class="input"
          type="text"
          v-model="checkUserAccountField"
          placeholder="请输入用户名"
        />
      </div>
      <div class="error" v-if="checkUserAccountError">
        {{ checkUserAccountError }}
      </div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-phone"></i>
        <input
          class="input"
          type="text"
          v-model="mobileField"
          placeholder="请输入手机号"
        />
      </div>
      <div class="error">{{ mobileError }}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-code"></i>
        <input
          class="input"
          type="text"
          v-model="codeField"
          placeholder="请输入验证码"
        />
        <span class="code" @click="getMsgCode">{{
          isActive ? `剩余${count}秒` : "发送验证码"
        }}</span>
      </div>
      <div class="error" v-if="codeError">{{ codeError }}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-lock"></i>
        <input
          class="input"
          type="password"
          v-model="passwordField"
          placeholder="请输入密码"
        />
      </div>
      <div class="error" v-if="passwordError">{{ passwordError }}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-lock"></i>
        <input
          class="input"
          type="password"
          v-model="rePasswordField"
          placeholder="请确认密码"
        />
      </div>
      <div class="error" v-if="rePasswordError">{{ rePasswordError }}</div>
    </div>
    <input type="submit" class="submit" value="立即绑定" />
  </form>
</template>

<script>
import { useField, useForm } from "vee-validate";
import {
  checkUserAccount,
  code,
  mobile,
  password,
  rePassword,
} from "@/utils/vee-validate-schema";
import { getRegisterMsgCode } from "@/api/user";
import Message from "@/components/library/Message";
import useCountDown from "@/hooks/useCountDown";

export default {
  name: "LoginCallbackBindPatch",
  setup() {
    //获取表单处理的方法，将其他属性单独放入的对象中
    const { handleSubmit, getMobileIsValidate, ...rest } =
      useBindNewAccountFormValid();
    const onSubmitHandler = handleSubmit((values) => {
      console.log(values);
    });
    //获取倒计时
    const { start, count, isActive } = useCountDown();
    //发送验证码
    const getMsgCode = () => {
      //如果倒计时正在执行，阻止程序向下执行
      if (isActive.value) return;
      //验证是否通过
      getMobileIsValidate().then(({ isValid, mobile }) => {
        //  如果手机号通过验证
        //发送验证 提示用户当前的操作是否成功
        if (isValid)
          getRegisterMsgCode(mobile)
            .then(() => {
              Message({ type: "success", text: "验证码发送成功" });
              //  开启倒计时
              start(60);
            })
            .cache(() => {
              Message({
                type: "error",
                text: `验证码发送失败`,
              });
            });
      });
    };
    return { onSubmitHandler, getMsgCode, ...rest, count, isActive };
  },
};
function useBindNewAccountFormValid() {
  //创建表单验证的对象
  const { handleSubmit } = useForm({
    validationSchema: { checkUserAccount, mobile, code, password, rePassword },
  });
  //验证对象
  const { value: checkUserAccountField, errorMessage: checkUserAccountError } =
    useField("checkUserAccount");
  const {
    value: mobileField,
    errorMessage: mobileError,
    validate: mobileValidate,
  } = useField("mobile");
  const { value: codeField, errorMessage: codeError } = useField("code");
  const { value: passwordField, errorMessage: passwordError } =
    useField("password");
  const { value: rePasswordField, errorMessage: rePasswordError } =
    useField("rePassword");
  //单独验证手机号
  const getMobileIsValidate = async () => {
    const { valid } = await mobileValidate();
    return { isValid: valid, mobile: mobileField };
  };
  return {
    handleSubmit,
    checkUserAccountField,
    checkUserAccountError,
    mobileField,
    mobileError,
    codeField,
    codeError,
    passwordField,
    passwordError,
    rePasswordField,
    rePasswordError,
    getMobileIsValidate,
  };
}
</script>

<style scoped lang="less">
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

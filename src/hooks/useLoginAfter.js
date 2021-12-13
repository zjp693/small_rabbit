import { useStore } from "vuex";
import Message from "@/components/library/Message";
import { useRouter } from "vue-router";

export default function useLoginAfter() {
  // 获取 store 对象
  const store = useStore();
  // 获取 router 对象
  const router = useRouter();
  // 登录成功之后做的事情
  const loginSuccessful = ({ result }) => {
    // 存储用户信息
    store.commit("user/setUser", {
      // 用户id
      id: result.id,
      // 用户头像
      avatar: result.avatar,
      // 用户昵称
      nickname: result.nickname,
      // 用户账号
      account: result.account,
      // 用户手机号
      mobile: result.mobile,
      // 用户登录凭证
      token: result.token,
    });
    // 跳转到首页
    router.push("/").then(() => {
      // 登录成功之后的提示信息
      Message({ type: "success", text: "登录成功" });
    });
  };
  // 登录失败之后做的事情
  const loginFailed = (error) => {
    // 登录失败之后的提示信息
    Message({ type: "error", text: error.response.data.message });
  };

  return { loginSuccessful, loginFailed };
}

export default {
  // 使用具有命名空间的 vuex 模块
  namespaced: true,
  // 返回该模块下存储的应用状态
  state() {
    return {
      // 用户信息
      profile: {
        // 用户id
        id: "",
        // 用户头像
        avatar: "",
        // 用户昵称
        nickname: "",
        // 用户账号
        account: "",
        // 用户手机号
        mobile: "",
        // 用户登录凭证
        token: "",
      },
    };
  },
  mutations: {
    /**
     *设置用户信息
     * @param state 状态对象
     * @param user 用户信息
     */
    setUser(state, user) {
      //判断 users是否是空对象
      if (Object.keys(user).length !== 0) {
        //不是空的对象的情况，表示要进行有用户信息的修改
        state.profile = { ...state.profile, ...user };
      } else {
        //是空对象，表示要进行用户信息的清除
        state.profile = {};
      }
    },
  },
};

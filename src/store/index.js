import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";
import user from "@/store/user";
import cart from "@/store/cart";
import category from "@/store/category";
const store = createStore({
  modules: {
    user,
    cart,
    category,
  },
  plugins: [
    createPersistedState({
      // // 数据存储在 localStorage 时的 key
      // key: "rabbit-client-pc",
      // // 指定将哪些模块中的数据同步到本地
      // paths: ["user", "cart"],
      //  数据存储在localStorage 时的key
      key: "rabbit-client-pc",
      //  指定将哪些模块中的数据同步到本地
      paths: ["user", "cart"],
    }),
  ],
});

export default store;

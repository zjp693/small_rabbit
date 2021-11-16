import { getCategoriesApi } from "@/api/home";
import { topCategories } from "@/api/constants";

export default {
  // 使用具有命名空间的 vuex 模块
  namespaced: true,
  state() {
    return {
      // 存储分类列表
      list: topCategories.map((name) => ({ name })),
    };
  },
  mutations: {
    setCategories(state, payload) {
      state.list = payload;
    },
    //控制下拉菜单的显示
    open(state, id) {
      const index = state.list.findIndex((item) => item.id === id);
      state.list[index].open = true;
    },
    //控制下拉菜单的显示
    close(state, id) {
      const index = state.list.find((item) => item.id === id);
      index.open = false;
    },
  },
  actions: {
    //获取分类数据
    getCategories({ commit }) {
      getCategoriesApi().then((data) => {
        // console.log(data);
        //为每一个一级分类数据添加open 属性，用于控制其对应的二级分类下拉菜单的显示与隐藏
        data.result.forEach((item) => item.open === false);
        //将数据存储在vuex中
        commit("setCategories", data.result);
        //添加open 属性
      });
    },
  },
};

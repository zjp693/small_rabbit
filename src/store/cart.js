import { updateLocalCart } from "@/api/cart";

export default {
  namespaced: true,
  state() {
    return {
      //  存储购物车列表
      list: [],
    };
  },
  mutations: {
    //添加商品
    addGoodsToCart(state, goods) {
      //  查看当前添加的商品是否已在购物车中，通过findIndex 去查找
      const index = state.list.findIndex((item) => item.skuId === goods.skuId);
      if (index > -1) {
        //  已经存在商品 数量累加
        state.list[index].count += goods.count;
        //  将该商品添加到购物车的顶部
        state.list.unshift(state.list.splice(index, 1)[0]);
        // console.log(state.list);
      } else {
        //  不存在该商品  直接将商品添加到购物车列表的顶部
        state.list.unshift(goods);
      }
    },
    //  删除商品    // 根据 skuId 删除商品
    deleteGoodsOfCartBySkuId(state, skuId) {
      //  获取要被删除的商品索引
      const index = state.list.findIndex((item) => item.skuId === skuId);
      //  删除商品
      state.list = [...state.list.slice(0, index)];
    },
    //  根据skuId 更新商品信息
    //  注意:partOfGoods 中必须有skuId,但是服务端返回的数据中是没有的
    updateGoodsBySkuId(state, partOfGoods) {
      //  console.log(partOfGoods);
      //  根据 skuId 查找商品
      let index = state.list.findIndex(
        (item) => item.skuId === partOfGoods.skuId
      );
      //  商品存在
      state.list[index] = {
        ...state.list[index],
        ...partOfGoods,
      };
    },
  },
  actions: {
    //  购物车添加商品
    addGoodsToCart({ rootState, commit }, goods) {
      //  如果要加入购物车的商品已经在购物车 累加该商品的数量
      //  新添加的商品放置在购物车列表的顶部
      //  判断用户是否登录，如果登录 操作服务端购物车 如果没有登录 操作本地购物车
      if (rootState.user.profile.token) {
        //  已登录
      } else {
        //未登录
        commit("addGoodsToCart", goods);
      }
    },
    //  购物车删除商品
    deleteGoodsOfCartBySkuId({ rootState, commit }, payload) {
      //  判断用户是否已登录
      if (rootState.user.profile.token) {
        console.log(payload);
        //  已登录
      } else {
        //  未登录
        commit("deleteGoodsOfCartBySkuId", payload);
      }
    },
    //  更新购物车的商品
    updateCartList({ rootState, state, commit }) {
      if (rootState) {
        //  登录
      } else {
        //  未登录
        //  遍历购物车中的商品 发送请求获取该商品的最新消息
        const cartListPromises = state.lit.map(({ skuId, id }) =>
          updateLocalCart({ skuId, id })
        );
        //  批量获取多个请求响应数据，所有的响应数据被存储在一个数据中
        Promise.all(cartListPromises).then((dataCollection) => {
          dataCollection.forEach((data, index) => {
            //  为添加数据 skuId
            data.result.skuId = state.list[index].skuId;
            //  更新本地的商品数据
            commit("updateGoodsBySkuId", data.result);
          });
        });
      }
    },
    //  更新购物车商品（one ） (支持商品数量和选中状态)
    updateGoodsOfCartBySkuId({ commit, rootState }, goods) {
      // console.log(goods);
      if (rootState.user.profile.token) {
        //  登录
      } else {
        //  未登录
        commit("updateGoodsBySkuId", goods);
      }
    },
    //  全选和全不选
    selectIsAll({ rootState, getters, commit }, isAll) {
      if (rootState.user.profile.token) {
        //  登录
      } else {
        //  未登录
        getters.effectiveGoodsList.forEach((item) => {
          commit("updateGoodsBySkuId", { skuId: item.skuId, selected: isAll });
          // console.log(isAll);
        });
      }
    },
    //  删除购物车 商品
  },
  getters: {
    //  可购买商品列表（有效商品 + 商品库存数量大于0）
    effectiveGoodsList(state) {
      return state.list.filter((item) => item.isEffective && item.stock > 0);
    },
    //  可购买商品总价
    effectiveGoodsCount(state, getters) {
      return getters.effectiveGoodsList.reduce(
        (count, item) => count + item.count,
        0
      );
    },
    //  可购买商品数量
    effectiveGoodsPrice(state, getters) {
      return getters.effectiveGoodsList.reduce(
        (price, item) => price + Number(item.nowPrice) * item.count,
        0
      );
    },
    //  不可购买的商品
    invalidGoodsList(state) {
      return state.list.filter((item) => !item.isEffective || item.stock === 0);
    },
    //  用户选择的商品列表
    userSelectedGoodsList(state, getters) {
      return getters.effectiveGoodsList.filter((item) => item.selected);
    },
    //  用户选择的商品数量
    userSelectedGoodsCount(state, getters) {
      return getters.userSelectedGoodsList.reduce((count, item) => {
        return item.count + count;
      }, 0);
    },
    // 用户选择的商品总价
    userSelectedGoodsPrice(state, getters) {
      return getters.userSelectedGoodsList
        .reduce((price, item) => {
          return price + Number(item.nowPrice) * item.count;
        }, 0)
        .toFixed(2);
    },
    // 全选、全不选按钮的状态
    selectAllButtonStatus(state, getters) {
      // 有效商品的数量和选中商品的数量相等意味着所有有效商品已选中
      // 并且有效商品数量必须大于 0
      return (
        getters.effectiveGoodsList.length > 0 &&
        getters.userSelectedGoodsList.length ===
          getters.effectiveGoodsList.length
      );
    },
  },
};

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
        console.log(state.list);
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
        //  已登录
      } else {
        //  未登录
        commit("deleteGoodsOfCartBySkuId", payload);
      }
    },
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
  },
};

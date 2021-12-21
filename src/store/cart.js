import {
  addGoodsToCart,
  deleteGoodsOfCartBySkuIds,
  getCartList,
  mergeCart,
  selectOrUnselectCartGoods,
  updateGoodsOfCartBySkuId,
  updateLocalCart,
} from "@/api/cart";

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
    //  设置购物车列表
    setCart(state, payload) {
      state.list = payload;
    },
  },
  actions: {
    //  购物车添加商品
    async addGoodsToCart({ rootState, commit, dispatch }, goods) {
      //  如果要加入购物车的商品已经在购物车 累加该商品的数量
      //  新添加的商品放置在购物车列表的顶部
      //  判断用户是否登录，如果登录 操作服务端购物车 如果没有登录 操作本地购物车
      if (rootState.user.profile.token) {
        //  已登录
        await addGoodsToCart({
          skuId: goods.skuId,
          count: goods.count,
        });
        //更新
        // 更新购物车列表
        dispatch("updateCartList");
      } else {
        //未登录
        commit("addGoodsToCart", goods);
      }
    },
    //  购物车删除商品
    async deleteGoodsOfCartBySkuId({ rootState, commit, dispatch }, payload) {
      //  判断用户是否已登录
      if (rootState.user.profile.token) {
        //  已登录
        await deleteGoodsOfCartBySkuIds([payload]);
        //  商品列表
        dispatch("updateCartList");
      } else {
        //  未登录
        commit("deleteGoodsOfCartBySkuId", payload);
      }
    },
    //  更新购物车的商品
    async updateCartList({ rootState, state, commit }) {
      if (rootState) {
        //  登录
        // 获取服务器端购物车列表数据
        let data = await getCartList();
        //  将服务端购物车列表存储到 vuex 中
        commit("setCart", data.result);
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
    async updateGoodsOfCartBySkuId({ commit, rootState, dispatch }, goods) {
      // console.log(goods);
      if (rootState.user.profile.token) {
        //  登录
        //  更新商品信息
        await updateGoodsOfCartBySkuId(goods);
        //更新购物车列表
        dispatch("updateCartList");
      } else {
        //  未登录
        commit("updateGoodsBySkuId", goods);
      }
    },
    // 商品规格信息发生变化, 更新商品信息
    async updateGoodsOfCartBySkuChanged(
      { rootState, state, commit },
      { oldSkuId, userSelectedNewSku }
    ) {
      if (rootState.user.profile.token) {
        //  登录
        //  查找原有商品信息，通过原有商品信息获取用户选择的商品数据
        const oldGoods = state.list.find((item) => item.skuId === oldSkuId);
        //  删除原有商品
        await addGoodsToCart({
          skuId: userSelectedNewSku.skuId,
          count: oldGoods.count,
        });
      } else {
        //  未登录
        //  先根据旧的skuID 查找商品，根据旧的商品生成新的商品 输出旧的商品，插入新的商品
        //  查找旧商品
        const oldGoods = state.list.find((item) => item.skuId === oldSkuId);
        //  生成新的商品
        const newGoods = {
          ...oldGoods,
          skuId: userSelectedNewSku.skuId,
          stock: userSelectedNewSku.inventory,
          oldPrice: userSelectedNewSku.oldPrice,
          nowPrice: userSelectedNewSku.price,
          attrsText: userSelectedNewSku.specsText,
        };
        // 删除旧的商品
        commit("deleteGoodsOfCartBySkuId", oldSkuId);
        //  插入新的商品
        commit("addGoodsToCart", newGoods);
      }
    },
    //  全选和全不选
    async selectIsAll({ rootState, getters, commit, dispatch }, isAll) {
      if (rootState.user.profile.token) {
        //  登录
        //获取商品 sukId 数组
        const ids = getters.effectiveGoodsList.map((item) => item.skuId);
        // 发送请求全选或者全不选
        await selectOrUnselectCartGoods({ ids, selected: isAll });
        //更新购物车商品列表
        dispatch("updateCartList");
      } else {
        //  未登录
        getters.effectiveGoodsList.forEach((item) => {
          commit("updateGoodsBySkuId", { skuId: item.skuId, selected: isAll });
          // console.log(isAll);
        });
      }
    },
    //  删除用户选择的商品,清空无效商品
    async deleteGoodsOfCartByUserSelectedOrInvalid(
      { getters, rootState, commit, dispatch },
      flag
    ) {
      if (rootState.user.profile.token) {
        //  登录
        //  获取要批量的删除商品的 skuId 数组
        const skuId = getters[flag].map((item) => item.skuId);
        // 发送请求 批量删除商品
        await deleteGoodsOfCartBySkuIds(skuId);
        //  更新商品列表
        dispatch("updateCartList");
      } else {
        //  未登录
        getters[flag].forEach((item) => {
          commit("deleteGoodsOfCartBySkuId", item.skuId);
        });
      }
    },
    //  合并购物车
    async mergeCart({ state, commit }) {
      //如果本地购物车中没有数据 不用进行合并
      if (state.list.length === 0) return;
      //  准备合并购物车接口所需的数据
      const carts = state.list.map((item) => ({
        skuId: item.skuId,
        selected: item.selected,
        count: item.count,
      }));
      try {
        //  合并购物车
        await mergeCart(carts);
        //  清空本地购物车
        commit("setCart", []);
      } catch (error) {
        //  购物车合并失败 抛出异常
        throw new Error(error);
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

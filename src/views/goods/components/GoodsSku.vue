<template>
  <div class="goods-sku">
    <dl v-for="item in specs" :key="item.id">
      <dt>{{ item.name }}</dt>
      <dd>
        <template v-for="value in item.values" :key="value.name">
          <img
            v-if="value.picture"
            :class="{ selected: value.selected, disabled: value.disabled }"
            :src="value.picture"
            :alt="value.name"
            @click="updateSpecSelected(item, value)"
          />

          <span
            @click="updateSpecSelected(item, value)"
            :class="{ selected: value.selected, disabled: value.disabled }"
            v-else
            >{{ value.name }}</span
          >
        </template>
      </dd>
    </dl>
  </div>
</template>
<script>
import bwPowerSet from "@/vendor/power-set";

export default {
  name: "GoodsSku",
  props: {
    //  供用户选择的规格选项数据
    specs: {
      type: Array,
      default: () => [],
    },
    //  所有可组合的规格组合
    skus: {
      type: Array,
      default: () => [],
    },
    skuId: {
      type: String,
      default: "",
    },
  },
  setup(props, { emit }) {
    //查询规格的查询对象
    const pathMap = createPathMap(props.skus);
    //初始化时更新规格按钮的禁选效果
    updateSpecDisabled(props.specs, pathMap);
    // 设置默认选中的规格组合
    setDefaultSelected(props.skuId, props.skus, props.specs);
    //  更新选中的规格的选中状态
    const updateSpecSelected = (spec, value) => {
      // 将数据回传到父组件
      // props.specs: 在组件中显示的供用户选择的规格选项, 使用它获取用户已经选择的规格名称
      // pathMap: 将获取到的规格名称以下划线组合, 组合后规格名称作为 pathMap 对象的属性可获取 skuId
      // props.skus: 通过 skuId 可以在 skus 规格数组中找到具体的规格对象信息
      // emit: 具体的规格对象信息获取到以后, 可以通过 emit 将信息传递到父组件
      //  如果按钮是禁选状态 直接返回不让用户更改当前规格的是否选中状态
      // sendDataToParent(props.specs, props.skus, emit, pathMap);
      if (value.disabled) return; //阻止程序的向下执行
      //如果用户点击的规格已经是选中的
      if (value.selected) {
        //  让其取消选中
        value.selected = false;
      } else {
        //  先将该规格中的所有的规格取消选中
        spec.values.forEach((item) => (item.selected = false));
        //  将当前的用户的点击的规格设置选中
        value.selected = true;
      }
      sendDataToParent(props.specs, props.skus, emit, pathMap);
      // 更新规格的禁用状态
      updateSpecDisabled(props.specs, pathMap);
    };
    //更新规格按钮的禁用状态
    function updateSpecDisabled(specs, pathMap) {
      //  约定在每一个规格数据中通过的disabled 属性标识禁用状态
      //  遍历规格数组
      specs.forEach((spec, index) => {
        //为什么要在此处获取用户的选择的规格？
        //在每一轮匹配的过程中，下面的循环都会向数组中动态添加值
        //在下一轮开始匹配前，获取到用户最初选中的规格和名称值
        const selected = getUserSelected(specs);
        //  遍历规格数组
        spec.values.forEach((value) => {
          //如果当前规格已经被选中了，说明他可以选，不需要被禁用
          if (value.selected) return;
          //将当前规格名称放入用户的=选择的规格数组名称中，待匹配
          selected[index] = value.name;
          //将selected数组中的 undefined 过滤掉 剩下的数组值使用 _ 进行拼接
          //如果用户未选择任何规格(组件初始化)，selected 数组中只会包含当前遍历的规格名称
          const key = selected.filter((item) => item).join("_");
          //如果在规格查询对象中不存在 key 属性，说明当前规格不能和用户选择的规格进行组合
          value.disabled = !(key in pathMap);
          //  设置具体的规格信息
          //  如果当前遍历的规格名称不在规格查询字典对象中，说明他需要被禁用
          // value.disabled = !(value.name in pathMap);
        });
      });
    }
    //获取用户险种的规格
    function getUserSelected(specs) {
      // 用于存储用户选择的规格
      const result = [];
      //  遍历商品规格集合
      specs.forEach((spec, index) => {
        //  当前规格中查找用户选择的规格
        const selected = spec.values.find((value) => value.selected);
        //  如果找到了
        if (selected) {
          //  将该规则放在他自己的位置上
          result[index] = selected.name;
        } else {
          //  如果没有找到，当前规格使用undefined 进行站位
          result[index] = undefined;
        }
      });
      // console.log(result, "==");
      //返回当前用户的选中的规格
      return result;
    }
    //设置默认选中的规格组合
    function setDefaultSelected(skuId, skus, specs) {
      // console.log(skuId);
      //如果skuId不存在，说明不需要
      if (!skuId) return;
      // console.log(skus);
      //  根据skuId 在规格集合中查找默认选中的规格对象
      //  然后遍历去其中的specs 返回规格名称数组
      const target = skus.find((sku) => sku.id === skuId);
      // console.log(target);
      // 将要选中的规格的名字存储到数组中
      const names = target.specs.map((spec) => spec.valueName);
      // 循环所有的规格选项;
      specs.forEach((spec) => {
        spec.values.forEach((value) => {
          if (names.includes(value.name)) {
            //如果当前规格选项的名称在 target 数组中
            //将它的选中状态设置为true
            value.selected = true;
          }
        });
      });
    }
    //将数据传回父组件
    function sendDataToParent(specs, skus, emit, pathMap) {
      // console.log(specs, skus, pathMap);
      //  获取到用户选择的规格组件名称数组
      const selected = getUserSelected(specs).filter((item) => item);

      //  判断用户是否选择了所有的规格
      if (selected.length === specs.length) {
        //  将规格名称以下划线进行组合 组合后将他作为pathMath对象的属性，已获取规格组合的skuid
        const skuId = pathMap[selected.join("_")];
        //  通过了 skuId 在规格集合中查找具体的规格对象信息
        const target = skus.find((sku) => sku.id === skuId);
        console.log(skuId, "skuIds", pathMap, selected);
        console.log(skus, "skus");
        console.log(target, "target");
        // //  触发自定义事件将规格信息传递到父组件
        emit("onSpecChanged", {
          skuId,
          price: target.price,
          oldPrice: target.oldPrice,
          inventory: target.inventory,
          specsText: target.specs
            .map((spec) => `${spec.name}: ${spec.valueName}`)
            .join(" "),
        });
      }
    }
    return { updateSpecSelected, pathMap };
  },
};
//创建查询规格对象
function createPathMap(skus) {
  //  skus:存储了所有的可以组合的规格集合，数组类型
  //  用于存储最终的规格查询对象
  const pathMap = {};
  //  遍历所有可组合的规格组合
  skus.forEach((sku) => {
    //  找到有库存的规格组合
    if (sku.inventory > 0) {
      //  将可组合的规格的名称临时存到一个数组中
      const valueNames = sku.specs.map((item) => item.valueName);
      //  截取当前商品的规格数量，后面将用于判断某个规格是否为完整的
      const max = sku.specs.length;
      //  获取规格集合的子级组合
      const sets = bwPowerSet(valueNames);
      //  遍历规格子级组合
      sets.forEach((set) => {
        //  将规格名称已 _ 进行拼接
        const key = set.join("_");
        //  判断当前的规格是否完整的
        const isCompleteSku = set.length === max;
        //  判断当前规格对象中是否存储了当前规格
        if (key && !pathMap[key]) {
          //  没有存储会进入这个判断
          //  如果当前规格是完整
          if (isCompleteSku) {
            pathMap[key] = sku.id;
          } else {
            //  如果当前规格是子级规格 不是完整的
            //  将当前规格组合的名称作为规格查询对象的属性
            pathMap[key] = null;
          }
        }
      });
    }
  });

  return pathMap;
}
</script>
<style scoped lang="less">
.sku-state-mixin () {
  border: 1px solid #e4e4e4;
  margin-right: 10px;
  cursor: pointer;
  margin-bottom: 10px;
  &.selected {
    border-color: @xtxColor;
  }
  &.disabled {
    opacity: 0.6;
    border-style: dashed;
    cursor: not-allowed;
  }
}
.goods-sku {
  padding-left: 10px;
  padding-top: 20px;
  dl {
    display: flex;
    padding-bottom: 5px;
    align-items: center;
    dt {
      width: 50px;
      color: #999;
    }
    dd {
      flex: 1;
      color: #666;
      > img {
        width: 50px;
        height: 50px;
        .sku-state-mixin ();
      }
      > span {
        display: inline-block;
        height: 30px;
        line-height: 28px;
        padding: 0 20px;
        .sku-state-mixin ();
      }
    }
  }
}
</style>

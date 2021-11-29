<template>
  <div class="xtx-city" ref="target">
    <div class="select" @click="toggle" :class="{ active: visible }">
      <span class="placeholder" v-if="!location">请选择配送地址</span>
      <span class="value" v-else>{{ location }}</span>
      <i class="iconfont icon-angle-down"></i>
    </div>
    <div class="option" v-if="visible">
      <!--      城市数据填充-->
      <template v-if="cityData">
        <span
          @click="updateSelectedCityData(item)"
          class="ellipsis"
          v-for="item in list"
          :key="item.id"
          >{{ item.name }}</span
        >
      </template>
      <template v-else>
        <div class="loading"></div>
      </template>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import { computed, reactive, ref } from "vue";
import { onClickOutside } from "@vueuse/core";

export default {
  name: "XtxCity",
  setup(props, { emit }) {
    // 控制下拉菜单的是否显示
    const visible = ref(false);
    //  用于获取下拉框的元素
    const target = ref(null);
    //用于存储城市数据
    const cityData = ref(null);
    //显示下拉菜单
    const show = () => {
      //获取城市数据
      getCityData().then((data) => {
        //  存储城市数据
        // console.log(data);
        cityData.value = data;
      });
      visible.value = true;
    };

    //隐藏下拉菜单
    const hide = () => {
      visible.value = false;
      //判断用户是否选择了完整的省市区
      if (selectedCityData.countyName) {
        location.value = `${selectedCityData.provinceName} ${selectedCityData.cityName} ${selectedCityData.countyName}`;
      }
      //  重置用户选择的城市数据
      for (const attr in selectedCityData) {
        selectedCityData[attr] = "";
      }
    };
    //切换下拉菜单的显示与隐藏
    const toggle = () => {
      visible.value ? hide() : show();
    };
    // //在下拉框之外点击是隐藏下拉框
    onClickOutside(target, () => {
      hide();
    });
    // 用于存储用户选择的城市数据
    const selectedCityData = reactive({
      provinceCode: "",
      cityCode: "",
      countyCode: "",
      provinceName: "",
      cityName: "",
      countyName: "",
      location: "",
    });
    //用于展示用户的省市区
    const location = ref(null);
    //用于供城市选择城市数据的放大
    const updateSelectedCityData = (data) => {
      // 存储省级数据
      if (data.level === 0) {
        selectedCityData.provinceCode = data.code;
        selectedCityData.provinceName = data.name;
        // 存储市级数据
      } else if (data.level === 1) {
        selectedCityData.cityCode = data.code;
        selectedCityData.cityName = data.name;
        //  存储县区数据
      } else {
        selectedCityData.countyCode = data.code;
        selectedCityData.countyName = data.name;
        selectedCityData.location = `${selectedCityData.provinceName} ${selectedCityData.cityName} ${selectedCityData.countyName}`;
      }
    };
    //  替换页面中的省市区数据
    const list = computed(() => {
      let list = cityData.value;
      // 如果用户选择了省级数据
      if (selectedCityData.provinceCode) {
        //将数据更新为市级数据
        list = list.find(
          (item) => item.code === selectedCityData.provinceCode
        ).areaList;
      }
      // 如果用户选择了市级数据
      if (selectedCityData.cityCode) {
        // 将数据替换为县区级数据
        list = list.find(
          (item) => item.code === selectedCityData.cityCode
        ).areaList;
      }
      // 如果用户选择了县区级数据
      if (selectedCityData.countyCode) {
        // 将用户选择的数据传递到组件外部
        emit("onCityChanged", { ...selectedCityData });
        // 重置组件需要城市数据
        list = cityData.value;
        // 隐藏弹框
        hide();
      }
      return list;
    });
    return {
      visible,
      target,
      toggle,
      cityData,
      selectedCityData,
      updateSelectedCityData,
      list,
      location,
    };
  },
};
//在window 对象中已经缓存了城市数据，从window对象中获取城市数据
window.cityData = null;
//获取城市数据
async function getCityData() {
  //  如果window 对象中已经缓存了城市数据 从window对象中获取城市数据
  if (window.cityData) return window.cityData;
  //  window对象中没有城市数据 向服务端发送请求获取城市数据
  let response = await axios.get(
    "https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json"
  );
  //  将城市数据缓存到window 对象中 ，并作为当前方法的返回值
  return (window.cityData = response.data);
}
</script>
<style scoped lang="less">
.xtx-city {
  display: inline-block;
  position: relative;
  z-index: 400;
  .select {
    border: 1px solid #e4e4e4;
    height: 30px;
    padding: 0 5px;
    line-height: 28px;
    cursor: pointer;
    &.active {
      background: #fff;
    }
    .placeholder {
      color: #999;
    }
    .value {
      color: #666;
      font-size: 12px;
    }
    i {
      font-size: 12px;
      margin-left: 5px;
    }
  }
  .option {
    width: 542px;
    border: 1px solid #e4e4e4;
    position: absolute;
    left: 0;
    top: 29px;
    background: #fff;
    min-height: 30px;
    line-height: 30px;
    display: flex;
    flex-wrap: wrap;
    padding: 10px;
    .loading {
      height: 290px;
      width: 100%;
      background: url(../../assets/images/loading.gif) no-repeat center;
    }
    > span {
      width: 130px;
      text-align: center;
      cursor: pointer;
      border-radius: 4px;
      padding: 0 3px;
      &:hover {
        background: #f5f5f5;
      }
    }
  }
}
</style>

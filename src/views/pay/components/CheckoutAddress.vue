<template>
  <div class="address">
    <div class="text">
      <div v-if="!finalAddress" class="none">
        您需要先添加收货地址才可提交订单。
      </div>
      <ul v-if="finalAddress">
        <li>
          <span>收<i />货<i />人：</span>{{ finalAddress.receiver }}
        </li>
        <li>
          <span>联系方式：</span
          >{{
            finalAddress.contact.replace(/(\d{3})\d{4}(\d{4})/g, `$1****$3`)
          }}
        </li>
        <li>
          <span>收货地址：</span>
          {{ finalAddress.fullLocation }}
          {{ finalAddress.address }}
        </li>
      </ul>
      <a href="javascript:" @click="modifyAddress()">修改地址</a>
    </div>
    <div class="action">
      <XtxButton class="btn" @click="switchAddress">切换地址</XtxButton>
      <AddressSwitch
        ref="addressSwitchInstance"
        :activeAddressId="finalAddress?.id"
        :list="addresses"
      ></AddressSwitch>
      <XtxButton class="btn" @click="addAddress">添加地址</XtxButton>
      <AddressEdit
        ref="addressEditInstance"
        @onAddressChanged="updateUserSelectedAddress($event)"
      ></AddressEdit>
    </div>
  </div>
</template>
<script>
import AddressEdit from "@/views/pay/components/AddressEdit";
import { computed, ref } from "vue";
import { getAddressList } from "@/api/order";
import AddressSwitch from "@/views/pay/components/AddressSwitch";
export default {
  name: "CheckoutAddress",
  components: { AddressSwitch, AddressEdit },
  setup() {
    //获取收货地址列表
    const { finalAddress, addresses } = getAddresses();
    //用于存储编辑收货地址 组件实例对象
    const addressEditInstance = ref();
    // 获取切换收货地址组件的实例对象
    const addressSwitchInstance = ref();
    //添加收货地址
    const addAddress = () => {
      //打开对话框
      addressEditInstance.value.visible = true;
      addressEditInstance.value.location = "";
      // 在每一次点击添加收货地址按钮的时候 清空表单
      addressEditInstance.value.address = {
        // 收货人姓名
        receiver: "",
        // 联系方式 手机号
        contact: "",
        // 详细地址
        address: "",
        // 邮政编码
        postalCode: "",
        // 地址标签
        addressTags: "",
        // 是否设置为默认的收货地址
        isDefault: false,
        // 省编码
        provinceCode: "",
        // 市编码
        cityCode: "",
        // 县区编码
        countyCode: "",
      };
    };
    //修改地址
    const modifyAddress = () => {
      console.log(addressEditInstance);
      // 获取当前要修改的收货地址信息
      const { fullLocation, isDefault, ...rest } = finalAddress.value;
      // 将要修改的收货地址信息显示在弹层中
      setTimeout(() => {
        addressEditInstance.value.location = fullLocation;
      }, 0);

      addressEditInstance.value.address = { ...rest };
      addressEditInstance.value.address.isDefault = isDefault === 0;
      // 显示弹层
      addressEditInstance.value.visible = true;
    };
    //切换收货的地址k949191
    const switchAddress = () => {
      addressSwitchInstance.value.visible = true;
    };
    return {
      addressEditInstance,
      addAddress,
      finalAddress,
      modifyAddress,
      switchAddress,
      addresses,
      addressSwitchInstance,
    };
  },
};
//  获取收货地址
function getAddresses() {
  //  用于存储收货地址
  const addresses = ref(null);
  //用于存储用户新增的收货地址或者切换的收货地址
  const userSelectedAddress = ref();
  //  用于获取收货地址
  const getData = () => {
    //获取并存储收获地址
    getAddressList().then((data) => {
      addresses.value = data.result;
    });
  };
  // 初始获取收货地址列表
  getData();
  const finalAddress = computed(() => {
    let result = null;
    //  如果用户添加了新收货地址 或者切换了收货地址
    if (userSelectedAddress.value) {
      // 优先渲染
      result = userSelectedAddress.value;
    } else {
      // 查看收货地址列表中是否存在收货地址
      if (addresses.value && addresses.value.length > 0) {
        // 渲染默认收货地址
        result = addresses.value.find((item) => item.isDefault === 0);
        // 如果默认收货地址不存在
        if (!result) {
          // 渲染收货地址列表中的第一条收货地址
          result = addresses.value[0];
        }
      }
    }
    return result;
  });

  // 用于更新用户添加的收货地址或者切换的收货地址
  const updateUserSelectedAddress = (id) => {
    getData(() => {
      userSelectedAddress.value = addresses.value.find(
        (item) => item.id === id
      );
    });
  };
  // 返回收货地址列表
  return { finalAddress, updateUserSelectedAddress, addresses };
}
</script>
<style scoped lang="less">
.address {
  border: 1px solid #f5f5f5;
  display: flex;
  align-items: center;
  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;
    .none {
      line-height: 90px;
      color: #999;
      text-align: center;
      width: 100%;
    }
    > ul {
      flex: 1;
      padding: 20px;
      li {
        line-height: 30px;
        span {
          color: #999;
          margin-right: 5px;
          > i {
            width: 0.5em;
            display: inline-block;
          }
        }
      }
    }
    > a {
      color: @xtxColor;
      width: 160px;
      text-align: center;
      height: 90px;
      line-height: 90px;
      border-right: 1px solid #f5f5f5;
    }
  }
  .action {
    width: 420px;
    text-align: center;
    .btn {
      width: 140px;
      height: 46px;
      line-height: 44px;
      font-size: 14px;
      &:first-child {
        margin-right: 10px;
      }
    }
  }
}
</style>

import lazy from "@/components/directive/lazy";
import Message from "@/components/library/Message";

// 1. 获取模块的路径集合 获取模块的导入函数
const importFn = require.context("./", false, /\.vue$/);
// 2. 获取要导入的文件的路径
const keys = importFn.keys();

export default {
  install(app) {
    app.directive("lazy", lazy);
    app.config.globalProperties.$message = Message;
    //批量注册组件
    //  遍历导入的文件的路径
    keys.forEach((item) => {
      //  动态导入组件
      const component = importFn(item).default;
      //  注册组件
      app.component(component.name, component);
    });
  },
};

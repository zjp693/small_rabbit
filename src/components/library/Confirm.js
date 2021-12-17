// 导入 XtxConfirm 单文件组件对象
import XtxConfirm from "@/components/library/XtxConfirm";
import { createVNode, render } from "vue";

//创建目标容器
const container = document.createElement("div");
document.body.appendChild(container);

export default function Confirm({ title = "温馨提示", content }) {
  return new Promise(function (resolve, reject) {
    // 当用户点击确认按钮时要执行的方法
    const onSureButtonClickHandler = () => {
      // 如果其他的开发者传递了确认逻辑 执行确认逻辑
      resolve();
      render(null, container);
    };
    // 当用户点击取消按钮时要执行的方法
    const onCancelButtonClickHandler = () => {
      console.log(1);
      reject();
      // 执行离场动画
      vNode.el.classList.remove("fade");
      vNode.el.children[0].classList.remove("fade");
      // 因为离场动画执行了 400ms, 所以此处指定 400ms 以后再删除 DOM
      setTimeout(() => {
        render(null, container);
      }, 400);
      // // 如果其他的开发者传递了取消逻辑 执行取消逻辑
      // render(null, container);
    };
    const vNode = createVNode(XtxConfirm, {
      title,
      content,
      onSureButtonClick: onSureButtonClickHandler,
      onCancelButtonClick: onCancelButtonClickHandler,
    });
    render(vNode, container);
  });
}

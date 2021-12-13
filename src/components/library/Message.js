// 1. 导入单文件组件对象
// 2. 将单文件组件转换为虚拟节点对象
// 3. 将虚拟节点对象渲染到真实DOM中
// 4. 3秒后销毁组件
// 创建组件渲染的目标容器
import XtxMessage from "@/components/library/XtxMessage";
import { createVNode, render } from "vue";
const container = document.createElement("div");
document.body.appendChild(container);

//定时器
let timer = null;

//用于渲染组件的方法的
export default function Message({ type, text }) {
  //    2将单文件组件转化为虚拟节点对象
  const vNode = createVNode(XtxMessage, { type, text });
  //3.将虚拟节点对象渲染到真实DOM中
  render(vNode, container);
  //   3秒之后销毁组件
  clearTimeout(timer);
  timer = setTimeout(() => render(null, container), 3000);
}

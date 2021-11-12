import { onMounted, onUnmounted, ref } from "vue";

export default function useScrollTop() {
  //存储滚高距离 用于在模板中作为元素的显示的依据
  const scrollTop = ref(0);
  //滚动事件的处理函数
  const onScrollHandler = () => {
    //存储滚动的距离
    scrollTop.value = document.documentElement.scrollTop;
  };
  //组件挂载完成后
  onMounted(() => {
    //为window 添加滚动事件
    window.addEventListener("scroll", onScrollHandler);
  });
  //组件卸载完成后
  onUnmounted(() => {
    //为window 移除滚动时间
    // console.log(3);
    window.removeEventListener("scroll", onScrollHandler);
  });
  return scrollTop;
}

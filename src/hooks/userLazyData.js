import { ref } from "vue";
import { useIntersectionObserver } from "@vueuse/core";

export default function userLazyData(apiFunction) {
  //    创建元素引用对象
  const target = ref(null);
  //  存储元素
  const result = ref(null);

  //  监听元素进入可视区
  const { stop } = useIntersectionObserver(
    target,
    ([{ isIntersecting }]) => {
      //    元素进入可视区
      if (isIntersecting) {
        //  停止监听
        stop();
        //  获取数据
        apiFunction().then((data) => (result.value = data.result));
      }
    },
    { threshold: 0 }
  );
  return { target, result };
}

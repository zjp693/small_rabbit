import { onUnmounted, ref } from "vue";
import { useIntervalFn } from "@vueuse/core";

export default function useCountDown() {
  // 计时器数值
  const count = ref(0);
  // 创建计时器对象
  const { pause, isActive, resume } = useIntervalFn(
    () => {
      // 如果数值等于0
      if (count.value <= 0) {
        // 停止倒计时
        pause();
      } else {
        // 否则就是数值在原有值的基础上减一
        count.value--;
      }
    },
    1000,
    { immediate: false }
  );
  // 执行开始操作, 开始倒计时
  const start = (value) => {
    // 如果倒计时正在运行
    if (!isActive.value) {
      // 重新设置倒计时数值
      count.value = value;
      // 开始执行倒计时
      resume();
    }
  };
  // 组件卸载后清除定时器
  onUnmounted(pause);
  // 返回计时器数值
  return { count, start, isActive };
}

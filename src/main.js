import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "normalize.css";
import "@/assets/styles/common.less";
//骨架屏组件
import UI from "@/components/library";
createApp(App).use(store).use(router).use(UI).mount("#app");

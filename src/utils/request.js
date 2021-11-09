import axios from "axios";
// import store from "@/store";

//2.创建baseURL 变量泳衣存储基准的请求地址
// const baseURL = "http://pcapi-xiaotuxian-front-devtest.itheima.net/";
//1.创建一个新的axios 实例对象，专门用于配置和小兔鲜应用相关的请求
axios.instanceWithToken = axios.create();
axios.instanceWithoutToken = axios.create();

//3.配置请求拦截器 携带token
// instanceWithToken.interceptors.request.use((config) => {
//   const token = store.state.user.profile.token;
//   if (token) {
//     //  奖token 存储在请求头中
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

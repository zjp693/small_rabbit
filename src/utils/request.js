import axios from "axios";
import store from "@/store";
import router from "@/router";
// 线上环境: https://apipc-xiaotuxian-front.itheima.net/
// 开发环境: http://pcapi-xiaotuxian-front-devtest.itheima.net/
//2.创建baseURL 变量泳衣存储基准的请求地址
const baseURL = "http://pcapi-xiaotuxian-front-devtest.itheima.net/";
//1.创建一个新的axios 实例对象，专门用于配置和小兔鲜应用相关的请求
//创建请求实例（携带token）
const instanceWithToken = axios.create({ baseURL });
//创建请求实例（不携带token）
const instanceWithoutToken = axios.create({ baseURL });

//3.配置请求拦截器 携带token
instanceWithToken.interceptors.request.use((config) => {
  const token = store.state.user.profile.token;
  if (token) {
    //  将token 存储在请求头中
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
//4.配置响应拦截器，精简数据层级，检查token是否过期
//4.1 配置携带token的响应拦截器
instanceWithToken.interceptors.response.use(
  (response) => {
    //如果服务端返回的是表示成功的状态码，走这个回调函数
    //服务端做出响应以后，先走的当前的回调函数，在当前回调函数中可以对响应的结果进行处理，处理完之后再给到请求的调用者
    return response.data;
  },
  (error) => {
    //如果服务端返回的是表示失败的状态码，走这个回调函数
    if (error.response.status === 401) {
      //401 未授权
      //1.跳转到登录页
      router
        .push("/login")
        .then(() => {
          console.log("跳转成功");
        })
        .catch(() => {
          console.log("跳转失败");
        });
      //  2.清空本地的用户信息
      store.commit("user/setUser", {});
    }
    return Promise.reject(error);
  }
);
//4.2配置未携带token的响应拦截器
instanceWithoutToken.interceptors.response.use((response) => {
  return response.data;
});

//用于生成请求配置的函数
export function generateRequestConfig(url, method, data) {
  return {
    url: url,
    method: method,
    [method === "get" ? "params" : "data"]: data,
  };
}

//用于发送携带token的请求
export function requestWithToken(url, method, data) {
  return instanceWithToken(generateRequestConfig(url, method, data));
}

//用于发送 未携带token的普通请求
export function requestWithOutToken(url, method, data) {
  return instanceWithoutToken(generateRequestConfig(url, method, data));
}

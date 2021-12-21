import store from "@/store";

export default function authGuard(to, from, next) {
  //    指定需要登录的路由地址
  const requireLogin = ["checkout", "member"];
  //如果用户访问的页面是需要登录
  if (requireLogin.includes(to.path.split("/")[1])) {
    //  如果用户没有登录
    if (!store.state.user.profile.token) {
      next({ path: "/login", query: { redirectURL: to.fullPath } });
    } else {
      //  如果用户登录了
      next();
    }
  } else {
    //用户的页面是不需要登录
    next();
  }
  // console.log(to, from, next);
}

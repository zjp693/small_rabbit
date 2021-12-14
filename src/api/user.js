import { requestWithOutToken } from "@/utils/request";

/**
 *  账号密码登录
 * @param account 账号
 * @param password 密码
 * @returns {AxiosPromise}
 */
export function loginByAccountAndPassword({ account, password }) {
  return requestWithOutToken("/login", "post", { account, password });
}

/**
 *  手机短信登录
 * @param mobile 手机号
 * @returns {AxiosPromise} 验证码
 */
export function getLoginMsgCode(mobile) {
  return requestWithOutToken("/login/code", "get", { mobile });
}

/**
 * 手机号登录
 * @param mobile 手机号
 * @param code 验证码
 * @return {AxiosPromise}
 */
export function loginByMobileMsgCode({ mobile, code }) {
  return requestWithOutToken("/login/code", "post", { mobile, code });
}
/**
 * 在小兔仙应用中检索绑定该QQ号的账号
 * @param unionId QQ用户唯一标识
 * @param source 注册来源
 * @return {AxiosPromise}
 */
export function findAccountByQQOpenid({ unionId, source = 1 }) {
  return requestWithOutToken("/login/social", "post", { unionId, source });
}
/**
 * 获取手机验证码 (QQ登录, 绑定已有账号手机号)
 * @param mobile
 * @return {Promise}
 */
export function getBindMobileMsgCode(mobile) {
  return requestWithOutToken("/login/social/code", "get", { mobile });
}
/**
 * QQ登录, 将手机号和QQ号进行绑定
 * @param unionId 用户的唯一标识(openid)
 * @param mobile 手机号
 * @param code 手机验证码
 * @return {Promise}
 */
export function bindMobileAndQQ({ unionId, mobile, code }) {
  return requestWithOutToken("/login/social/bind", "post", {
    unionId,
    mobile,
    code,
  });
}

/**
 * 检测用户名是否唯一
 * @param account 用户名
 * @return {Promise}
 */
export function checkUsernameIsUnique(account) {
  return requestWithOutToken("/register/check", "get", { account });
}

/**
 * 获取手机验证码 (注册)
 * @param mobile 手机号
 * @return {AxiosPromise}
 */
export function getRegisterMsgCode(mobile) {
  return requestWithOutToken("/register/code", "get", { mobile });
}
/**
 * 创建新账户并绑定QQ
 * @param unionId QQ用户唯一标识
 * @param account 用户名
 * @param mobile 手机号
 * @param code 验证码
 * @param password 密码
 * @return {AxiosPromise}
 */
export function createNewAccountBindQQ({
  unionId,
  account,
  mobile,
  code,
  password,
}) {
  return requestWithOutToken(`/login/social/${unionId}/complement`, "POST", {
    account,
    mobile,
    code,
    password,
  });
}

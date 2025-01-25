/**
 *@des 登录注册相关接口
 *@author stav stavyan@qq.com
 *@blog https://stavtop.club
 *@date 2019/11/15 15:14:47
 *@param login.js
 */

// 密码注册
const registerByPass = '/common/registerbypass';

// 密码登录
const loginByPass = '/common/loginbypass';

// 微信授权登录
const wechatH5Login = '/tiny-shop/v1/third-party/wechat';

// 微信小程序授权登录
const mpWechatLogin = '/thirdparty/mpwechatlogin';

// App微信授权登录
const thirdPartyWechatOpenPlatform = '/tiny-shop/v1/third-party/wechat-open-platform';

// Ios苹果扥估
const thirdPartyApple = '/tiny-shop/v1/third-party/apple';

// 密码重置
const updatePassword = '/tiny-shop/v1/site/up-pwd';

// 第三方绑定
const authLogin = '/common/authlogin';

// 查询绑定状态
const isBindingCheck = '/common/isbindingcheck';

// 手机号验证码登录
const loginBySmsCode = '/tiny-shop/v1/site/mobile-login';

// 获取手机验证码
const smsCode = '/common/smscode';

// 退出登录
const logout = '/common/logout';

// 刷新token
const refreshToken = '/tiny-shop/v1/site/refresh';

// 登录令牌有效性检测
const verifyAccessToken = '/tiny-shop/v1/site/verify-access-token';

export {
	registerByPass,
	loginByPass,
	isBindingCheck,
	wechatH5Login,
	mpWechatLogin,
	thirdPartyWechatOpenPlatform,
	thirdPartyApple,
	authLogin,
	updatePassword,
	smsCode,
	loginBySmsCode,
	logout,
	refreshToken,
	verifyAccessToken
};

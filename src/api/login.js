import _fetch from './request'
// 获取验证码
function auCode (data) {
  return _fetch({
    url: '/au/code',
    method: 'post',
    data
  })
}
// 登陆
function auLogin (data) {
  return _fetch({
    url: '/au/login',
    method: 'post',
    data
  })
}
export { auCode, auLogin }

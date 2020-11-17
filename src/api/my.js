import _fetch from './request'
// import { getLocal } from '@/utils/local.js'
// 获取用户信息
function auInfo (bol = false) {
  return _fetch({
    url: '/au/info',
    method: 'get',
    needToken: true,
    noError: bol //true不处理错误  false处理错误
    // headers: {
    //   authorization: `Bearer ` + getLocal()
    // }
  })
}
// 编辑用户信息
function auEdit (data) {
  return _fetch({
    url: '/au/edit',
    method: 'post',
    needToken: true,
    data
  })
}
// 上传头像
function upload (data) {
  return _fetch({
    url: '/upload',
    method: 'post',
    needToken: true,
    data
  })
}
export { auInfo, auEdit, upload }

// 获取token

export function getLocal (key = 'token') {
  return window.localStorage.getItem(key)
}
// 保存token
export function saveLocal (value, key = 'token') {
  window.localStorage.setItem(key, value)
}
// 删除token
export function removeLocal (key = 'token') {
  window.localStorage.removeItem(key)
}

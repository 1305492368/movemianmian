import _fetch from './request'
// import store from '@/store'
// 获取技巧列表
export function articlesTechnic (params) {
  return _fetch({
    url: '/articles/technic',
    // needToken: store.state.isLogin,
    params
  })
}
// 获取市场数据
export function chartHot () {
  return _fetch({
    url: '/chart-data/hot'
  })
}
// 获取面经分享数据
export function articlesShare (params) {
  return _fetch({
    url: '/articles/share',
    params
  })
}
// 面经热搜
export function shareTopSearch () {
  return _fetch({
    url: '/articles/shareTopSearch'
  })
}
// 获取面经文件详情
export function articlesShareInfo (id) {
  return _fetch({
    url: '/articles/share/' + id
  })
}
// 面经评论
export function articlesComments (id, params) {
  return _fetch({
    url: '/articles/comments/' + id,
    params
  })
}
// 发表评论
export function sendArticlesComments (data) {
  return _fetch({
    url: '/articles/comments',
    method: 'post',
    needToken: true,
    data
  })
}
// 收藏 文章
export function articlesCollect (data) {
  return _fetch({
    url: '/articles/collect',
    method: 'post',
    needToken: true,
    data
  })
}
// 点赞文章
export function articlesStar (data) {
  return _fetch({
    url: '/articles/star',
    method: 'post',
    needToken: true,
    data
  })
}
//评论点赞api
export function articleCommentsStar (data) {
  return _fetch({
    url: '/article-comments/star',
    method: 'post',
    needToken: true,
    data
  })
}

import _fetch from './request'
export function interviewFilters () {
  return _fetch({
    url: '/interview/filters'
  })
}
// 获取面试题
export function interviewQuestions (params) {
  return _fetch({
    url: '/interview/questions',
    needToken: true,
    params
  })
}
// 提交面试题答案
export function questionsSubmit (data) {
  return _fetch({
    url: '/questions/submit',
    method: 'post',
    needToken: true,
    data
  })
}
//获取题目
export function getQuestionsInfo (id) {
  return _fetch({
    url: '/questions/' + id,
    needToken: true
  })
}

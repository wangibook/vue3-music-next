import request from './request'

export function getRecommend() {
  return request({
    url: '/api/getRecommend',
    method: 'get'
  })
}
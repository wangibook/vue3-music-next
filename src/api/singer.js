import request from './request'

export function getSingerList() {
  return request({
    url: '/api/getSingerList',
    method: 'get'
  })
}
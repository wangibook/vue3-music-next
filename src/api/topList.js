import request from './request'

export function getTopList() {
  return request({
    url: '/api/getTopList',
    method: 'get'
  })
}

export function getTopDetail(top) {
  return request({
    url: '/api/getTopDetail',
    method: 'get',
    params: {
      id: top.id,
      period: top.period
    }
  })
}
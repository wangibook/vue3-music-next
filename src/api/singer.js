import request from './request'

export function getSingerList() {
  return request({
    url: '/api/getSingerList',
    method: 'get'
  })
}

export function getSingerDetail(singer) {
  return request({
    url: '/api/getSingerDetail',
    method: 'get',
    params: {
      mid:singer.mid
    }
  })
}
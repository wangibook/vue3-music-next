import request from './request'

export function getRecommend() {
  return request({
    url: '/api/getRecommend',
    method: 'get'
  })
}

export function getAlbum(id) {
  return request({
    url: '/api/getAlbum',
    method: 'get',
    params: {
      id
    }
  })
}
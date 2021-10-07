import request from './request'

export function getRecommend() {
  return request({
    url: '/api/getRecommend',
    method: 'get'
  })
}

export function getAlbum(album) {
  return request({
    url: '/api/getAlbum',
    method: 'get',
    params: {
      id:album.id
    }
  })
}
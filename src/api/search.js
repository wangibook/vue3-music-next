import request from './request'

export function getHotKeys() {
  return request({
    url: '/api/getHotKeys',
    method: 'get'
  })
}

export function search(data) {
  return request({
    url: '/api/search',
    method: 'get',
    params: {
      query:data.query,
      page:data.page,
      showSinger:data.showSinger
    }
  })
}
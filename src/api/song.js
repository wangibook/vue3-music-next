import request from './request'

// 处理歌曲url
export function processSongs(songs) {
  let midArr = songs.map(item => {
    return item.mid
  })

  return request({
    url: '/api/getSongsUrl',
    method: 'get',
    params: {
      mid: midArr
    }
  }).then(res => {
    const resData = res.data.result.map
    songs.map(song => {
      song.url = resData[song.mid]
    })
    return songs.filter(ele => {
      return ele.url && ele.url.indexOf('vkey') > -1
    })
  })
}
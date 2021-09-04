export function shuffle(arr) {
  let len = arr.length
  for (let i = 0; i < len; i++) {
    var a=parseInt(Math.random()*len);
    var temp=arr[a];
    arr[a]=arr[i];
    arr[i]=temp;
  }
  return arr
}

export function formatTime(interval) {
  interval = interval | 0
  const minute = String((interval/60 | 0)).padStart(2,'0')
  const secend = String((interval%60)).padStart(2,'0')
  return `${minute}:${secend}`
}
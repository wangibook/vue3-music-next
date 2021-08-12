import axios from 'axios'

const service = axios.create({
  baseURL: '/', 
  headers: { 'Content-Type': 'application/json;charset=utf-8' },
  timeout: 4000,
  withCredentials: true
})

export default service
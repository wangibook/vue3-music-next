import axios from 'axios'

const service = axios.create({
  baseURL: '/', 
  headers: { 'Content-Type': 'application/json;charset=utf-8' },
  timeout: 5000,
  withCredentials: true
})

export default service
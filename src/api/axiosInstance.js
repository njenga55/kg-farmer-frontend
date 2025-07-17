import axios from "axios"

//BaseURL backend api
const instance = axios.create({
  // baseURL: "https://kg-farmers-backend.onrender.com",

  baseURL: "http://localhost:3000",

  // baseURL: process.env.VUE_APP_API_BASE_URL,
})

instance.interceptors.request.use(config => {
  let token
  const userString = localStorage.getItem("user")

  if (userString) {
    token = JSON.parse(userString).token
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  
  return config
})

export default instance

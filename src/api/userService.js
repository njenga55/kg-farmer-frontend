import axios from "@/api/axiosInstance"

// AUTH
export function userSignup(payload) {
  return axios.post(`/api/v1/users/createNewUser`, payload)
}

export function userLogin(payload) {
  return axios.post(`/api/v1/users/login`, payload)
}

export function forgotPassword(payload) {
  return axios.post(`/api/v1/users/forgotPassword`, payload)
}

export function resetPassword(payload) {
  return axios.patch(
    `/api/v1/users/resetPassword/${payload.token}`,
    payload.values,
  )
}

export function updateMe(payload) {
  return axios.patch(`/api/v1/users/updateMe`, payload)
}

export function updatePassword(payload) {
  return axios.patch(`/api/v1/users/updateMyPassword`, payload)
}

export function logOut() {
  return axios.post(`/api/v1/users/logout`)
}

// USERS
export function getUsers(params) {
  return axios.get(`/api/v1/users?${params}`)
}

export function updateUser(payload) {
  return axios.patch(`/api/v1/users/${payload.id}`, payload.values)
}

import axios from "@/api/axiosInstance"

export function getFarmers(params) {
  return axios.get(`/api/v1/farmers?${params}`)
}

export function updateFarmer(payload) {
  return axios.patch(`/api/v1/farmers/${payload.id}`, payload.values)
}

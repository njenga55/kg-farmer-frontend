import axios from "@/api/axiosInstance"

export function getKilos(params) {
  return axios.get(`/api/v1/kilos?${params}`)
}

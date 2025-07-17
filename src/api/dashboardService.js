import axios from "@/api/axiosInstance"

export function getDashboardStats(params) {
  return axios.get(`/api/v1/dashboards/stats`)
}

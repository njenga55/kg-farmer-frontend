import axios from "@/api/axiosInstance"

export function getAllActivities() {
  return axios.get(`/api/v1/activities`)
}

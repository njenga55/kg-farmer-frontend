import axios from "@/api/axiosInstance"

export function getProfitData() {
  return axios.get(`/api/v1/reports`)
}

export function exportFarmersReport(period) {
  return axios.get(`/api/v1/reports/export-farmers`, {
    params: { period },
    responseType: 'blob',
  })
}

export function getDailyReports() {
  return axios.get(`/api/v1/reports/daily-reports`)
}

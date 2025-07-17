import axios from "@/api/axiosInstance"

export function getPaymentReport(params) {
  return axios.get(`/api/v1/reports/payment-report?${params}`)
}

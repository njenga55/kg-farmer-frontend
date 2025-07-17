import axios from "@/api/axiosInstance"

export function getTransactions(params) {
  return axios.get(`/api/v1/transactions?${params}`)
}

export function fetchFarmerTransactions(farmerId, params) {
  return axios.get(`/api/v1/transactions/farmer-transactions/${farmerId}?${params}`)
}

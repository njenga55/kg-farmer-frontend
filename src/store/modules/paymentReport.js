import { getPaymentReport } from '@/api/reportService'

export default {
  namespaced: true,
  state: () => ({
    reportData: [],
    period: "",
    records: 0,
    loading: false,
  }),
  mutations: {
    SET_REPORT_DATA(state, payload) {
      state.reportData = payload.data
      state.period = payload.period
      state.records = payload.records
    },
    SET_LOADING(state, status) {
      state.loading = status
    },
  },
  actions: {
    async fetchReport({ commit }, params) {
      commit("SET_LOADING", true)
      try {
        const res = await getPaymentReport(params)

        commit("SET_REPORT_DATA", res.data)
      } catch (err) {
        console.error("Error fetching report:", err)
      } finally {
        commit("SET_LOADING", false)
      }
    },
  },
}


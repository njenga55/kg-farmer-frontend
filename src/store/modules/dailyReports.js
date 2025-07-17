import { getDailyReports } from '@/api/profitService'

export const dailyReports = {
  namespaced: true,
  state: {
    dailyReports: [],
    totalRecords: 0,
    currentPage: 1,
    totalPages: 1,
    searchQuery: '',
    limit: 10,
    loading: false,
  },
  mutations: {
    SET_DAILY_REPORTS(state, payload) {
      state.dailyReports = payload
    },
    SET_TOTAL_RECORDS(state, payload) {
      state.totalRecords = payload
    },
    SET_TOTAL_PAGES(state, payload) {
      state.totalPages = payload
    },
    SET_CURRENT_PAGE(state, payload) {
      state.currentPage = payload
    },
    SET_SEARCH_QUERY(state, payload) {
      state.searchQuery = payload
    },
    SET_LIMIT(state, payload) {
      state.limit = payload
    },
    SET_LOADING(state, payload) {
      state.loading = payload
    },
  },
  actions: {
    async fetchDailyReports({ commit, state }) {
      const { searchQuery, currentPage, limit } = state

      const params = new URLSearchParams({
        search: searchQuery,
        page: currentPage,
        limit,
      }).toString()

      commit('SET_LOADING', true)

      try {
        const response = await getDailyReports(params)
        const data = response.data.data

        commit('SET_DAILY_REPORTS', data.data)
        commit('SET_TOTAL_RECORDS', data.totalRecords)
        commit('SET_TOTAL_PAGES', data.totalPages)
      } catch (error) {
        console.error('Error fetching dailyReports:', error)
      } finally {
        commit('SET_LOADING', false)
      }
    },
    setPage({ commit, dispatch }, page) {
      commit('SET_CURRENT_PAGE', page)
      dispatch('fetchDailyReports')
    },
    setSearchQuery({ commit, dispatch }, query) {
      commit('SET_SEARCH_QUERY', query)
      commit('SET_CURRENT_PAGE', 1)
      dispatch('fetchDailyReports')
    },
    setLimit({ commit, dispatch }, limit) {
      commit('SET_LIMIT', limit)
      dispatch('fetchDailyReports')
    },
  },
}

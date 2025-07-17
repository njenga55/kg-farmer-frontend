export default {
  SET_USER_DATA(state, userData) {
    state.user = userData
    localStorage.setItem("user", JSON.stringify(userData))
  },
  CLEAR_USER_DATA() {
    localStorage.removeItem("user")
    location.reload()
  },
  CLEAR_USER_DATA_INTERCEPTOR(state) {
    state.user = null
    localStorage.removeItem("user")
  },
  SET_TODOS_DATA(state, todos) {
    state.todos = todos
  },

  SHOW_PROGRESSBAR(state, show) {
    let timeout = 0
    if (state.progressbar.show) {
      state.progressbar.show = false
      timeout = 300
    }
    setTimeout(() => {
      state.progressbar.show = show
    }, timeout)
  },
  HIDE_PROGRESSBAR(state) {
    state.progressbar.show = false
  },
  SHOW_SNACKBAR(state, values) {
    let timeout = 0
    if (state.snackbar.show) {
      state.snackbar.show = false
      timeout = 300
    }
    setTimeout(() => {
      state.snackbar.show = true
      state.snackbar.text = values.text
      state.snackbar.color = values.color
    }, timeout)
  },
  HIDE_SNACKBAR(state) {
    state.snackbar.show = false
  },
}

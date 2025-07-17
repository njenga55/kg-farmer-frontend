export default {
  loggedIn(state) {
    return !!state.user
  },
  getUser(state) {
    return state.user.data.user
  },
}

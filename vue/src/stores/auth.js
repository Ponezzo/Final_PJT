export default {
  namespaced: true,
  state: {
    token: null,
    username: null,
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
    },
    setUsername(state, username) {
      state.username = username;
    },
    logout(state) {
      state.token = null;
      state.username = null;
    },
  },
};

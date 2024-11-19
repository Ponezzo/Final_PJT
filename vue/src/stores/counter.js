import { createStore } from 'vuex';

export const store = createStore({
  state: {
    username: '',
    password: '',
    confirmPassword: '',
  },
  mutations: {
    setUsername(state, username) {
      state.username = username;
    },
    setPassword(state, password) {
      state.password = password;
    },
    setConfirmPassword(state, confirmPassword) {
      state.confirmPassword = confirmPassword;
    },
  },
  actions: {
    registerUser({ state }) {
      return axios.post('http://localhost:8000/users/signup/', {
        username: state.username,
        password: state.password,
        password2: state.confirmPassword,
      });
    },
  },
});

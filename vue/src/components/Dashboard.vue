<template>
  <div class="dashboard">
    <h1>Welcome, {{ username }}!</h1>
    <button @click="handleLogout">Logout</button>
  </div>
</template>

<script>
export default {
  computed: {
    username() {
      return this.$store.state.auth.username;
    },
  },
  methods: {
    handleLogout() {
      this.$store.commit('auth/logout');
      this.$router.push('/login');
    },
  },
};
</script>

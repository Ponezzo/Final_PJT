<template>
  <div class="auth-container">
    <h1>Register</h1>
    <form @submit.prevent="handleRegister">
      <div class="form-group">
        <label for="username">Username</label>
        <input type="text" id="username" v-model="username" required />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <div class="form-group">
        <label for="confirm-password">Confirm Password</label>
        <input type="password" id="confirm-password" v-model="confirmPassword" required />
      </div>
      <button type="submit">Register</button>
      <p class="redirect">
        Already have an account? <router-link to="/login">Login here</router-link>
      </p>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  computed: {
    ...mapState(['username', 'password', 'confirmPassword']),
  },
  methods: {
    ...mapActions(['registerUser']),
    async handleRegister() {
      if (this.password !== this.confirmPassword) {
        this.error = 'Passwords do not match.';
        return;
      }
      try {
        await this.registerUser();
        this.$router.push('/login'); // Redirect to login after registration
      } catch (err) {
        this.error = 'Registration failed. Please try again.';
      }
    },
  },
};
</script>


<style scoped>
.auth-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background-color: #f9f9f9;
}
.form-group {
  margin-bottom: 15px;
}
.form-group label {
  display: block;
  margin-bottom: 5px;
}
.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
button {
  width: 100%;
  padding: 10px;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
button:hover {
  background-color: #555;
}
.error {
  color: red;
  margin-top: 10px;
}
.redirect {
  margin-top: 15px;
  text-align: center;
}
</style>

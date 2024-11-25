<template>
  <div id="app">
    <header class="navbar">
      <div class="navbar__container">
        <!-- 왼쪽 그룹 -->
        <div class="navbar__left">
          <img src="@/assets/GoodLogo.png" alt="Logoimg" class="logoimg" @click="goHome" />
          <router-link to="/" class="Home">MovieCINE</router-link>
        </div>
        <!-- 오른쪽 그룹 -->
        <div class="navbar__right">
          <!-- 로그인되지 않은 경우 Signup, Login 보이기 -->
          <router-link v-if="!isLoggedIn" to="/signup" class="SignUp">Signup</router-link>
          <router-link v-if="!isLoggedIn" to="/login" class="Login">Login</router-link>
          
          <!-- 로그인된 경우 Logout 텍스트 보이기, 버튼 대신 클릭 이벤트로 로그아웃 -->
          <router-link v-if="isLoggedIn" to="/community" class="Community">Community</router-link>
          <router-link v-if="isLoggedIn" to="/profile" class="Profile">Profile</router-link>
          <router-link v-if="isLoggedIn" to="/search" class="Search">Search</router-link>
          <button v-if="isLoggedIn" @click="logOut" class="Logout">Logout</button>
        </div>
      </div>
    </header>

    <!-- Fade-in/Fade-out 애니메이션 추가 -->
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCounterStore } from '@/stores/counter'  // Pinia store 가져오기

const router = useRouter()
const store = useCounterStore()

// 홈으로 가는 함수
const goHome = () => {
  router.push('/')
}

// 로그인 상태 계산 (Pinia store의 isLogin을 기반으로)
const isLoggedIn = computed(() => store.isLogin)

// 로그아웃 함수
const logOut = () => {
  store.logOut()  // Pinia store에서 로그아웃 처리
  router.push('/')  // 로그아웃 후 로그인 페이지로 리다이렉트
}
</script>

<style scoped>
/* Fade-in/Fade-out 효과 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease; /* 전환 속도 조절 */
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.fade-enter-to, .fade-leave-from {
  opacity: 1;
}

/* Navbar 스타일 */
.navbar__container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 10px 20px;
  background-color:transparent;
}

.navbar__left {
  display: flex;
  align-items: center;
}

.navbar__right {
  display: flex;
  gap: 20px;
}

.logoimg {
  height: 40px;
  margin-right: 10px;
  cursor: pointer;
}

.Home, .SignUp, .Login, .Logout, .Profile, .Search, .Community {
  font-size: 18px;
  text-decoration: none;
  color: white;
  cursor: pointer;
}

.Logout {
  font-size: 18px;  /* 텍스트 크기 조정 */
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-family: 'GowunBatang-Regular';
  src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_2108@1.1/GowunBatang-Regular.woff') format('woff');
  font-weight: normal;
  font-stretch: semi-expanded;
  font-style: normal;
}
</style>

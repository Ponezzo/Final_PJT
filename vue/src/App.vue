<template>
  <div id="app">
    <header class="navbar">
      <div class="navbar__container">
        <!-- 왼쪽 그룹 -->
        <div class="navbar__left">
          <img src="@/assets/GoodLogo.png" alt="Logoimg" class="logoimg" @click="goHome" />
          <router-link to="/" class="Home">CINEMovie</router-link>
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
          
          <!-- ChatView 버튼 -->
          <button class="chat-btn" @click="toggleChatView">Chat</button>

          <!-- ChatView 모달 -->
          <div v-if="isChatViewVisible" class="chat-modal">
            <div class="chat-modal-content">
              <ChatView />
              <button class="close-btn" @click="toggleChatView">
                ✕
              </button>
            </div>
          </div>
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCounterStore } from '@/stores/counter'  // Pinia store 가져오기
import ChatView from "@/views/ChatView.vue"

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

// 모달 상태 관리
const isChatViewVisible = ref(false)

// 모달 열기/닫기 함수
const toggleChatView = () => {
  isChatViewVisible.value = !isChatViewVisible.value
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
  align-items: center; /* 모든 자식 요소를 세로 중앙 정렬 */
  max-width: 1200px;
  margin: 0 auto;
  padding: 10px 20px;
  background-color: transparent;
  height: 60px; /* 고정 높이 설정으로 일관성 유지 */
}

.navbar__left,
.navbar__right {
  display: flex;
  align-items: center; /* 내부 요소를 세로 중앙 정렬 */
  gap: 15px; /* 요소 간 간격 조절 */
  height: 100%; /* 컨테이너의 높이에 맞춤 */
}

.logoimg {
  height: 40px; /* 고정 높이 */
  cursor: pointer;
  display: block;
  object-fit: contain; /* 이미지가 영역에 맞게 조정 */
  margin-right: 10px; /* 텍스트와 적당한 간격 */
}

.Home, .SignUp, .Login, .Logout, .Profile, .Search, .Community, .chat-btn {
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

/* Chat 버튼 스타일 */
.chat-btn {
  font-size: 18px;
  text-decoration: none;
  color: white;
  background-color: transparent;
  border: 1px solid white;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.chat-btn:hover {
  background-color: white;
  color: black;
}

/* 모달 스타일 */
.chat-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9); /* 검은색 배경 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* 최상단 표시 */
}

/* 모달 콘텐츠 */
.chat-modal-content {
  background: #000; /* 검은색 배경 */
  padding: 20px;
  border-radius: 8px; /* 둥근 모서리 */
  max-width: 400px; /* 최대 폭 */
  width: 90%; /* 화면 크기 조정 */
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5); /* 약간의 그림자 */
  color: white;
  font-family: 'Arial', sans-serif;
  position: relative;
  text-align: center;
}

/* 닫기 버튼 */
.close-btn {
  position: absolute;
  top: 2px;
  right: 2px;
  background: rgb(0, 0, 0); /* 약간 투명한 흰색 배경 */
  border: none;
  font-size: 20px;
  color: white;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.4); /* 호버 시 밝은 배경 */
  transform: scale(1.1); /* 약간 확대 */
}

/* 등장 애니메이션 */
@keyframes pop-in {
  0% {
    transform: scale(0.7);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}


</style>

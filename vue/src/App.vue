<template>
  <div id="app">
    <!-- Navbar, 상단 네비게이션 추가 -->
    <header class="navbar">
      <div class="navbar__container">
        <router-link to="/" class="navbar__logo">MovieCINE</router-link>
      </div>
    </header>
  </div>
    <!-- 라우터 뷰는 각 경로에 해당하는 컴포넌트를 렌더링합니다. -->
    <router-view />
</template>

<script setup>
// Vue 3에서는 router-view와 관련된 라우터 설정을 앱에서 설정합니다.
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import ArticleView from './views/ArticleView.vue'
import DetailView from './views/DetailView.vue'

// 라우트 정의
const routes = [
  { path: '/', component: ArticleView },           // 메인 페이지
  { path: '/detail/:id', component: DetailView }   // 영화 상세 페이지
]

// 라우터 인스턴스 생성
const router = createRouter({
  history: createWebHistory(),
  routes
})

// 앱 인스턴스를 생성하고 라우터를 사용하여 마운트합니다.
const app = createApp({})
app.use(router)
app.mount('#app')
</script>

<style scoped>
/* Navbar 스타일 */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-image: linear-gradient(to top, #1c1a27 100%);
  color: white;
  z-index: 1000;
}

.navbar__container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 10px 20px;
}

.navbar__logo {
  font-size: 24px;
  font-weight: bold;
  color: white;
  text-decoration: none;
}
</style>
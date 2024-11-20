<template>
  <div>
    <p>로그아웃 중...</p>
  </div>
</template>

<script setup>
import { useCounterStore } from '@/stores/counter'
import { useRouter } from 'vue-router'

const store = useCounterStore()
const router = useRouter()

// 로그아웃 후 홈으로 리다이렉트
store.logOut()
router.push({ name: 'ArticleView' })  // 홈 페이지로 리다이렉트
</script>

<style scoped>
/* 스타일은 자유롭게 추가하세요 */
</style>

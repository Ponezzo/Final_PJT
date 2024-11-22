<template>
  <div class="community-detail">
    <div v-if="loading">로딩 중...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else>
      <h1>{{ post.title }}</h1>
      <img :src="post.movie_poster" alt="Movie Poster" class="movie-poster" />
      <p>{{ post.content }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'

const post = ref(null)
const loading = ref(true)
const error = ref(null)
const route = useRoute()

onMounted(async () => {
  const postId = route.params.id  // 라우터에서 ID 파라미터 추출
  const token = localStorage.getItem('userToken')  // 로컬스토리지에서 토큰 가져오기

  if (!token) {
    error.value = '로그인이 필요합니다.'
    loading.value = false
    return
  }

  try {
    const response = await axios.get(`http://localhost:8000/api/posts/${postId}/`, {
      headers: {
        Authorization: `Token ${token}`,  // 인증 토큰을 헤더에 추가
      },
    })
    post.value = response.data
  } catch (err) {
    error.value = '게시글 정보를 불러오는 중 오류가 발생했습니다.'
  } finally {
    loading.value = false
  }
})

</script>

<style scoped>
.community-detail {
  text-align: center;
  padding: 20px;
}

.movie-poster {
  width: 30%;
  height: auto;
  border-radius: 10px;
  margin-bottom: 20px;
}
</style>

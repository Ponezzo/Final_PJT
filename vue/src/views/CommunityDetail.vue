<template>
  <div class="community-detail">
    <div v-if="loading">로딩 중...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else>
      <h1>{{ post.movieTitle }}</h1>
      <img 
        :src="'https://image.tmdb.org/t/p/w500' + post.moviePoster" 
        alt="Movie Poster" 
        class="movie-poster"
      />
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
  try {
    const postId = route.params.id
    const response = await axios.get(`/api/posts/${postId}/`) // Django 상세 조회 API
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
  width: 100%;
  height: auto;
  border-radius: 10px;
  margin-bottom: 20px;
}
</style>

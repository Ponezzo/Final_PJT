<template>
  <div class="community-page">
    <h1>영화 리뷰 커뮤니티</h1>

    <div v-if="loading">로딩 중...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else class="posts-list">
      <div 
        v-for="post in posts" 
        :key="post.id" 
        class="post-item"
        @click="goToDetail(post.id)" <!-- 게시글 클릭 시 상세 페이지 이동 -->
      >
        <img 
          :src="'https://image.tmdb.org/t/p/w500' + post.moviePoster" 
          alt="Movie Poster" 
          class="movie-poster"
        />
        <div class="post-content">
          <h3>{{ post.movieTitle }}</h3>
          <p>{{ post.content }}</p>
        </div>
      </div>
    </div>

    <router-link to="/article-create" class="create-post-button">게시글 작성하기</router-link>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const posts = ref([])
const loading = ref(true)
const error = ref(null)
const router = useRouter()

const goToDetail = (postId) => {
  router.push(`/community/${postId}`) // 게시글 ID로 상세 페이지로 이동
}

onMounted(async () => {
  try {
    const response = await axios.get('/api/posts/') // Django API 엔드포인트
    posts.value = response.data
  } catch (err) {
    error.value = '게시글을 불러오는 중 오류가 발생했습니다.'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.community-page {
  text-align: center;
  padding: 20px;
}

.posts-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  cursor: pointer;
}

.post-item {
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.post-item:hover {
  transform: scale(1.05);
}

.movie-poster {
  width: 100%;
  height: auto;
  border-radius: 10px;
}

.create-post-button {
  display: inline-block;
  padding: 10px 20px;
  background-color: #634086;
  color: white;
  border-radius: 5px;
  margin-top: 20px;
  text-decoration: none;
}

.create-post-button:hover {
  background-color: #8253b1;
}
</style>

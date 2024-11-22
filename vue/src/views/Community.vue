<template>
  <div class="community-page">
    <h1>영화 리뷰 커뮤니티</h1>

    <!-- 로딩 상태 처리 -->
    <div v-if="loading">로딩 중...</div>
    <!-- 에러 처리 -->
    <div v-else-if="error">{{ error }}</div>
    <!-- 게시글이 있을 때만 표시 -->
    <div v-else-if="posts.length > 0" class="posts-list">
      <div 
        v-for="post in posts" 
        :key="post.id" 
        class="post-item"
        @click="goToDetail(post.id)"
      >
        <img 
          :src="post.movie_poster" 
          alt="Movie Poster" 
          class="movie-poster"
        />
        <div class="post-content">
          <h3>{{ post.title || '영화 제목 없음' }}</h3>
          <p>{{ post.content || '내용이 없습니다.' }}</p>
        </div>
      </div>
    </div>
    <!-- 게시글이 없을 때 -->
    <div v-else>
      <p>게시글이 없습니다.</p>
    </div>

    <button @click="goToCreatePost" class="create-post-button">게시글 작성하기</button>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const posts = ref([])  // 게시글 데이터를 담을 배열
const loading = ref(true)  // 로딩 상태
const error = ref(null)  // 에러 상태
const router = useRouter()

const goToDetail = (postId) => {
  router.push(`/community/${postId}`) // 게시글 ID로 상세 페이지로 이동
}

const goToCreatePost = () => {
  router.push('/article-create') // 게시글 작성 페이지로 이동
}

onMounted(async () => {
  const token = localStorage.getItem('userToken');  // 로컬스토리지에서 토큰 가져오기

  try {
    const response = await axios.get('http://localhost:8000/api/posts/', {
      headers: {
        Authorization: `Token ${token}`,  // 토큰을 헤더에 추가
      },
    })
    if (Array.isArray(response.data)) {
      posts.value = response.data  // 받은 데이터를 posts에 할당
    } else {
      error.value = '잘못된 데이터 형식입니다.'
    }
  } catch (err) {
    error.value = '게시글을 불러오는 중 오류가 발생했습니다.'  // 에러 발생 시 처리
  } finally {
    loading.value = false  // 로딩 상태를 false로 변경
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

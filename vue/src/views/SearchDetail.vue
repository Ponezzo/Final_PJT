<template>
  <div class="movie-detail">
    <div class="movie-detail-content">
      <!-- 왼쪽: 영화 포스터 -->
      <div class="movie-poster">
        <img :src="'https://image.tmdb.org/t/p/original' + movie.poster_path" alt="Movie Poster" />
        <button @click="toggleLike" :class="{'liked': isLiked}" class="like-button">
          <span v-if="isLiked">❤️</span>
          <span v-else>🤍</span>
        </button>
      </div>
      
      <!-- 오른쪽: 영화 정보 -->
      <div class="movie-info">
        <h2>{{ movie.title }}</h2>
        <p><strong>평점:</strong> {{ roundedVoteAverage }}</p>
        <p><strong>줄거리:</strong> {{ movie.overview || '없음' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useCounterStore } from '@/stores/counter'

const route = useRoute()
const movieId = route.params.id // URL에서 영화 ID를 받아옵니다.
const movie = ref({}) // 영화 정보 저장

// Counter.js 스토어 사용
const counterStore = useCounterStore()

// 좋아요 상태
const isLiked = computed(() => {
  return counterStore.likedMovies.includes(movie.value.id)
})

// 영화 상세 정보를 가져오는 함수
const fetchMovieDetail = async () => {
  const searchedMovies = JSON.parse(localStorage.getItem('searchedMovies')) || []
  movie.value = searchedMovies.find(m => m.id === parseInt(movieId)) || {}
  
  if (!movie.value.title) {
    const TMDB_API_KEY = 'b7526ccdb602bef47d4d9a189ce86d82'
    const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}&language=ko-KR`
    try {
      const response = await fetch(url)
      const data = await response.json()
      movie.value = data
    } catch (error) {
      console.error('영화 세부 정보 오류:', error)
    }
  }
}

// 소수 첫째자리로 반올림한 평점
const roundedVoteAverage = computed(() => {
  return movie.value.vote_average ? (Math.round(movie.value.vote_average * 10) / 10).toFixed(1) : '없음'
})

// 좋아요 토글 함수
const toggleLike = () => {
  if (isLiked.value) {
    // 좋아요 취소
    counterStore.removeLikedMovie(movie.value.id)  // 좋아요 취소 메서드 호출
  } else {
    // 좋아요 추가
    counterStore.addLikedMovie(movie.value.id)  // 좋아요 추가 메서드 호출
  }
}

// 영화 데이터 로드
onMounted(() => {
  fetchMovieDetail() // 페이지가 로드되면 영화 정보를 가져옵니다.
})
</script>

<style scoped>
.movie-detail {
  display: flex;
  justify-content: center;
  margin: 20px;
}

.movie-detail-content {
  display: flex;
  justify-content: space-between;
  width: 80%;
}

.movie-poster {
  position: relative; /* 버튼 위치가 포스터를 기준으로 설정될 수 있도록 */
}

.movie-poster img {
  width: 100%; /* 포스터 크기를 화면 크기에 맞게 조정 */
  height: 800px; /* 원하는 높이로 설정 (적당한 크기) */
  object-fit: cover; /* 이미지 비율을 유지하면서 자르기 */
  border-radius: 8px;
}

.like-button {
  position: absolute;
  margin-top: 10px;
  top: 1px;
  right: 10px;
  padding: 10px;
  width: 50px;
  height: 50px;
  background-color: transparent;
  border: 2px solid #ece8e8;
  border-radius: 50%;
  cursor: pointer;
  font-size: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
}

.like-button:hover {
  background-color: #ece8e8;
}

.liked {
  border-color: #ff4757;
  color: #ff4757;
}

.movie-info {
  margin-left: 20px;
  width: 60%;
}

.movie-info h2 {
  margin: 0;
  font-size: 2rem;
}

.movie-info p {
  margin: 10px 0;
}
</style>

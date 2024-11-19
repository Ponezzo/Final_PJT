<template>
  <div v-if="movie.title" class="detail-container">
    <!-- 왼쪽: 영화 포스터 -->
    <div class="detail-left">
      <img 
        :src="'https://image.tmdb.org/t/p/original' + movie.poster_path" 
        alt="Movie Poster" 
        class="detail__image" 
      />
    </div>

    <!-- 오른쪽: 영화 정보 및 예고편 -->
    <div class="detail-right">
      <h2 class="detail__title">{{ movie.title }}</h2>
      <p class="detail__release-date">개봉일: {{ movie.release_date }}</p>
      <p class="detail__rating">평점: {{ movie.vote_average }}</p>
      <p class="detail__overview">{{ movie.overview }}</p>
      <div v-if="trailerUrl" class="trailer-container">
        <iframe 
          :src="trailerUrl" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen 
          class="trailer"
        ></iframe>
      </div>
    </div>
  </div>
  <div v-else class="loading">Loading movie details...</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCounterStore } from '@/stores/counter'

const route = useRoute()
const counterStore = useCounterStore()
const movie = ref({})
const trailerUrl = ref('')

// YouTube API 키 설정
const YOUTUBE_API_KEY = 'AIzaSyAZ5GQ7-50-mz0lwQLn8KC9z7D7OS768k8'

// 영화 세부 정보 및 예고편 로드
onMounted(() => {
  const movieId = route.params.id
  counterStore.getMovies().then(() => {
    const selectedMovie = counterStore.movies.find(m => m.id === parseInt(movieId))
    if (selectedMovie) {
      movie.value = selectedMovie
      fetchTrailer(selectedMovie.title)
    } else {
      console.error('Movie not found')
    }
  })
})

// YouTube에서 예고편 검색
const fetchTrailer = async (title) => {
  const query = `${title} official trailer`
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=${encodeURIComponent(query)}&key=${YOUTUBE_API_KEY}`
  
  try {
    const response = await fetch(url)
    const data = await response.json()
    if (data.items && data.items.length > 0) {
      const videoId = data.items[0].id.videoId
      trailerUrl.value = `https://www.youtube.com/embed/${videoId}?autoplay=1`
    } else {
      console.error('No trailer found')
    }
  } catch (error) {
    console.error('Error fetching trailer:', error)
  }
}
</script>

<style scoped>
@import url('//fonts.googleapis.com/earlyaccess/nanummyeongjo.css');

/* 전체 레이아웃 */

.detail-container {
  font-family: 'Nanum Myeongjo', serif;
  font-weight: 900;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px; /* 왼쪽과 오른쪽 간격 */
  height: 100vh;
  padding: 20px;
  box-sizing: border-box;
}

/* 왼쪽: 영화 포스터 */
.detail-left {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.detail__image {
  margin-top: 70px;
  width: 90%;
  border-radius: 10px;
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.3);
}

/* 오른쪽: 영화 정보 및 예고편 */
.detail-right {
  margin-top: 50px;
  flex: 2;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 1px;
  max-width: 70%; /* 오른쪽 최대 너비 */
}

.detail__title {
  font-size: 36px;
  font-weight: bold;
  color: #ece8e8; /* 제목 텍스트 색상을 흰색으로 설정 */
  margin-bottom: 40px;
}

.detail__release-date,
.detail__rating {
  margin-bottom: 10px;
  font-size: 25px;
  color: #ece8e8; /* 정보 텍스트 색상 흰색 */
  width: 80%;
  line-height: 1.8;
}

.detail__overview {
  height: 175px;
  width: 65%;
  font-size: 18px;
  color: #ece8e8; /* 줄거리 텍스트 색상 흰색 */
}

.trailer-container {
  width: 80%;
  height: 315px;
}

.trailer {
  width: 58%;
  height: 100%;
  border-radius: 10px;
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.3);
}

/* Loading 상태 스타일 */
.loading {
  font-size: 18px;
  color: #888;
  text-align: center;
  padding: 20px;
}
</style>

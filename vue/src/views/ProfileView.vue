<template>
  <div class="profile-container">
    <div class="left-section">
      <div class="favorite-movie">
        <template v-if="!favoriteMovie || likedMovies.length === 0">
          <p class="no-favorite-movie">최애 영화를 선택해주세요.</p>
        </template>
        <template v-else>
          <h2 class="section-title"></h2>
          <img 
            :src="'https://image.tmdb.org/t/p/original' + favoriteMovie.poster_path" 
            :alt="favoriteMovie.title + ' Poster'" 
            class="favorite-movie-poster"
          />
        </template>
      </div>
    </div>
    <div class="right-section">
      <div class="liked-movies">
        <h2 class="section-title">💜</h2>
        <div 
          class="movies-list" 
          @wheel="onWheel"
        >
          <div 
            v-for="movie in likedMovies" 
            :key="movie.id" 
            class="movie-item"
            :class="{'selected': isSelected(movie.id), 'selectable': selectMode}"
            @click="selectMode ? selectMovie(movie) : goToDetail(movie)"
          >
            <img 
              v-if="movie.poster_path" 
              :src="'https://image.tmdb.org/t/p/w500' + movie.poster_path" 
              :alt="movie.title + ' Poster'" 
              class="movie-poster" 
            />
            <img 
              v-else 
              src="https://via.placeholder.com/500x750?text=No+Image" 
              alt="No Image Available" 
              class="movie-poster" 
            />
            <p class="movie-title">{{ movie.title }}</p>
            <div v-if="isSelected(movie.id)" class="checkmark">✔</div>
          </div>
        </div>
        <button @click="toggleSelectMode" class="select-favorite-button">
          {{ selectMode ? '선택 완료' : '최애영화 선택하기' }}
        </button>
      </div>

      <div class="my-posts">
        <h2 class="section-title">내가 쓴 게시글</h2>
        <p class="no-posts">게시글이 없습니다.</p>
      </div>

      <div class="my-comments">
        <h2 class="section-title">내가 쓴 댓글</h2>
        <p class="no-comments">댓글이 없습니다.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watchEffect, watch, onMounted } from 'vue'
import { useCounterStore } from '@/stores/counter'
import { useRouter } from 'vue-router'
import axios from 'axios'

const counterStore = useCounterStore()
const router = useRouter()

const selectMode = ref(false)
const selectedMovieId = ref(null)

const likedMovies = computed(() => counterStore.likedMovies);

// TMDB API 키
const apiKey = import.meta.env.VITE_TMDB_API_KEY;  // 환경 변수로 API 키 가져오기

// 로컬 스토리지에 저장된 최애 영화 ID 가져오기
const favoriteMovieId = ref(localStorage.getItem('favoriteMovieId'))

// 최애 영화 계산
const favoriteMovie = computed(() => {
  if (
    likedMovies.value.length === 0 ||
    !likedMovies.value.some(movie => movie.id === parseInt(favoriteMovieId.value))
  ) {
    return null
  }
  return likedMovies.value.find(movie => movie.id === parseInt(favoriteMovieId.value))
})

// TMDB에서 영화 정보 가져오기
const fetchMovieDetails = async () => {
  const moviePromises = likedMovies.value.map(async (movieId) => {
    const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=ko-KR`)
    return response.data
  })

  counterStore.movies = await Promise.all(moviePromises)
}

// 좋아요 리스트 변화 감지
watch(likedMovies, (newLikedMovies) => {
  console.log('Liked Movies Updated:', newLikedMovies)
  if (newLikedMovies.length === 0) {
    favoriteMovieId.value = null
    localStorage.removeItem('favoriteMovieId')
  }
})

// 최애 영화 선택 모드 토글
const toggleSelectMode = () => {
  selectMode.value = !selectMode.value
  if (!selectMode.value && selectedMovieId.value) {
    favoriteMovieId.value = selectedMovieId.value
    localStorage.setItem('favoriteMovieId', selectedMovieId.value)
    counterStore.setFavoriteMovie(selectedMovieId.value)
  }
}

// 영화 선택
const selectMovie = (movie) => {
  if (selectMode.value) {
    selectedMovieId.value = movie.id
  }
}

// 선택된 영화 확인
const isSelected = (movieId) => selectedMovieId.value === movieId

// 디테일 페이지로 이동
const goToDetail = (movie) => {
  router.push(`/search-detail/${movie.id}`)
}

// 로컬 스토리지 동기화
watchEffect(() => {
  if (favoriteMovieId.value) {
    localStorage.setItem('favoriteMovieId', favoriteMovieId.value)
  }
})

// 컴포넌트가 마운트될 때 TMDB API에서 영화 정보를 가져옵니다
onMounted(() => {
  fetchMovieDetails()
})

// 부드러운 마우스 휠 가로 스크롤 처리
let scrollTimeout;
const onWheel = (event) => {
  const scrollContainer = event.currentTarget;
  const deltaX = event.deltaY || event.detail || event.wheelDelta;

  if (scrollTimeout) {
    clearTimeout(scrollTimeout);
  }

  // 부드러운 스크롤을 위해 requestAnimationFrame 사용
  scrollTimeout = setTimeout(() => {
    scrollContainer.scrollLeft += deltaX * 0.2;  // 스크롤 속도 조절
  }, 10);

  // 휠 이벤트의 기본 동작 방지 (세로 스크롤 방지)
  event.preventDefault();
}
</script>

<style scoped>
.profile-container {
  display: flex;
  justify-content: space-between;
  padding: 20px;
}

.left-section {
  width: 40%;
  text-align: center;
}

.right-section {
  width: 60%;
}

.favorite-movie {
  margin-bottom: 20px;
}

.favorite-movie-poster {
  width: 70%;
  height: auto;
  border-radius: 10px;
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.3);
}

.no-favorite-movie {
  font-size: 18px;
  color: #b8b8b8;
  text-align: center;
  margin-top: 50px;
}

.select-favorite-button {
  padding: 7px 13px;
  background-color: #634086;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

.select-favorite-button:hover {
  background-color: #8253b1;
}

.section-title {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 10px;
}

.movies-list {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  white-space: nowrap;
  width: 100%;
  min-width: 100%;
}

.movies-list::-webkit-scrollbar {
  height: 8px; /* 슬라이딩바의 높이 */
}


.movie-item {
  width: 150px;
  text-align: center;
  position: relative;
  flex-shrink: 0;
}

.movie-poster {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 10px;
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.3);
  transition: opacity 0.3s;
}

.movie-item.selected .movie-poster {
  opacity: 0.5;
}

.movie-item.selectable:hover .movie-poster {
  opacity: 0.7;
}

.checkmark {
  position: absolute;
  height: auto;
  width: 22px;
  top: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 5px;
  border-radius: 50%;
}

.movie-title {
  font-size: 16px;
  margin-top: 10px;
  color: #ece8e8;
  word-break: keep-all;
  white-space: normal;
}

.no-posts, .no-comments {
  font-size: 16px;
  color: #b8b8b8;
  text-align: center;
  padding: 20px;
}
</style>

<template>
  <div class="profile-container">
    <div class="left-section">
      <div class="favorite-movie">
        <!-- 좋아요 리스트가 비어있거나 최애 영화가 없을 경우 -->
        <template v-if="!favoriteMovie || likedMovies.length === 0">
          <p class="no-favorite-movie">최애 영화를 선택해주세요.</p>
        </template>
        <!-- 최애 영화가 있을 경우 -->
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
        <div class="movies-list">
          <div 
            v-for="movie in likedMovies" 
            :key="movie.id" 
            class="movie-item"
            :class="{'selected': isSelected(movie.id), 'selectable': selectMode}"
            @click="selectMode ? selectMovie(movie) : goToDetail(movie)"
          >
            <img 
              :src="'https://image.tmdb.org/t/p/original' + movie.poster_path" 
              :alt="movie.title + ' Poster'" 
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
import { ref, computed, watchEffect, watch } from 'vue'
import { useCounterStore } from '@/stores/counter'
import { useRouter } from 'vue-router'

const counterStore = useCounterStore()
const router = useRouter()

const selectMode = ref(false)
const selectedMovieId = ref(null)

// 좋아요한 영화 목록 계산
const likedMovies = computed(() => {
  // 좋아요 리스트에 포함된 영화들만 필터링
  return counterStore.movies.filter(movie => counterStore.likedMovies.includes(movie.id))
})

// 로컬 스토리지에 저장된 최애 영화 ID 가져오기
const favoriteMovieId = ref(localStorage.getItem('favoriteMovieId'))

// 최애 영화 계산
const favoriteMovie = computed(() => {
  // 좋아요 리스트가 비어 있거나, 최애 영화가 좋아요 리스트에 포함되지 않으면 null 반환
  if (
    likedMovies.value.length === 0 ||
    !likedMovies.value.some(movie => movie.id === parseInt(favoriteMovieId.value))
  ) {
    return null
  }
  return counterStore.movies.find(movie => movie.id === parseInt(favoriteMovieId.value))
})

// 좋아요 리스트 변화 감지
watch(likedMovies, (newLikedMovies) => {
  console.log('Liked Movies Updated:', newLikedMovies) // 좋아요 리스트 상태 출력
  if (newLikedMovies.length === 0) {
    // 좋아요 리스트가 비면 최애 영화 초기화
    favoriteMovieId.value = null
    localStorage.removeItem('favoriteMovieId')
  }
})

// 최애 영화 선택 모드 토글
const toggleSelectMode = () => {
  selectMode.value = !selectMode.value
  if (!selectMode.value && selectedMovieId.value) {
    // 선택 모드 종료 후 선택된 영화 저장
    favoriteMovieId.value = selectedMovieId.value
    localStorage.setItem('favoriteMovieId', selectedMovieId.value)
    counterStore.setFavoriteMovie(selectedMovieId.value)  // 좋아요 영화 저장 함수
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
  router.push(`/detail/${movie.id}`)
}

// 로컬 스토리지 동기화
watchEffect(() => {
  if (favoriteMovieId.value) {
    localStorage.setItem('favoriteMovieId', favoriteMovieId.value)
  }
})
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
  width: 73%;
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
}

.no-posts, .no-comments {
  font-size: 16px;
  color: #b8b8b8;
  text-align: center;
  padding: 20px;
}
</style>

<template>
  <div class="profile-container">
    <div class="left-section">
      <div v-if="favoriteMovie" class="favorite-movie">
        <h2 class="section-title"></h2>
        <img 
          :src="'https://image.tmdb.org/t/p/original' + favoriteMovie.poster_path" 
          :alt="favoriteMovie.title + ' Poster'" 
          class="favorite-movie-poster"
        />
        <!-- <p class="movie-title-2">{{ favoriteMovie.title }}</p> -->
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
        <!-- 버튼을 좋아요한 영화 리스트 오른쪽에 배치 -->
        <button @click="toggleSelectMode" class="select-favorite-button">
          {{ selectMode ? '선택 완료' : '최애영화 선택하기' }}
        </button>
      </div>

      <!-- 내가 쓴 게시글 -->
      <div class="my-posts">
        <h2 class="section-title">내가 쓴 게시글</h2>
        <p class="no-posts">게시글이 없습니다.</p>
      </div>

      <!-- 내가 쓴 댓글 -->
      <div class="my-comments">
        <h2 class="section-title">내가 쓴 댓글</h2>
        <p class="no-comments">댓글이 없습니다.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, watchEffect } from 'vue'
import { useCounterStore } from '@/stores/counter'
import { useRouter } from 'vue-router'

const counterStore = useCounterStore()
const router = useRouter()

// 상태 관리
const selectMode = ref(false)  // 최애영화 선택 모드 활성화 여부
const selectedMovieId = ref(null)  // 선택된 영화 ID

// 좋아요한 영화 목록
const likedMovies = computed(() => {
  return counterStore.movies.filter(movie => counterStore.likedMovies.includes(movie.id))
})

// 최애 영화 ID를 로컬 스토리지에서 읽어오기
const favoriteMovieId = ref(localStorage.getItem('favoriteMovieId'))

// 로컬 스토리지에서 최애영화가 변경될 때마다 반응하도록 처리
const favoriteMovie = computed(() => {
  if (favoriteMovieId.value) {
    return counterStore.movies.find(movie => movie.id === parseInt(favoriteMovieId.value))
  }
  return null
})

// 최애영화 선택 모드 토글
const toggleSelectMode = () => {
  selectMode.value = !selectMode.value
  if (!selectMode.value) {
    // 선택 모드 종료 시 최애영화 설정
    if (selectedMovieId.value) {
      localStorage.setItem('favoriteMovieId', selectedMovieId.value)
      favoriteMovieId.value = selectedMovieId.value  // 반영 후 업데이트
      counterStore.setFavoriteMovie(selectedMovieId.value)
    }
  }
}

// 영화 선택
const selectMovie = (movie) => {
  if (selectMode.value) {
    selectedMovieId.value = movie.id
    // 최애 영화로 선택된 영화 ID를 로컬 스토리지에 저장
    localStorage.setItem('favoriteMovieId', movie.id)
    favoriteMovieId.value = movie.id  // 반영 후 업데이트
    counterStore.setFavoriteMovie(movie.id)  // store에 최애 영화 설정
  }
}

// 선택된 영화 확인 여부
const isSelected = (movieId) => selectedMovieId.value === movieId

// 디테일 페이지로 이동
const goToDetail = (movie) => {
  router.push(`/detail/${movie.id}`)
}

// 로컬 스토리지에서 최애영화 ID가 변경될 때마다 반응형으로 반영
watchEffect(() => {
  // 로컬 스토리지의 favoriteMovieId가 변경될 때마다 반영하도록 처리
  if (favoriteMovieId.value) {
    localStorage.setItem('favoriteMovieId', favoriteMovieId.value)
  }
})
</script>

<style scoped>
/* 스타일은 기존과 동일 */
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

.select-favorite-button {
  padding: 7px 13px;
  background-color: #634086;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px; /* 추가된 마진으로 버튼을 영화 리스트 아래에 위치시킴 */
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
  overflow-x: auto; /* 가로 스크롤 활성화 */
  white-space: nowrap; /* 한 줄로 유지 */
  width: 100%; /* 부모 너비에 맞추기 */
  min-width: 100%; /* 최소 너비 100% */
}

.movie-item {
  width: 150px;
  text-align: center;
  position: relative;
  flex-shrink: 0; /* 아이템이 줄어들지 않도록 설정 */
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
  opacity: 0.5; /* 선택된 영화는 반투명 */
}

.movie-item.selectable:hover .movie-poster {
  opacity: 0.7; /* 선택 가능한 상태에서 마우스 오버 */
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

.movie-title-2 {
  font-size: 40px;
  margin-top: 10px;
  color: #ece8e8;
}

.no-posts, .no-comments {
  font-size: 16px;
  color: #b8b8b8;
  text-align: center;
  padding: 20px;
}

/* 커스터마이징된 스크롤바 */
.movies-list::-webkit-scrollbar {
  height: 10px; /* 스크롤바의 높이 */
}

.movies-list::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.3); /* 스크롤바의 색상 */
  width: 8px;
  border-radius: 0%;
}

.movies-list::-webkit-scrollbar-track {
  background-color: rgba(0, 0, 0, 0.1); /* 스크롤바의 트랙 색상 */
}
</style>

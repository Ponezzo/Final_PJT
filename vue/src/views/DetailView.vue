<template>
  <div v-if="movie.title" class="detail-container">
    <div class="detail-left">
      <img 
        :src="'https://image.tmdb.org/t/p/original' + movie.poster_path" 
        alt="Movie Poster" 
        class="detail__image" 
      />
    </div>
    <div class="detail-right">
      <div class="title-container">
        <h2 class="detail__title">{{ movie.title }}</h2> <br>
        <p class="detail__genre">#{{ genreNames }} </p> <!-- 장르 추가 -->
      </div>
      <p class="detail__release-date">개봉일 : {{ movie.release_date }}</p>
      <p class="detail__rating">평점 : {{ movie.vote_average.toFixed(1) }} / 10.0</p> <!-- 장르 추가 -->
      <p class="detail__overview">{{ movie.overview }}</p>

      <div v-if="trailerUrl" class="media-container">
        <iframe 
          :src="trailerUrl" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen 
          class="trailer"
        ></iframe>
        <div class="cast-slider">
          <h3 class="cast-title">출연 배우</h3>
          <div class="cast-list">
            <div class="cast-items-wrapper" 
              @animationend="handleAnimationEnd">
              <div v-for="actor in cast" :key="actor.id" class="cast-item">
                <img 
                  :src="'https://image.tmdb.org/t/p/original' + actor.profile_path" 
                  :alt="actor.name" 
                  class="cast-photo"
                />
                <p class="cast-name">{{ actor.name }}</p>
              </div>
            </div>
          </div>
          <div class="scrollbar" v-show="isHovered">
            <div 
              class="scrollbar-dot" 
              v-for="(dot, index) in cast.length" 
              :key="index"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="loading">Loading movie details...</div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useCounterStore } from '@/stores/counter'

const route = useRoute()
const counterStore = useCounterStore()
const movie = ref({}) // 영화 정보
const trailerUrl = ref('')
const cast = ref([]) // 캐스트 정보 저장
const isHovered = ref(false) // 마우스 hover 상태
const YOUTUBE_API_KEY = 'AIzaSyCfigBXGANP7S3HwM7VjUXfuCYWeKFe-m8'
const TMDB_API_KEY = 'd61d83be3016df68850ebfd3ba458c8c' // TMDb API 키 입력

// 장르 ID -> 한글 장르 이름 매핑
const genreMapping = {
  28: '액션',
  12: '모험',
  16: '애니메이션',
  35: '코미디',
  80: '범죄',
  99: '다큐멘터리',
  18: '드라마',
  10751: '가족',
  14: '판타지',
  36: '역사',
  27: '공포',
  10402: '뮤지컬',
  9648: '미스터리',
  10749: '로맨스',
  878: 'SF',
  10770: 'TV 영화',
  53: '스릴러',
  10752: '전쟁',
  37: '서부'
}

const genreNames = computed(() => {
  // 장르 이름을 한글로 변환 후 앞 두 개만 가져오기
  return movie.value.genres
    ? movie.value.genres.slice(0, 2).map(genre => genreMapping[genre.id] || genre.name).join(' #')
    : ''
})

const isLiked = computed(() => {
  return counterStore.likedMovies.includes(movie.value.id)
})

onMounted(() => {
  const movieId = route.params.id
  counterStore.getMovies().then(() => {
    const selectedMovie = counterStore.movies.find(m => m.id === parseInt(movieId))
    if (selectedMovie) {
      movie.value = selectedMovie
      fetchTrailer(selectedMovie.title)
      fetchCast(selectedMovie.id) // 캐스트 정보 가져오기
      fetchMovieDetails(selectedMovie.id) // 영화 세부 정보 가져오기
    } else {
      console.error('Movie not found')
    }
  })
})

// TMDb API를 사용해 영화의 세부 정보를 가져오는 함수 (장르 포함)
const fetchMovieDetails = async (movieId) => {
  const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}`
  try {
    const response = await fetch(url)
    const data = await response.json()
    movie.value.genres = data.genres // 장르 정보 추가
  } catch (error) {
    console.error('Error fetching movie details:', error)
  }
}

// TMDb API를 사용해 캐스트 정보를 가져오는 함수
const fetchCast = async (movieId) => {
  const url = `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${TMDB_API_KEY}`
  try {
    const response = await fetch(url)
    const data = await response.json()
    cast.value = data.cast.slice(0, 10) // 최대 10명의 캐스트 정보 가져오기
  } catch (error) {
    console.error('Error fetching cast:', error)
  }
}

const handleAnimationEnd = () => {
  // 마지막 캐스트 항목이 보이면 애니메이션을 멈추도록 처리
  const castItemsWrapper = document.querySelector('.cast-items-wrapper');
  const castItems = document.querySelectorAll('.cast-item');
  
  // 마지막 캐스트 항목의 오른쪽 끝이 화면을 벗어나는지 확인
  const lastItem = castItems[castItems.length - 1]; // 마지막 항목
  const lastItemRight = lastItem.getBoundingClientRect().right;

  if (lastItemRight <= window.innerWidth) {
    // 마지막 항목이 화면에 보이면 애니메이션을 멈추기
    castItemsWrapper.style.animationPlayState = 'paused';
  } else {
    // 그렇지 않으면 애니메이션 계속 진행
    castItemsWrapper.style.animationPlayState = 'running';
  }
}

// 유튜브 트레일러 검색
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

// 좋아요 토글
const toggleLike = () => {
  if (isLiked.value) {
    counterStore.removeLikedMovie(movie.value.id)
  } else {
    counterStore.addLikedMovie(movie.value.id)
  }
}
</script>

<style scoped>
@import url('//fonts.googleapis.com/earlyaccess/nanummyeongjo.css');

.detail-container {
  font-family: 'Nanum Myeongjo', serif;
  font-weight: 900;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  height: 100vh;
  box-sizing: border-box;
}

.detail-left {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.detail__image {
  margin-top: 25px;
  width: 75%;
  border-radius: 10px;
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.3);
}

.like-button {
  position: absolute;
  margin-top: 35px;
  top: 1px;
  right: 103.5px;
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

.detail-right {
  margin-top: 10px;
  flex: 2;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 1px;
  max-width: 60%;
}

.title-container {
  display: flex-end;
  align-items: center;
}

.detail__title {
  font-size: 36px;
  max-width: 90%;
  font-weight: bold;
  color: #ece8e8;
  margin-bottom: 0px;
}

.detail__genre {
  margin-bottom: 5px;
  margin-top: -20px;
  font-size: 15px;
  color: #ece8e8;
  width: 80%;
  margin-bottom: 10px;
}

.detail__release-date,
.detail__rating {
  margin-bottom: 5px;
  margin-top: 10px;
  font-size: 25px;
  color: #ece8e8;
  width: 80%;
}

.detail__overview {
  height: 175px;
  width: 90%;
  font-size: 18px;
  color: #ece8e8;
  line-height: 2.0;
  word-break: keep-all;
  white-space: normal;
  margin-bottom: 30px;
}

.media-container {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

.trailer {
  flex: 3;
  height: 315px;
  max-width: 560px;
  border-radius: 10px;
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.3);
}

.cast-slider {
  flex: 1;
  max-width: 24%;
  display: flex;
  flex-direction: column;
  background-color: rgba(0, 0, 0, 0.80);
  padding: 10px 20px;
  border-radius: 10px;
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.3);
  position: relative;
}

.cast-title {
  font-size: 20px;
  color: #ece8e8;
  margin-bottom: 10px;
}

.cast-list {
  display: flex;
  gap: 15px;
  overflow: hidden;
  position: relative;
  width: 100%;
}


.cast-item {
  flex: 0 0 auto;
  width: 100px;
  text-align: center;
  margin-right: 20px;
}

.cast-photo {
  width: 100%;
  height: 150px;
  border-radius: 10px;
  object-fit: cover;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  margin-bottom: 5px;
}

.cast-name {
  font-size: 14px;
  color: #ece8e8;
  text-overflow: ellipsis;
  white-space: break-word;
  overflow: hidden;
}

.loading {
  font-size: 18px;
  color: #888;
  text-align: center;
  padding: 20px;
}

.cast-items-wrapper {
  display: flex;
  transition: transform 15s ease-in-out; /* 슬라이드 애니메이션 */
  animation: auto-slide 150s infinite;
  animation-play-state: running; /* 초기 상태는 실행 */
}

/* 슬라이드 애니메이션 */
@keyframes auto-slide {
  0% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(-50%);
  }
  100% {
    transform: translateX(100);
  }
}

</style>

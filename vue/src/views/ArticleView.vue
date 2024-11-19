<template>
  <div class="carousel-container">
    <div class="carousel">
      <div 
        v-for="(movie, index) in movies" 
        :key="movie.id" 
        class="carousel__item" 
        :style="getStyle(index)"
        @click="goToDetailView(movie.id)"
        @mouseenter="onMouseEnter(index)"
        @mouseleave="onMouseLeave"
      >
        <!-- 포스터 이미지 -->
        <img 
          :src="'https://image.tmdb.org/t/p/original' + (movie.poster_path || '/path/to/default-image.jpg')" 
          alt="Movie Poster" 
          class="carousel__image" 
        />
        <!-- 포스터 번호 -->
        <div class="carousel__number">{{ index + 1 }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useCounterStore } from '@/stores/counter'
import { useRouter } from 'vue-router'

const router = useRouter()
const counterStore = useCounterStore()
const movies = ref([])  // 영화 리스트 저장
const rotationAngle = ref(0) // 회전 각도 설정
const hoveredIndex = ref(null) // 마우스가 올라간 포스터의 index

// 영화 데이터를 로드하고 회전 효과 설정
onMounted(() => {
  counterStore.getMovies().then(() => {
    movies.value = counterStore.movies.slice(0, 8)  // 영화 8개로 제한
    setInterval(() => {
      if (hoveredIndex.value === null) { // 마우스를 올리지 않았을 때만 회전
        rotationAngle.value -= 45  // 회전 각도 설정 (45도씩 이동)
      }
    }, 3500) // 3초마다 회전
  })
})

// 각 포스터의 스타일을 계산
const getStyle = (index) => {
  const angle = 45 * index + rotationAngle.value // 각 포스터의 위치 각도
  const rad = (angle * Math.PI) / 180 // 각도를 라디안으로 변환
  const x = Math.sin(rad) * 450 // x축 위치 계산 (간격을 넓힘)
  const z = Math.cos(rad) * 450 // z축 위치 계산 (간격을 넓힘)

  const scale = hoveredIndex.value === index ? 1.2 : 1 // 마우스를 올린 포스터만 확대
  const opacity = z > 0 ? 1 : 0.09 // z축 값에 따라 투명도 조정 (뒤쪽은 희미하게)

  return {
    transform: `translate3d(${x}px, -50%, ${z}px) rotateY(${angle}deg) scale(${scale})`,
    opacity: opacity,
    zIndex: z > 0 ? 10 : 0, // zIndex 값을 조정하여 클릭 가능한 포스터가 제일 앞에 오도록 설정
    transition: 'transform 0.5s ease-in-out, opacity 0.5s ease-in-out', // 부드러운 애니메이션 효과
  }
}

// 클릭 시 해당 영화의 상세 페이지로 이동
const goToDetailView = (movieId) => {
  router.push({ name: 'DetailView', params: { id: movieId } })
}

// 마우스를 포스터에 올렸을 때
const onMouseEnter = (index) => {
  hoveredIndex.value = index
}

// 마우스를 포스터에서 뗐을 때
const onMouseLeave = () => {
  hoveredIndex.value = null
}
</script>

<style scoped>
/* Carousel 스타일 */
.carousel-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  perspective: 1500px;
  overflow: hidden;
}

.carousel {
  position: relative;
  width: 400px;
  height: 500px;
  transform-style: preserve-3d;
  transition: transform 1s ease-in-out;
}

.carousel__item {
  position: absolute;
  top: 50%;
  left: 15%;
  width: 320px;
  height: 500px;
  transform-origin: center center;
  transform-style: preserve-3d;
  transition: transform 0.5s ease-in-out, opacity 0.5s ease-in-out;
  cursor: pointer; /* 클릭 가능한 요소로 표시 */
}

/* 포스터 이미지 */
.carousel__image {
  width: 100%;
  height: 100%;
  border-radius: 10px;
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.3);
}

/* 포스터 번호 스타일 */
.carousel__number {
  position: absolute;
  top: 5px;
  left: 5px;
  /* background-color: rgba(0, 0, 0, 0.7); 반투명 배경 */
  color:#f5f5f5;
  font-size: 55px;
  font-style: italic;
  font-weight: bold;
  padding: 5px 10px;
  border-radius: 5px;
  z-index: 20; /* 이미지 위에 표시되도록 설정 */
}
</style>

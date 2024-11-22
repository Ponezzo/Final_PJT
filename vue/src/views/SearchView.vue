<template>
  <div :class="{'search-container-dark': isFocused}" class="search-container">
    <input 
      v-model="searchQuery" 
      @input="onSearch" 
      type="text" 
      class="search-input" 
      placeholder=""
      @keyup.enter="onEnter"
      @focus="onFocus"
      @blur="onBlur"
      :class="{'shake': isShaking}"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const searchQuery = ref('') // 검색어 저장
const isFocused = ref(false) // 검색창 포커스 상태
const isShaking = ref(false) // 진동 애니메이션 상태 관리
const router = useRouter()

// 입력값 변경 시 처리
const onSearch = () => {
  console.log('검색어:', searchQuery.value)
  // 입력값이 비었을 때만 진동을 시작하고, 입력값이 있으면 진동을 멈춤
  if (isFocused.value) {
    isShaking.value = searchQuery.value.trim() === ''
  }
}

// 검색창 포커스 시 처리
const onFocus = () => {
  isFocused.value = true
  // 포커스가 되면 입력값에 따라 진동을 시작
  isShaking.value = searchQuery.value.trim() === '' 
}

// 검색창 포커스 아웃 시 처리
const onBlur = () => {
  isFocused.value = false
  // 포커스를 벗어나면 진동을 멈추고, 입력값에 따라 다시 진동 상태를 설정
  isShaking.value = false
}

const onEnter = () => {
  if (searchQuery.value.trim()) {
    // 엔터 키를 누르면 검색어를 URL 파라미터로 넘기며 검색 페이지로 이동
    router.push({ name: 'SearchList', query: { query: searchQuery.value } })
  }
}
</script>

<style scoped>
.search-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  transition: background-color 0.3s ease;
}

.search-input {
  width: 60%;
  height: 60px;
  padding: 10px;
  font-size: 20px;
  border: 2px solid #ece8e8;
  border-radius: 45px;
  background-color: rgba(255, 255, 255, 0.3);
  color: #333;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  caret-color: transparent;
  padding-left: 20px;
  transition: all 0.3s ease;
}

.search-input:focus {
  border-width: 15px;
  border-color: #CA19C7; /* 포커스 시 보라색 네온 */
  box-shadow: 0 0 10px #9B59B6; /* 보라색 네온 그림자 */
}

/* 진동 애니메이션 정의 */
@keyframes shake {
  0% {
    transform: translateX(0) translateY(0);
  }
  5% {
    transform: translateX(-1px) translateY(-0.5px);
  }
  10% {
    transform: translateX(1px) translateY(0.5px);
  }
  15% {
    transform: translateX(-2px) translateY(-1px);
  }
  20% {
    transform: translateX(2px) translateY(1px);
  }
  25% {
    transform: translateX(-2px) translateY(-1px);
  }
  30% {
    transform: translateX(2px) translateY(1px);
  }
  35% {
    transform: translateX(-1px) translateY(-0.5px);
  }
  40% {
    transform: translateX(1px) translateY(0.5px);
  }
  45% {
    transform: translateX(-1px) translateY(-0.5px);
  }
  50% {
    transform: translateX(1px) translateY(0.5px);
  }
  55% {
    transform: translateX(-0.5px) translateY(-0.25px);
  }
  60% {
    transform: translateX(0.5px) translateY(0.25px);
  }
  65% {
    transform: translateX(-0.5px) translateY(-0.25px);
  }
  70% {
    transform: translateX(0.5px) translateY(0.25px);
  }
  75% {
    transform: translateX(0) translateY(0);
  }
  100% {
    transform: translateX(0) translateY(0);
  }
}

.search-input.shake {
  animation: shake 4s ease-out infinite;
}

.search-input::placeholder {
  color: #ccc;
}
</style>

import { ref, computed, onMounted } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { useRouter } from 'vue-router'

export const useCounterStore = defineStore('counter', () => {
  const articles = ref([]) // 기존 게시글 데이터
  const movies = ref([]) // 최신 영화 데이터
  const likedMovies = ref([]) // 좋아요한 영화 목록
  const searchResults = ref([]) // 검색된 영화 목록
  const API_URL = 'http://127.0.0.1:8000'
  const token = ref(localStorage.getItem('userToken')) // localStorage에서 초기 토큰 가져오기
  const router = useRouter()

  // 인증 상태 여부
  const isLogin = computed(() => {
    return token.value !== null
  })

  // TMDB에서 최신 영화 가져오기
  const getMovies = function () {
    const apiKey = import.meta.env.VITE_TMDB_API_KEY
    const url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=ko-KR&region=KR`

    return axios.get(url)
      .then((res) => {
        movies.value = res.data.results || [] // TMDB 응답에서 results 배열 저장
      })
      .catch((err) => {
        console.error('Failed to fetch movies:', err)
      })
  }

  // 검색 결과 저장
  const saveSearchResults = () => {
    if (token.value) {
      localStorage.setItem(`searchResults_${token.value}`, JSON.stringify(searchResults.value))
    }
  }

  // 저장된 검색 결과 불러오기
  const loadSearchResults = () => {
    if (token.value) {
      const storedSearchResults = localStorage.getItem(`searchResults_${token.value}`)
      searchResults.value = storedSearchResults ? JSON.parse(storedSearchResults) : []
    }
  }

  // TMDB에서 영화 검색
  const searchMovies = (query) => {
    const apiKey = import.meta.env.VITE_TMDB_API_KEY
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&language=ko-KR`

    axios.get(url)
      .then((res) => {
        searchResults.value = res.data.results || []
        saveSearchResults() // 검색 결과 저장
      })
      .catch((err) => {
        console.error('Failed to search movies:', err)
      })
  }

  // 좋아요 추가
  const addLikedMovie = (movie) => {
    if (token.value && !likedMovies.value.some(m => m.id === movie.id)) {
      likedMovies.value.push(movie)
      localStorage.setItem(`likedMovies_${token.value}`, JSON.stringify(likedMovies.value))
    }
  }

  // 좋아요 취소
  const removeLikedMovie = (movieId) => {
    if (token.value) {
      likedMovies.value = likedMovies.value.filter(movie => movie.id !== movieId)
      localStorage.setItem(`likedMovies_${token.value}`, JSON.stringify(likedMovies.value))
    }
  }

  // 회원가입 요청
  const signUp = (payload) => {
    const { username, password1, password2 } = payload

    axios.post(`${API_URL}/accounts/signup/`, {
      username, password1, password2
    })
      .then(() => {
        logIn({ username, password: password1 })
      })
      .catch(err => console.error(err))
  }

  // 로그인 요청
  const logIn = (payload) => {
    const { username, password } = payload

    axios.post(`${API_URL}/accounts/login/`, { username, password })
      .then((res) => {
        token.value = res.data.key
        localStorage.setItem('userToken', token.value)
        loadLikedMovies() // 좋아요 목록 불러오기
        router.push({ name: 'ArticleView' }) // 로그인 후 이동
      })
      .catch(err => console.error(err))
  }

  // 로그아웃 요청
  const logOut = () => {
    token.value = null
    localStorage.removeItem('userToken')
    localStorage.removeItem(`likedMovies_${token.value}`)
    localStorage.removeItem(`searchResults_${token.value}`)
    likedMovies.value = []
    searchResults.value = []
    router.push({ name: 'LoginView' }) // 로그아웃 후 이동
  }

  // 좋아요 목록 로드
  const loadLikedMovies = () => {
    if (token.value) {
      const storedMovies = localStorage.getItem(`likedMovies_${token.value}`)
      likedMovies.value = storedMovies ? JSON.parse(storedMovies) : []
    }
  }

  // 페이지 로드 시 추천 영화 목록 불러오기
  onMounted(() => {
    loadSearchResults() // 저장된 검색 결과 불러오기
  })

  return {
    articles,
    movies,
    likedMovies,
    searchResults,
    API_URL,
    getMovies,
    searchMovies,
    saveSearchResults,
    loadSearchResults,
    signUp,
    logIn,
    logOut,
    token,
    isLogin,
    addLikedMovie,
    removeLikedMovie,
  }
}, { persist: true })

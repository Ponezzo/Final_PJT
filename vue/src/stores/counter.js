import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { useRouter } from 'vue-router'

export const useCounterStore = defineStore('counter', () => {
  const articles = ref([])  // 기존 게시글 데이터
  const movies = ref([])     // 최신 영화 데이터
  const likedMovies = ref([]) // 좋아요한 영화 목록
  const API_URL = 'http://127.0.0.1:8000'
  const token = ref(localStorage.getItem('userToken'))  // localStorage에서 초기 토큰을 가져옵니다.
  const router = useRouter()

  // 인증 상태 여부를 나타낼 속성 값 지정
  const isLogin = computed(() => {
    return token.value !== null
  })

  // DRF로 전체 게시글 요청을 보내고 응답을 받아 articles에 저장하는 함수
  const getArticles = function () {
    axios({
      method: 'get',
      url: `${API_URL}/api/v1/movies/`,
      headers: {
        Authorization: `Token ${token.value}`
      }
    })
      .then((res) => {
        articles.value = res.data
      })
      .catch((err) => {
        console.log(err)
      })
  }

  // TMDB에서 최신 영화를 가져오는 함수
  const getMovies = function () {
    const apiKey = import.meta.env.VITE_TMDB_API_KEY  // 환경 변수로 API 키를 가져옵니다
    const url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=ko-KR&region=KR`

    return axios({
      method: 'get',
      url: url
    })
      .then((res) => {
        movies.value = res.data.results || []  // TMDB 응답에서 results 배열을 저장
      })
      .catch((err) => {
        console.log('Failed to fetch movies:', err)
      })
  }

  // 회원가입 요청 액션
  const signUp = (payload) => {
    const { username, password1, password2 } = payload

    axios({
      method: 'post',
      url: `${API_URL}/accounts/signup/`,
      data: {
        username, password1, password2
      }
    })
      .then(res => {
        const password = password1
        logIn({ username, password })
      })
      .catch(err => console.log(err))
  }

  // 로그인 요청 액션
  const logIn = (payload) => {
    const { username, password } = payload

    axios({
      method: 'post',
      url: `${API_URL}/accounts/login/`,
      data: {
        username, password
      }
    })
      .then(res => {
        token.value = res.data.key
        localStorage.setItem('userToken', token.value)  // 사용자 토큰을 로컬 스토리지에 저장
        loadLikedMovies() // 로그인 후 좋아요 목록 불러오기
        router.push({ name: 'ArticleView' })  // 로그인 후, ArticleView 페이지로 이동
      })
      .catch(err => console.log(err))
  }

  // 로그아웃 요청 액션
  const logOut = () => {
    token.value = null  // 토큰 초기화 (로그아웃 처리)
    localStorage.removeItem('userToken')  // 로컬 저장소에서 사용자 토큰 삭제
    localStorage.removeItem(`likedMovies_${token.value}`) // 좋아요 목록 삭제
    router.push({ name: 'LoginView' })  // 로그아웃 후, LoginView 페이지로 리다이렉트
  }

  // 좋아요한 영화를 로컬 스토리지에서 불러오기
  const loadLikedMovies = () => {
    if (token.value) {
      const savedMovies = localStorage.getItem(`likedMovies_${token.value}`)
      if (savedMovies) {
        likedMovies.value = JSON.parse(savedMovies)
      } else {
        likedMovies.value = []
      }
    }
  }

  // 좋아요 추가
  const addLikedMovie = (movie) => {
    if (token.value && !likedMovies.value.some(m => m.id === movie.id)) {
      likedMovies.value.push(movie)
      localStorage.setItem(`likedMovies_${token.value}`, JSON.stringify(likedMovies.value))  // 로컬 스토리지에 저장
    }
  }

  // 좋아요 취소
  const removeLikedMovie = (movieId) => {
    if (token.value) {
      likedMovies.value = likedMovies.value.filter(movie => movie.id !== movieId)
      localStorage.setItem(`likedMovies_${token.value}`, JSON.stringify(likedMovies.value))  // 로컬 스토리지에 저장
    }
  }

  return {
    articles,
    movies,
    likedMovies,  // likedMovies 추가
    API_URL,
    getArticles,
    getMovies,
    signUp,
    logIn,
    logOut,
    token,
    isLogin,
    addLikedMovie,
    removeLikedMovie,
    loadLikedMovies  // 로컬 스토리지에서 좋아요 목록 로드하는 함수 추가
  }
}, { persist: true })

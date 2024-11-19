import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { useRouter } from 'vue-router'

export const useCounterStore = defineStore('counter', () => {
  const articles = ref([])  // 기존 게시글 데이터
  const movies = ref([])     // 최신 영화 데이터
  const API_URL = 'http://127.0.0.1:8000'
  const token = ref(null)
  const router = useRouter()

  // 인증 상태 여부를 나타낼 속성 값 지정
  const isLogin = computed(() => {
    if (token.value === null) {
      return false
    } else {
      return true
    }
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
        router.push({ name: 'ArticleView' })
      })
      .catch(err => console.log(err))
  }

  return { 
    articles, 
    movies,  // movies 배열 추가
    API_URL, 
    getArticles, 
    getMovies,  // getMovies 함수 추가
    signUp, 
    logIn, 
    token, 
    isLogin 
  }
}, { persist: true })

<template>
  <div class="article-create">
    <h1>게시글 작성</h1>

    <form @submit.prevent="createPost">
      <div class="form-group">
        <label for="title">제목</label>
        <input 
          type="text" 
          id="title" 
          v-model="title" 
          placeholder="제목을 입력하세요" 
          required 
        />
      </div>

      <div class="form-group">
        <label for="movie">영화 검색</label>
        <input 
          type="text" 
          id="movie" 
          v-model="searchQuery" 
          placeholder="영화를 검색하세요" 
          @input="searchMovies" 
        />
        <div v-if="searchResults.length" class="search-results">
          <div 
            v-for="movie in searchResults" 
            :key="movie.id" 
            @click="selectMovie(movie)" 
            class="search-item"
          >
            <img :src="'https://image.tmdb.org/t/p/w200' + movie.poster_path" alt="Poster" />
            <span>{{ movie.title }}</span>
          </div>
        </div>
      </div>

      <div v-if="selectedMovie" class="selected-movie">
        <h3>선택된 영화: {{ selectedMovie.title }}</h3>
        <img :src="'https://image.tmdb.org/t/p/w200' + selectedMovie.poster_path" alt="Selected Poster" />
      </div>

      <div class="form-group">
        <label for="content">내용</label>
        <textarea 
          id="content" 
          v-model="content" 
          placeholder="내용을 입력하세요" 
          required 
        ></textarea>
      </div>

      <button type="submit" class="submit-button">작성하기</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const title = ref('')
const content = ref('')
const searchQuery = ref('')
const searchResults = ref([])
const selectedMovie = ref(null)
const router = useRouter()

const searchMovies = async () => {
  if (searchQuery.value.trim() === '') {
    searchResults.value = []
    return
  }

  try {
    const response = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
      params: {
        api_key: 'd61d83be3016df68850ebfd3ba458c8c', // TMDB API 키
        query: searchQuery.value,
      },
    })
    searchResults.value = response.data.results
  } catch (error) {
    console.error('영화 검색 중 오류 발생:', error)
  }
}

const selectMovie = (movie) => {
  selectedMovie.value = movie
  searchResults.value = []
}

import axios from '../axios'; // axios 인스턴스

const createPost = async () => {
  if (!selectedMovie.value) {
    alert('영화를 선택해주세요!');
    return;
  }

  const token = localStorage.getItem('userToken');  // 저장된 토큰 가져오기

  if (!token) {
    alert('로그인 후 게시글을 작성할 수 있습니다.');
    return;
  }

  // 포스터 URL을 완전한 URL로 변환
  const moviePosterUrl = 'https://image.tmdb.org/t/p/w200' + selectedMovie.value.poster_path;

  try {
    const response = await axios.post('http://localhost:8000/api/posts/', {
      title: title.value,
      content: content.value,
      movie_title: selectedMovie.value.title,
      movie_poster: moviePosterUrl,  // 완전한 URL로 전달
    }, {
      headers: {
        Authorization: `Token ${token}`,  // 인증 토큰을 헤더에 추가
      },
    });

    alert('게시글이 성공적으로 작성되었습니다.');
    router.push('/community');  // 게시글 작성 후 커뮤니티 페이지로 이동
  } catch (error) {
    console.error('게시글 작성 중 오류 발생:', error);

    if (error.response) {
      // 서버 응답 오류 메시지 출력
      console.error('서버 응답 오류:', error.response.data);
      alert(`게시글 작성에 실패했습니다: ${error.response.data}`);
    } else if (error.request) {
      console.error('서버 요청 오류:', error.request);
      alert('서버에 요청을 보낼 수 없습니다.');
    } else {
      console.error('오류 발생:', error.message);
      alert('게시글 작성에 실패했습니다.');
    }
  }
};




</script>

<style scoped>
/* 기존 스타일 유지 + 영화 검색 스타일 추가 */
.search-results {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
}

.search-item {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.search-item:hover {
  background-color: #f0f0f0;
}

.selected-movie {
  margin: 20px 0;
  text-align: center;
}

.selected-movie img {
  max-width: 100px;
  border-radius: 10px;
}
</style>

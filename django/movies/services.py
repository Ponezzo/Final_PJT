import requests
import json
from .models import Movie, Genre
from django.conf import settings  # API_KEY를 .env에서 가져오기 위한 방법
from django.core.exceptions import ValidationError

API_KEY = settings.TMDB_API_KEY  # .env에 저장된 API_KEY 불러오기
BASE_URL = "https://api.themoviedb.org/3/movie/popular"
LANGUAGE = "ko"
TOTAL_PAGES = 5  # 가져올 페이지 수 (원하는 페이지 수로 변경)

def fetch_tmdb_movies():
    all_movies = []  # 모든 영화를 저장할 리스트

    # 여러 페이지에서 데이터를 가져옴
    for page in range(1, TOTAL_PAGES + 1):
        url = f"{BASE_URL}?api_key={API_KEY}&language={LANGUAGE}&page={page}"
        response = requests.get(url)

        if response.status_code == 200:  # 요청이 성공적일 경우
            movies_data = response.json()['results']

            for movie_data in movies_data:
                # 장르 정보 처리
                genres = movie_data['genre_ids']
                genres_list = []

                for genre_id in genres:
                    genre, created = Genre.objects.get_or_create(id=genre_id)  # Genre 모델에 맞춰서
                    genres_list.append(genre.id)

                # 영화 정보 생성
                movie = {
                    "model": "movies.movie",  # movie 앱의 Movie 모델
                    "pk": movie_data['id'],
                    "fields": {
                        "title": movie_data['title'],
                        "overview": movie_data['overview'],
                        "release_date": movie_data['release_date'],
                        "poster_path": movie_data['poster_path'],
                        "vote_average": movie_data['vote_average'],
                        "genres": genres_list  # ManyToMany 필드인 genres는 ID 리스트로 전달
                    }
                }
                all_movies.append(movie)
        else:
            raise ValidationError(f"Failed to fetch data for page {page}: {response.status_code}")

    # 파일로 저장
    with open('movies/fixtures/movies_data.json', 'w', encoding='utf-8') as f:
        json.dump(all_movies, f, ensure_ascii=False, indent=4)

    print(f"Successfully fetched data for {len(all_movies)} movies across {TOTAL_PAGES} pages.")

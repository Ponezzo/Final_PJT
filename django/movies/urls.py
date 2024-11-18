from django.urls import path
from . import views

app_name = 'movies'

urlpatterns = [
    path('', views.MovieListView.as_view(), name='movie_list'),  # 영화 목록 보기
    path('<int:id>/', views.MovieDetailView.as_view(), name='movie_detail'),  # 영화 상세 보기
    path('recommendations/', views.RecommendationListView.as_view(), name='movie_recommendations'),  # 추천 영화 보기
    path('fetch-movies/', views.FetchMoviesView.as_view(), name='fetch_movies'),  # 영화 데이터 가져오기
]

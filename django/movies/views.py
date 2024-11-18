from rest_framework import generics
from .models import Movie, Recommendation
from .serializers import MovieSerializer, RecommendationSerializer
from django.http import JsonResponse
from rest_framework.views import APIView
from .services import fetch_tmdb_movies  # 서비스 파일에서 함수 호출

# 영화 목록 보기
class MovieListView(generics.ListAPIView):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer


# 영화 상세 보기
class MovieDetailView(generics.RetrieveAPIView):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    lookup_field = 'id'  # URL에서 'id' 필드를 사용


# 추천 영화 보기
class RecommendationListView(generics.ListAPIView):
    queryset = Recommendation.objects.all()
    serializer_class = RecommendationSerializer


class FetchMoviesView(APIView):
    def get(self, request):
        # TMDb API에서 영화 데이터 가져오기
        fetch_tmdb_movies()  # 데이터 가져오기 함수 호출
        
        return JsonResponse({"message": "Movies fetched successfully"})

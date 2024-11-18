from rest_framework import serializers
from .models import Genre, Movie, Recommendation

class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ['id', 'name']

class MovieSerializer(serializers.ModelSerializer):
    genres = GenreSerializer(many=True, read_only=True)  # ManyToMany 관계 처리

    class Meta:
        model = Movie
        fields = ['id', 'title', 'overview', 'release_date', 'poster_path', 'vote_average', 'genres']

class RecommendationSerializer(serializers.ModelSerializer):
    movie = MovieSerializer(read_only=True)  # 영화 정보 포함
    user = serializers.StringRelatedField()  # 사용자 이름 표시

    class Meta:
        model = Recommendation
        fields = ['id', 'user', 'movie', 'algorithm', 'created_at']

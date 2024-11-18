from rest_framework import serializers
from .models import Review
from movies.serializers import MovieSerializer  # 영화 정보를 포함하기 위해 import

class ReviewSerializer(serializers.ModelSerializer):
    movie = MovieSerializer(read_only=True)  # 영화 정보 포함
    user = serializers.StringRelatedField()  # 사용자 이름 표시

    class Meta:
        model = Review
        fields = ['id', 'user', 'movie', 'content', 'rating', 'created_at']

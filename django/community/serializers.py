from rest_framework import serializers
from .models import Post, Comment

class CommentSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()  # 사용자 이름 표시

    class Meta:
        model = Comment
        fields = ['id', 'user', 'content', 'created_at']

class PostSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()  # 사용자 이름 표시
    comments = CommentSerializer(many=True, read_only=True)  # Post의 모든 댓글 포함

    class Meta:
        model = Post
        fields = ['id', 'user', 'title', 'content', 'created_at', 'updated_at', 'comments']

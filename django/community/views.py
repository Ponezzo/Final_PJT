from rest_framework import generics
from rest_framework.permissions import IsAuthenticated  # 인증된 사용자만 접근
from .models import Post, Comment
from .serializers import PostSerializer, CommentSerializer

# 게시물 목록 보기
class PostListView(generics.ListCreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]  # 인증된 사용자만 접근

    def perform_create(self, serializer):
        # 새로운 게시물 작성 시 자동으로 현재 사용자를 user 필드에 할당
        serializer.save(user=self.request.user)

# 게시물 상세 보기
class PostDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

# 게시물 생성
class PostCreateView(generics.CreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]  # 인증된 사용자만 접근

    def perform_create(self, serializer):
        # 새로운 게시물 작성 시 자동으로 현재 사용자를 user 필드에 할당
        serializer.save(user=self.request.user)

# 댓글 작성
class CommentCreateView(generics.CreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]  # 인증된 사용자만 접근

    def perform_create(self, serializer):
        # URL에서 post_id를 받아 해당 게시물을 가져옴
        post = Post.objects.get(id=self.kwargs['post_id'])  # URL에서 받은 post_id를 사용
        # 새로운 댓글 작성 시 자동으로 현재 사용자를 user 필드에 할당하고 해당 게시물에 연결
        serializer.save(user=self.request.user, post=post)

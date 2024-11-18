from django.urls import path
from . import views

app_name = 'community'

urlpatterns = [
    path('', views.PostListView.as_view(), name='post_list'),  # 게시물 목록 보기
    path('<int:id>/', views.PostDetailView.as_view(), name='post_detail'),  # 게시물 상세 보기
    path('create/', views.PostCreateView.as_view(), name='post_create'),  # 게시물 작성
    path('<int:post_id>/comments/', views.CommentCreateView.as_view(), name='comment_create'),  # 댓글 작성
]

from django.urls import path
from . import views

app_name = 'reviews'

urlpatterns = [
    path('', views.ReviewListView.as_view(), name='review_list'),  # 리뷰 목록 보기
    path('<int:id>/', views.ReviewDetailView.as_view(), name='review_detail'),  # 리뷰 상세 보기
    path('create/', views.ReviewCreateView.as_view(), name='review_create'),  # 리뷰 작성
]

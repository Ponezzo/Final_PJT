from rest_framework import generics
from .models import Review
from .serializers import ReviewSerializer

# 리뷰 목록 보기
class ReviewListView(generics.ListAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer


# 리뷰 상세 보기
class ReviewDetailView(generics.RetrieveAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    lookup_field = 'id'  # URL에서 'id' 필드를 사용


# 리뷰 작성
class ReviewCreateView(generics.CreateAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer

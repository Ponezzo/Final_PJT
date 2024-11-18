"""
URL configuration for Final_project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),

    # movies 앱
    path('api/v1/', include('movies.urls')),  # 이미 설정된 movies 앱 경로
    
    # 사용자 인증 관련 URL
    path('users/', include('dj_rest_auth.urls')),  # 로그인, 로그아웃, 비밀번호 변경 등
    path('users/signup/', include('dj_rest_auth.registration.urls')),  # 회원가입 관련
    
    # 리뷰 관련 URL
    path('api/v1/reviews/', include('reviews.urls')),  # 리뷰 관련 API 엔드포인트
    
    # 커뮤니티 관련 URL
    path('api/v1/community/', include('community.urls')),  # 커뮤니티 게시판 관련 API 엔드포인트
]

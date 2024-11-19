from django.urls import path
from . import views

appname = 'users'
urlpatterns = [
    path('signup/', views.register, name='register'),
    path('login/', views.login_view, name='login'),
]

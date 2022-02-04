from django.urls import path, include
from user import views

urlpatterns = [
    path('', views.main, name='main'),
    path('main/', views.main, name='navbar-main'),
    path('sign-up/', views.sign_up, name='signup'),
    path('sign-in/', views.sign_in, name='signin'),
]
from django.urls import path, include
from user import views

urlpatterns = [
    path('', views.start, name='main'),
    path('main/', views.start, name='navbar-main'),
    path('sign-up/', views.sign_up, name='signup'),
    path('sign-in/', views.sign_in, name='signin'),
    path('error/', views.error, name="error"),
    path('logout/', views.logout, name='logout'),
]
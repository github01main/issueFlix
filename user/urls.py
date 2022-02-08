from django.urls import path, include
from user import views

urlpatterns = [
    path('', views.start, name='main'),
    path('sign-up/', views.sign_up, name='signup'),
    path('sign-in/', views.sign_in, name='signin'),
    path('error/', views.error, name="error"),
    path('developer/', views.developer, name='about'),
    path('logout/', views.logout, name='logout'),

    path('country/', views.watching_news, name='country-name'),
]
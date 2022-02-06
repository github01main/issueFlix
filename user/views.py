from http.client import HTTPResponse
from django.shortcuts import render, redirect
from user.models import UserModel
from django.contrib import auth
from django.contrib.auth import get_user_model

def start(request):
    return render(request, 'main.html')

def sign_up(request):
    if request.method == "POST":
        username = request.POST.get('username', '')
        password = request.POST.get('password', '')
        nickname = request.POST.get('nickname', '')

        exist_user = get_user_model().objects.filter(username=username)
        
        if exist_user:
            return render(request, 'signin.html')
        else:
            UserModel.objects.create_user(username=username, password=password, nickname=nickname)
            return redirect('/sign-in')

    elif request.method == "GET": 
        return render(request, 'signin.html')

def sign_in(request):
    if request.method == "GET":
        return render(request, 'signin.html')

    elif request.method == "POST":
        username = request.POST.get('signin_username', None)
        password = request.POST.get('signin_password', None)

        # Not used authenticate
        me = UserModel.objects.get(username=username)  # 사용자 불러오기
        if me.password == password:  # 저장된 사용자의 패스워드와 입력받은 패스워드 비교
            request.session['user'] = me.username
            return redirect('/main')

        # Used authenticate > error
        # me = auth.authenticate(request, username=username, password=password)
        # if me is not None:
        #     auth.login(request, me)
        #     return redirect('/main')
        # else:
        #     return redirect('/sign-in')
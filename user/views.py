from django.shortcuts import render, redirect
from user.models import UserModel
from django.contrib import auth

def start(request):
    return render(request, 'index.html')

def sign_up(request):
    if request.method == "POST":
        username = request.POST.get('username', '')
        password = request.POST.get('password', '')
        nickname = request.POST.get('nickname', '')

        exist_user = UserModel.objects.filter(username=username)
        if exist_user:
            return redirect('sign-up/', {'error': '아이디 존재'})
        else:
            new_user = UserModel()
            new_user.username = username
            new_user.password = password
            new_user.nickname = nickname
            new_user.save()
        
        return redirect('/')
    elif request.method == "GET": 
        return render(request, 'index.html')

def sign_in(request):

    if request.method == "POST":
        username = request.POST.get('signin_username', None)
        password = request.POST.get('signin_password', None)

        me = UserModel.objects.get(username=username)

        if me.password == password:
            request.session['user'] = me.username
            return render(request, 'main.html')
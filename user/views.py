from django.shortcuts import render, redirect
from user.models import UserModel
from django.contrib import messages

def start(request):
    return render(request, 'index.html')

def sign_up(request):
    if request.method == "POST":
        username = request.POST.get('username', '')
        password = request.POST.get('password', '')
        nickname = request.POST.get('nickname', '')

        exist_user = UserModel.objects.filter(username=username)
        if exist_user:
            return render(request, 'index.html', {'error' : '사용자가 존재합니다.'}) 
        else:
            new_user = UserModel()
            new_user.username = username
            new_user.password = password
            new_user.nickname = nickname
            new_user.save()
        
        return redirect('/')

def sign_in(request):

    if request.method == "POST":
        username = request.POST.get('username', None)
        password = request.POST.get('password', None)

        me = UserModel.objects.get(username=username)

        if me.password == password:
            request.session['user'] = me.username
            return render(request, 'main.html')

        if me is None:
            messages.info(request, '아이디가 존재합니다.')

        elif me.password != password:
            messages.info(request, '비밀번호가 다릅니다.')
        
        elif username == '' or password == '':
            messages.info(request, '공백이 있습니다.')
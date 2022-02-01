from django.shortcuts import render, redirect
from user.models import UserModel

def start(request):
    return render(request, 'index.html')

def sign_up(request):

    if request.method == "POST":
        username = request.POST.get('username', '')
        password = request.POST.get('password', '')
        password_check = request.POST.get('password_check', '')
        nickname = request.POST.get('nickname', '')

        if password != password_check:
            return redirect('/sign-up', {'error' : '비밀번호가 다릅니다.'})

        else:
            if username == '' or password == '' or nickname == '':
                return render(request, 'index.html', {'error' : '공백이 있습니다.'})

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
        else:
            return redirect('/')
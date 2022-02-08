from django.shortcuts import render, redirect
from user.models import UserModel
from django.contrib import auth
from django.contrib.auth import get_user_model
from django.contrib.auth.decorators import login_required

from django.http import JsonResponse
from selenium import webdriver
from bs4 import BeautifulSoup


def start(request):
    return render(request, 'main.html')

def sign_up(request):
    if request.method == "POST":
        username = request.POST.get('username', '')
        password = request.POST.get('password', '')
        nickname = request.POST.get('nickname', '')

        exist_user = get_user_model().objects.filter(username=username)
        
        if exist_user:
            return render(request, 'signin_not.html')
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

        me = auth.authenticate(request, username=username, password=password)
        if me is not None:
            auth.login(request, me)
            #return render(request, 'main.html')
            return redirect('/')
        else:
            return redirect('/sign-in')


def error(request):
    return render(request, 'error.html')

def developer(request):
    return render(request, 'developer.html')

@login_required
def logout(request):
    auth.logout(request)
    return redirect('/')

#포스트 방식을 ajax로 구현함.
#왜냐면 크롤링하는데 로딩이 꽤 길기떄문에 비동기로해서 데이터를 효율적으로 불러오기 위함.
#Form 형식의 포스트 방식은 동기방식으로 동시에 페이지가 로딩되기 때문에 이 기능에선 비효율적이다.
def watching_news(request):
    if request.method == 'POST':
        country_name = request.POST.get('country_name', None)
        world_News = crawling_news(country_name)

        #world_News 값은 [{},{},{}]의 형태이다. 조회수에 따라 리스트 안 '딕셔너리'를 내림차순 해야하기에 다시 정리해주는 부분이다.
        #보는 것 처럼 'K'가 있는지에 따라 구분이 안되면, 999가 123K보다 크다고 정렬이 됨. 그래서 K를 갖고있는 녀석끼리만 비교를 해준다.
        sorting_News = []
        for i in world_News:
            if i['Views'][-1] == 'K':
                sorting_News.append(i)
        #조회수에서 'K'를 갖고있는 녀석끼리 다시 리스트화 해줬다면, 이제는 조회수를 숫자만 받아서 문자에서 실수로 바꿔준 다음 내림차순으로 정렬해준다.
        sorting_News = sorted(sorting_News, key=lambda x: float(x['Views'][:-1]), reverse=True)

        # 마지막으로 조회수에 맞춰 정렬된 sorting_News를 위에서부터 5개만 즉, 조회수 탑 5의 기사만을 가져와서 클라이언트에 보내준다.
        all_News = []
        for i in sorting_News[:5]:  # 최신 기사 탑 5!
            all_News.append(i)

        # ajax를 사용했기에 리턴 값도 제이슨으로 넘겨야한다. 따라서 from django.http import JsonResponse 선언해준다.
        # 내가 이해한 바로는 all_News라는 파이썬 데이터를 자바스크립로 넘겨주기 위해 json언어로 번역해서 준다고 이해함.
        return JsonResponse(all_News, safe=False)
        # 원래는 들어가는 값이 딕트 형태여야 하는데, safe=False를 선언하게 되면 다른 형태여도 상관없음. 나는 리스트 형태이기에 safe=False를 선언해줌

    elif request.method == 'GET':
        return render(request, 'main.html')


#############크로링 함수#############

urls = {'EK':'https://www.youtube.com/c/BBCNews/',
        'America':"https://www.youtube.com/c/FoxNews/",
        'Japan':"https://www.youtube.com/channel/UCuTAXTexrhetbOe3zgskJBQ/",
        'Korea':"https://www.youtube.com/c/MBCNEWS11/",
        'China':"https://www.youtube.com/c/cctv/"}

#헤더리스 해결
options = webdriver.ChromeOptions()
options.add_argument('headless')
options.add_argument('--log-level=1')

def crawling_news(country):
    News_data = []
    ''' 드라이버 크롤링 프로그램입니다. '''
    driver = webdriver.Chrome('user/mac_m1/chromedriver', options=options)
    ''' .format은 /videos? 앞에 유튜브 채널주소값을 가져온것입니다. '''
    driver.get('{0}/videos?view=0&sort=dd&flow=grid'.format(urls[country]))
    ''' 크롤링한 데이터의 문자가 깨지지 않도록 utf-8을로 인코딩한다. '''
    content = driver.page_source.encode('utf-8').strip()
    ''' 인코딩한 문자를 lxml로 파싱한다. '''
    soup = BeautifulSoup(content, 'lxml')

    # informations
    ''' 올라온 동영상의 타이틀을 가져온다. '''
    posted_titles = soup.findAll('a', id='video-title')
    ''' 올라온 동영상의 조회수, 올린시간을 가져온다. '''
    posted_views = soup.findAll('span', attrs={'class':'style-scope ytd-grid-video-renderer'})
    ''' 올라온 동영상의  url을 가져온다. '''
    posted_video_urls = soup.findAll('a', id='video-title')
    ''' 올라온 동영상의 idx 첫번째는 조회수 41번줄에  +1로 올린시간 위치값을 가져온다. '''
    idx = 0
    video_link_idx = 0
    for single_posted_title in posted_titles[:25]:

        Title_name = single_posted_title.text
        Views_count = posted_views[idx].text[:4] #[:4]를 한 이유는 조회수가 '123K views' or '1.2k views' or '123 views' 로 나와서 공통 된 부분만 빼오기 위해 4번째까지 값만 가져온다.
        Date_data = posted_views[idx+1].text
        Link = 'https://www.youtube.com/embed/' + posted_video_urls[video_link_idx].get("href")[9:]
        result = {
            "Title" : Title_name,
            "Views":Views_count,
            "Date":Date_data,
            "Link":Link,
        }

        News_data.append(result)
        idx += 2
        video_link_idx += 1

    return News_data
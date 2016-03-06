from django.shortcuts import get_object_or_404, render
from django.http import HttpResponseRedirect
from django.core.urlresolvers import reverse
from django.views import generic
from django.views.generic.edit import CreateView
from django.utils import timezone
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout

from stickers.models import User, Sticker


class IndexView(generic.ListView):
    template_name = 'stickers/index.html'
    context_object_name = 'latest_stickers'

    def get_queryset(self):
        return Sticker.objects.order_by('-date')[:50]


def home():
    return HttpResponseRedirect(reverse('stickers:index'))

def login_view(request):
    username = request.POST.get('username')
    password = request.POST.get('password')
    user = authenticate(username=username, password=password)
    if user is not None:
        login(request, user)
    return home()

def logout_view(request):
    logout(request)
    return home()

def user_create(request):
    User.objects.create_user(
        username=request.POST.get('username'),
        password=request.POST.get('password'),
        email=request.POST.get('email'),
    )
    return home()

def sticker_create(request):
    Sticker.objects.create(
        author=User.objects.get(id=1),
        title=request.POST.get('title'),
        description=request.POST.get('description'),
        color=request.POST.get('color')
    )
    return home()

def sticker_delete(request):
    sticker = Sticker.objects.get(id=request.POST.get('id'))
    sticker.delete()
    return home()
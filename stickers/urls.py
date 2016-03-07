from django.conf.urls import patterns, url
from django.contrib.auth import views as auth_views
from django.contrib.auth.decorators import login_required
from django.views.generic import TemplateView

from stickers import views


app_name = 'stickers'
urlpatterns = [
    url(r'^$',          views.IndexView.as_view(), name='index'),
    url(r'^login/$',    views.login_view,          name='login'),
    url(r'^logout/$',   views.logout_view,         name='logout'),
    url(r'^register/$', views.user_create,         name='register'),
    url(r'^create/$',   views.sticker_create,      name='create'),
    url(r'^delete/$',   views.sticker_delete,      name='delete'),
]
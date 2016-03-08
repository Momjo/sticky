from django.conf.urls import url
from django.contrib.auth import views as auth_views

from stickers import views
from stickers.decorators import redirect_if_logged_in


app_name = 'stickers'

urlpatterns = [
    url(
        r'^$',
        views.IndexView.as_view,
        name='index'
    ),
    url(
        r'^login/$',
        redirect_if_logged_in(auth_views.login),
        {'template_name': 'stickers/index.html'},
        name='login'
    ),
    url(
        r'^logout/$',
        views.logout_view,
        name='logout'
    ),
    url(
        r'^register/$',
        redirect_if_logged_in(views.user_create),
        name='register'
    ),
    url(
        r'^create/$',
        views.sticker_create,
        name='create'
    ),
    url(
        r'^delete/(?P<pk>[0-9]+)/$',
        views.StickerDelete.as_view(),
        name='delete'
    ),
]

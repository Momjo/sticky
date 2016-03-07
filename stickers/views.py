from django.http import HttpResponseRedirect, Http404
from django.core.urlresolvers import reverse
from django.views import generic
from django.views.generic.edit import DeleteView
from django.contrib.auth import logout

from stickers.models import User, Sticker


class IndexView(generic.ListView):
    template_name = 'stickers/index.html'
    context_object_name = 'latest_stickers'

    def get_queryset(self):
        return Sticker.objects.order_by('-date')[:50]


def home():
    return HttpResponseRedirect(reverse('stickers:index'))


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


class StickerDelete(DeleteView):
    model = Sticker
    success_url = ('sticker:index')

    def get_object(self, queryset=None):
        """
        :rtype: Sticker
        """
        obj = super(StickerDelete, self).get_object(queryset)
        """:type obj: Sticker"""

        if obj.author != self.request.user:
            raise Http404

        return obj


def sticker_delete(request):
    sticker = Sticker.objects.get(id=request.POST.get('id'))
    sticker.delete()
    return home()
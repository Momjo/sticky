from django.contrib.auth.decorators import login_required

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


@login_required
def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse('stickers:index'))


def user_create(request):
    User.objects.create_user(
        username=request.POST.get('username'),
        password=request.POST.get('password'),
        email=request.POST.get('email'),
    )
    return HttpResponseRedirect(reverse('stickers:index'))


@login_required
def sticker_create(request):
    Sticker.objects.create(
        author=request.user,
        title=request.POST.get('title'),
        description=request.POST.get('description'),
        color=request.POST.get('color')
    )
    return HttpResponseRedirect(reverse('stickers:index'))


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

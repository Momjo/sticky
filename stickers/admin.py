from django.contrib import admin

from .models import User, Sticker


class StickerAdmin(admin.ModelAdmin):
    list_display = ('title', 'date', 'color')
    search_fields = ['title', 'color']
    list_filter = ['date', 'color']


admin.site.register(User)
admin.site.register(Sticker, StickerAdmin)

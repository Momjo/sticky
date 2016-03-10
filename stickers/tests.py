from django.core.urlresolvers import reverse
from django.test import TestCase
from stickers.models import User, Sticker


class TestViews(TestCase):
    def test_sticker_create(self):
        User.objects.create_user(
            email='e@mail.com',
            username='alireza',
            password='password88'
        )

        attrs = {
            'color': 'blue',
            'description': "yep!",
            'title': 'Hello boy',
        }

        response = self.client.post(
            path=reverse('stickers:create'),
            data=attrs
        )

        self.assertEqual(response.status_code, 302)

        response = self.client.post(
            path=reverse('stickers:login'),
            data={
                'username': 'alireza',
                'password': 'password88'
            }
        )

        self.assertEqual(response.status_code, 302)

        response = self.client.post(
            path=reverse('stickers:create'),
            data=attrs
        )

        self.assertEqual(response.status_code, 200)

        stickers = Sticker.objects.all()

        self.assertEqual(stickers.count(), 1)

        obj = stickers[0]
        self.assertEqual(obj.color, attrs['color'])

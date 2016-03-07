from __future__ import unicode_literals

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models



class UserManager(BaseUserManager):

    def create_user(self, email, username, password):

        if not email or not username or not password:
            raise ValueError('User must have a valid email, username and email.')

        user = self.model(
            email=UserManager.normalize_email(email), 
            username=username
        )
        user.set_password(password)
        user.save()

        return user

    def create_superuser(self, email, username, password):

        user = self.create_user(
            email,
            username,
            password
        )
        user.save(using=self._db)
        return user

class User(AbstractBaseUser):

    email = models.EmailField(
        verbose_name='email',
        max_length=254,
        unique=True,
        db_index=True
    )
    username = models.CharField(
        verbose_name='username',
        max_length=30,
        unique=True
    )
    date_joined = models.DateTimeField(
        verbose_name='date joined',
        auto_now_add=True,
        editable=False
    )
    is_staff = models.BooleanField(
        default=False
    )

    objects = UserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        get_latest_by = 'date_joined'
        ordering = ['-date_joined', ]

    def save(self, *args, **kwargs):
        super(User, self).save(*args, **kwargs)

    def __unicode__(self):
        return self.username



class Sticker(models.Model):
    author      = models.ForeignKey(User, on_delete=models.CASCADE)
    title       = models.CharField(max_length=200)
    color       = models.CharField(max_length=50, default='lightgrey')
    date        = models.DateTimeField(verbose_name='date created', auto_now_add=True)
    description = models.TextField()

    def __unicode__(self):
        return self.title

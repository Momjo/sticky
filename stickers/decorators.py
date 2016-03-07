from django.shortcuts import redirect
from functools import wraps


def redirect_if_logged_in(method):
    """
    Decorator to check if the current use on our beloved request has been
    logged in, if ``True`` the current user will be redirected to
    his/her profile page.

    :return: The decorated method or Http redirect response if the user
    is logged in.
    :rtype: bool
    """
    @wraps(method)
    def __wrapped_view(request, *args, **kwargs):
        if request.user.is_authenticated():
            return redirect(request.user.get_absolute_url())

        return method(request, *args, **kwargs)

    return __wrapped_view
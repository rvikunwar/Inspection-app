from django.contrib.auth.models import AnonymousUser
from channels.db import database_sync_to_async
from urllib.parse import parse_qs
from jwt import decode as jwt_decode
from django.contrib.auth import get_user_model
from django.conf import settings

User = get_user_model()


@database_sync_to_async
def get_user(user_id):
    try:
        return User.objects.get(id=user_id)
    except User.DoesNotExist:
        return AnonymousUser()


class TokenAuthMiddleware:
    """
    Custom middleware (insecure) that takes user IDs from the query string.
    """

    def __init__(self, app):
        # Store the ASGI application we were passed
        self.app = app

    async def __call__(self, scope, receive, send):
        # Look up user from query string (you should also do things like
        # checking if it is a valid user ID, or if scope["user"] is already
        # populated).
        token = parse_qs(scope["query_string"].decode("utf8"))["token"][0]
        decoded_data = jwt_decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        scope['user'] = await get_user(decoded_data["user_id"])

        return await self.app(scope, receive, send)


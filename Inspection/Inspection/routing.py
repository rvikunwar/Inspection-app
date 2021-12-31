import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from chatapp import routing
from Notifications import routing as notificationRouting

from .channelsmiddleware import TokenAuthMiddleware


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Inspection.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": TokenAuthMiddleware(
        URLRouter(
            routing.websocket_urlpatterns +
            notificationRouting.websocket_urlpatterns
        )
    ),
})

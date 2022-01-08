from django.urls import path
from .api import *


urlpatterns = [
    path('fetch/', FetchNotification.as_view(), name="fetch-notification"),
]
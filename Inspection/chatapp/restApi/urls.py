from django.urls import path
from .api import *


urlpatterns = [
    path('messengerList/', messengerListAPI.as_view(), name="messenger-list"),
    path('fetchmessages/', FetchMessages.as_view(), name="fetch-messages"),

]
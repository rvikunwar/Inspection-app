from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from .models import Notifications
from .serializers import NotificationSerializers

User = get_user_model()


def get_notifications(user):
    notifications = (Notifications.objects.filter(reciever=user, is_seen=True).order_by('-timestamp') |
                           Notifications.objects.filter(reciever=user, is_seen=False).order_by('-timestamp')[:10])
    serializer = NotificationSerializers(notifications, many=True)

    return serializer.data


def get_current_user(user):
    return get_object_or_404(User, id=int(user))


def get_notification_count(user):
    count = Notifications.objects.filter(reciever=user, is_seen=False).count()
    return count

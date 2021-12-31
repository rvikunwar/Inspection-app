from django.contrib.auth import get_user_model
from channels.generic.websocket import WebsocketConsumer
import json
from .views import get_notifications, get_current_user, get_notification_count
from .models import Notifications
from asgiref.sync import async_to_sync
from .serializers import NotificationSerializers
User = get_user_model()


class NotificationConsumer(WebsocketConsumer):

    def fetch_notifications(self, data):
        user = self.scope['user']
        notifications = get_notifications(user)
        content = {
            'command': 'fetch_notifications',
            'notifications': notifications,
        }
        self.send_notifications(content)

    def new_notification(self, data):
        user = self.scope['user']
        reciever = data['reciever']
        notification = Notifications.objects.create(
            sender=user,
            reciever=get_current_user(reciever),
            content=data['content'],
        )
        serializer = NotificationSerializers(notification)

        content = {
            'command': 'new_notification',
            'notification': serializer.data
        }
        if reciever == self.scope['user'].id:
            return self.send_notification_message(content)

    def count_notifications(self, data):
        user = self.scope['user']
        count = get_notification_count(user)
        content = {
            'command': 'count_notifications',
            'unseen_notifications': count
        }
        self.send(text_data=json.dumps(content))

    def update_notification_seen_status(self, data):
        user = self.scope['user']
        Notifications.objects.filter(reciever=user, is_seen=False).update(is_seen=True)

    commands = {
        'fetch_notifications': fetch_notifications,
        'new_notification': new_notification,
        'count_notifications': count_notifications,
        'update_notification_seen_status': update_notification_seen_status
    }

    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'notification_%s' % self.room_name
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )
        self.accept()

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    def receive(self, text_data):
        data = json.loads(text_data)
        self.commands[data['command']](self, data)

    def send_notification_message(self, notification):
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'new_notification_message',
                'notification': notification
            }
        )

    def new_notification_message(self, event):
        notification = event['notification']
        self.send(text_data=json.dumps(notification))

    def send_notifications(self, notification):
        self.send(text_data=json.dumps(notification))

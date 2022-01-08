from django.contrib.auth import get_user_model
from channels.generic.websocket import WebsocketConsumer
import json
from accounts.models import Profile
from .models import Notifications
from asgiref.sync import async_to_sync
from .utils import send_push_message, get_current_user
User = get_user_model()
from chatapp.models import MemberMessages


class NotificationConsumer(WebsocketConsumer):

    def new_notification(self, data):
        user = self.scope['user']
        user_profile = Profile.objects.get(user=user.id)
        data = data['data']
        reciever = data['reciever']
        notification = Notifications.objects.create(
            sender=user_profile,
            reciever=get_current_user(reciever),
            title=data['title1'],
            content=data['content'],
        )
        notification.save()
        profile = Profile.objects.filter(user=reciever).first()
        profile.notification_count = profile.notification_count + 1
        profile.save()

        try:
            tokens = profile.expo_token.all()
            message = profile.first_name + " " + profile.last_name + " " + data['content']
            for tk in tokens:
                send_push_message(str(tk), data['title'] + " " + f"({data['title1']})", message)
        except:
            print("some error occured while sending push notification")

        content = {
            'command': 'new_notification',
        }
        return self.send_notification_message(content, reciever)

    def update_notification_seen_status(self, data):
        id = self.scope['user']
        Notifications.objects.filter(reciever=id, is_seen=False).update(is_seen=True)

    def update_notification_count_to_zero(self, data):
        user = self.scope['user']
        Profile.objects.filter(user=user).update(notification_count=0)

    def set_online_status(self, data):
        id = self.scope['user']
        try:
            print('online status change')
            profile = Profile.objects.get(user=id)
            profile.online = data['status']
            profile.save()

        except:
            print('something went wrong!!')

    def update_coordinates(self, data):
        id = self.scope['user']
        data = data['data']
        try:
            profile = Profile.objects.get(user=id)
            profile.latitude = data['latitude']
            profile.longitude = data['longitude']
            profile.save()

        except:
            print('something went wrong while updating coordinates')

    def get_message_notification_count(self, data):
        id = self.scope['user']
        profile = Profile.objects.get(user=id)
        messages = profile.un_seen_messages
        notification = profile.notification_count
        content = {
            'command': 'get_message_notification_count',
            'notification':  notification,
            'messages': messages
        }
        self.send(text_data=json.dumps(content))

    def set_messages_count_to_zero(self, data):
        try:
            id = self.scope['user']
            profile = Profile.objects.get(user_id=id)
            profile.un_seen_messages = 0
            profile.save()
        except:
            print('something went wrong')

    def update_message_seen_status(self, data):
        id = self.scope['user']
        sender = data['sender']
        print('seen message count update', sender, id)
        try:
            MemberMessages.objects.filter(reciever=id, sender_id=sender, is_seen=False).update(is_seen=True)
        except:
            print('error')

    commands = {
        'new_notification': new_notification,
        'update_notification_seen_status': update_notification_seen_status,
        'update_notification_count_to_zero': update_notification_count_to_zero,
        'set_online_status': set_online_status,
        'get_message_notification_count': get_message_notification_count,
        'update_coordinates': update_coordinates,
        'set_messages_count_to_zero': set_messages_count_to_zero,
        'update_message_seen_status': update_message_seen_status
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

    def send_notification_message(self, notification, reciever):
        async_to_sync(self.channel_layer.group_send)(
            'notification_%s' % reciever,
            {
                'type': 'new_notification_message',
                'notification': notification
            }
        )

    def new_notification_message(self, event):
        notification = event['notification']
        self.send(text_data=json.dumps(notification))

